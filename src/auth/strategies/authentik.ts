import { type AuthStrategy, type AuthStrategyResult } from 'payload'

export const authentikStrategy: AuthStrategy = {
  name: 'authentik',
  async authenticate({ headers, payload }): Promise<AuthStrategyResult> {
    const strategy = headers.get('x-auth-strategy')
    const code = headers.get('x-oauth-code')

    if (strategy !== 'authentik') return { user: null }
    if (!code) return { user: null }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!

      // 1. Exchange code for tokens
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
        return { user: null }
      }

      // 2. Fetch user info
      const userinfoRes = await fetch(process.env.AUTHENTIK_USERINFO_URL!, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      const userinfo = await userinfoRes.json()
      console.log('Authentik userinfo:', JSON.stringify(userinfo))

      if (!userinfo.email) {
        console.error('No email in userinfo')
        return { user: null }
      }

      // 3. Find or create Payload user
      // First try by authProviderId (Authentik sub)
      const byProvider = await payload.find({
        collection: 'users',
        where: { authProviderId: { equals: userinfo.sub } },
        limit: 1,
      })

      let user
      if (byProvider.docs.length > 0) {
        user = byProvider.docs[0]
        // Update name/email if changed
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            name: userinfo.name || userinfo.preferred_username,
            email: userinfo.email,
          },
        })
      } else {
        // Fallback: find by email to link existing users
        const byEmail = await payload.find({
          collection: 'users',
          where: { email: { equals: userinfo.email } },
          limit: 1,
        })

        if (byEmail.docs.length > 0) {
          user = byEmail.docs[0]
          await payload.update({
            collection: 'users',
            id: user.id,
            data: {
              name: userinfo.name || userinfo.preferred_username,
              authProvider: 'authentik',
              authProviderId: userinfo.sub,
            },
          })
        } else {
          // Create new user with role mapping from Authentik groups
          const groups: string[] = userinfo.groups || []
          let role = 'advisor'
          if (groups.includes('authentik Admins')) role = 'super-admin'
          else if (groups.includes('assistenten')) role = 'assistant'

          user = await payload.create({
            collection: 'users',
            data: {
              email: userinfo.email,
              name: userinfo.name || userinfo.preferred_username,
              role,
              authProvider: 'authentik',
              authProviderId: userinfo.sub,
              password: crypto.randomUUID(),
            },
          })
        }
      }

      // Return user with collection info for Payload session
      return {
        user: {
          ...user,
          collection: 'users',
          _strategy: 'authentik',
        },
      }
    } catch (error) {
      console.error('Authentik strategy error:', error)
      return { user: null }
    }
  },
}
