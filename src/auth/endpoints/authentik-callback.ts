import crypto from 'crypto'
import { type Endpoint, parseCookies, type PayloadRequest } from 'payload'
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

      // 1. Exchange code for tokens at Authentik
      const tokenRes = await fetch(process.env.AUTHENTIK_TOKEN_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: process.env.AUTHENTIK_CLIENT_ID!,
          client_secret: process.env.AUTHENTIK_CLIENT_SECRET!,
          redirect_uri: `${baseUrl}/api/users/auth/authentik/callback`,
        }),
      })
      const tokens = await tokenRes.json()

      if (!tokens.access_token) {
        console.error('Authentik token error:', tokens)
        return errorRedirect('token_error')
      }

      // 2. Fetch user info from Authentik
      const userinfoRes = await fetch(process.env.AUTHENTIK_USERINFO_URL!, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      const userinfo = await userinfoRes.json()
      console.log('Authentik userinfo:', JSON.stringify(userinfo))

      if (!userinfo.email) {
        console.error('No email in userinfo')
        return errorRedirect('no_email')
      }

      // 3. Find or create user in Payload
      let user: any = null

      // Try by authProviderId first
      const byProvider = await payload.find({
        collection: 'users',
        where: { authProviderId: { equals: userinfo.sub } },
        limit: 1,
      })

      if (byProvider.docs.length > 0) {
        user = byProvider.docs[0]
      } else {
        // Fallback: find by email
        const byEmail = await payload.find({
          collection: 'users',
          where: { email: { equals: userinfo.email } },
          limit: 1,
        })

        if (byEmail.docs.length > 0) {
          user = byEmail.docs[0]
          // Link to Authentik
          await payload.update({
            collection: 'users',
            id: user.id,
            data: {
              authProvider: 'authentik',
              authProviderId: userinfo.sub,
            },
          })
        } else {
          // Create new user with role mapping
          const groups: string[] = userinfo.groups || []
          let role = 'advisor'
          if (groups.includes('authentik Admins')) role = 'super-admin'
          else if (groups.includes('assistenten')) role = 'assistant'

          const tempPassword = crypto.randomUUID() + crypto.randomUUID()
          user = await payload.create({
            collection: 'users',
            data: {
              email: userinfo.email,
              name: userinfo.name || userinfo.preferred_username,
              role,
              authProvider: 'authentik',
              authProviderId: userinfo.sub,
              password: tempPassword,
            },
          })
        }
      }

      // 4. Generate a temporary password and use payload.login()
      // This is the ONLY way to get a token that Payload will accept
      const tempPassword = crypto.randomUUID() + crypto.randomUUID()

      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          password: tempPassword,
          name: userinfo.name || userinfo.preferred_username || user.name,
        },
      })

      // 5. Login with the temporary password to get a valid token
      const loginResult = await payload.login({
        collection: 'users',
        data: {
          email: userinfo.email,
          password: tempPassword,
        },
      })

      if (!loginResult.token) {
        console.error('Login failed - no token returned')
        return errorRedirect('login_failed')
      }

      console.log('OAuth login successful for:', userinfo.email)

      // 6. Use the token from payload.login() - this is guaranteed to work
      const cookiePrefix = payload.config.cookiePrefix || 'payload'
      const cookieName = `${cookiePrefix}-token`
      const maxAge = 604800 // 7 days
      const cookieString = `${cookieName}=${loginResult.token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`

      // Return HTML page that sets the cookie and redirects
      // Browsers ignore Set-Cookie on 302 redirects from cross-site navigations
      const finalUrl = `${baseUrl}${returnTo}`
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Anmeldung erfolgreich</title>
  <meta http-equiv="refresh" content="0;url=${finalUrl}">
</head>
<body>
  <p>Anmeldung erfolgreich, Weiterleitung...</p>
  <script>window.location.href="${finalUrl}";</script>
</body>
</html>`

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Set-Cookie': cookieString,
        },
      })
    } catch (error) {
      console.error('Authentik callback error:', error)
      return errorRedirect('oauth_failed')
    }
  },
  method: 'get',
  path: '/auth/authentik/callback',
}
