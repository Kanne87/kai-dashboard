import crypto from 'crypto'
import {
  type Endpoint,
  jwtSign,
  parseCookies,
  type PayloadRequest,
} from 'payload'
import { clearCookie } from '../cookies'

export const authentikCallback: Endpoint = {
  handler: async (req: PayloadRequest): Promise<Response> => {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!
    const url = new URL(req.url ?? baseUrl)

    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    const state = url.searchParams.get('state')

    const cookie = parseCookies(req.headers)
    const oauthState = cookie.get('oauthState')
    const returnTo = cookie.get('oauthReturnTo') || '/admin'

    // Clear temporary OAuth cookies
    const headers = new Headers()
    clearCookie(headers, 'oauthState')
    clearCookie(headers, 'oauthReturnTo')

    const errorRedirect = (reason: string) => {
      headers.set('Location', `${baseUrl}/admin/login?error=${reason}`)
      return new Response(null, { headers, status: 302 })
    }

    if (error) {
      console.error('Authentik OAuth error:', error)
      return errorRedirect('provider_error')
    }

    if (!state || !oauthState || state !== oauthState) {
      console.error('Invalid OAuth state', { oauthState, state })
      return errorRedirect('invalid_state')
    }

    if (!code) {
      return errorRedirect('missing_code')
    }

    try {
      const payload = req.payload

      // Call payload.auth() which triggers the registered authentik strategy
      const authResult = await payload.auth({
        headers: new Headers({
          'x-auth-strategy': 'authentik',
          'x-oauth-code': code,
        }),
      })

      const { user } = authResult as {
        user: null | {
          id: number
          email: string
          collection: 'users'
          _strategy?: string
        }
      }

      if (!user) {
        console.error('Authentication failed: No user returned from strategy')
        return errorRedirect('auth_failed')
      }

      // Generate token using Payload's own jwtSign (uses hashed secret internally)
      const collection = payload.collections['users']
      const authConfig = collection.config.auth
      const secret = crypto
        .createHash('sha256')
        .update(payload.config.secret)
        .digest('hex')
        .slice(0, 32)

      const { token } = await jwtSign({
        fieldsToSign: {
          collection: 'users',
          email: user.email,
          id: user.id,
        },
        secret,
        tokenExpiration: authConfig.tokenExpiration,
      })

      // Build cookie manually to guarantee correct formatting (Secure, HttpOnly)
      const cookiePrefix = payload.config.cookiePrefix || 'payload'
      const cookieName = `${cookiePrefix}-token`
      const maxAge = authConfig.tokenExpiration || 7200
      const cookieValue = `${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`

      headers.set('Location', `${baseUrl}${returnTo}`)
      headers.append('Set-Cookie', cookieValue)

      return new Response(null, { headers, status: 302 })
    } catch (error) {
      console.error('Authentik callback error:', error)
      return errorRedirect('oauth_failed')
    }
  },
  method: 'get',
  path: '/auth/authentik/callback',
}
