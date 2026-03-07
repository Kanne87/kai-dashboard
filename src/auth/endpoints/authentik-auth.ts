import crypto from 'crypto'
import { type Endpoint, type PayloadRequest } from 'payload'
import { appendCookie } from '../cookies'

export const authentikAuth: Endpoint = {
  handler: async (req: PayloadRequest): Promise<Response> => {
    const url = new URL(req.url ?? '')
    const returnTo = url.searchParams.get('returnTo') || '/admin'
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!

    try {
      const nonce = crypto.randomUUID()

      // Encode returnTo in state as JSON so it survives cross-site cookie blocking
      const statePayload = JSON.stringify({ nonce, returnTo })
      const stateEncoded = Buffer.from(statePayload).toString('base64url')

      const params = new URLSearchParams({
        client_id: process.env.AUTHENTIK_CLIENT_ID!,
        redirect_uri: `${baseUrl}/api/users/auth/authentik/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        state: stateEncoded,
      })

      const headers = new Headers()
      // Still set cookie as verification (nonce only), but flow works without it
      appendCookie(headers, 'oauthNonce', nonce)

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
