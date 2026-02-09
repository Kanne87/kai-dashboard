import crypto from 'crypto'
import { type Endpoint, type PayloadRequest } from 'payload'
import { appendCookie } from '../cookies'

export const authentikAuth: Endpoint = {
  handler: async (req: PayloadRequest): Promise<Response> => {
    const url = new URL(req.url ?? '')
    const returnTo = url.searchParams.get('returnTo') || '/admin'
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!

    try {
      const state = crypto.randomUUID()

      const params = new URLSearchParams({
        client_id: process.env.AUTHENTIK_CLIENT_ID!,
        redirect_uri: `${baseUrl}/api/users/auth/authentik/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        state,
      })

      const headers = new Headers()
      appendCookie(headers, 'oauthState', state)
      appendCookie(headers, 'oauthReturnTo', returnTo)

      headers.set(
        'Location',
        `${process.env.AUTHENTIK_AUTHORIZATION_URL}?${params.toString()}`,
      )
      return new Response(null, { headers, status: 302 })
    } catch (error) {
      console.error('Authentik auth error:', error)
      const headers = new Headers()
      headers.set('Location', `${baseUrl}/admin/login?error=oauth_failed`)
      return new Response(null, { headers, status: 302 })
    }
  },
  method: 'get',
  path: '/auth/authentik',
}
