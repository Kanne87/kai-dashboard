import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!

  if (!code) {
    return NextResponse.redirect(new URL('/admin/login?error=no_code', baseUrl))
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch(process.env.AUTHENTIK_TOKEN_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.AUTHENTIK_CLIENT_ID!,
        client_secret: process.env.AUTHENTIK_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/authentik/callback`,
      }),
    })
    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      console.error('Authentik token error:', tokens)
      throw new Error('No access token received')
    }

    // 2. Fetch user info from Authentik
    const userinfoRes = await fetch(process.env.AUTHENTIK_USERINFO_URL!, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const userinfo = await userinfoRes.json()

    // 3. Find or create user in Payload
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        authProviderId: { equals: userinfo.sub },
      },
    })

    let user
    if (existingUsers.docs.length > 0) {
      user = existingUsers.docs[0]
      // Update name/email if changed in Authentik
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          name: userinfo.name || userinfo.preferred_username,
          email: userinfo.email,
        },
      })
    } else {
      // Fallback: search by email to link existing local users
      const emailUsers = await payload.find({
        collection: 'users',
        where: {
          email: { equals: userinfo.email },
        },
      })

      if (emailUsers.docs.length > 0) {
        // Link existing user to Authentik
        user = emailUsers.docs[0]
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
        // Create new user, map Authentik groups to Payload roles
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
            password: crypto.randomUUID(), // Dummy password, login only via Authentik
          },
        })
      }
    }

    // 4. Create JWT token (same format Payload expects)
    const token = jwt.sign(
      {
        id: user.id,
        collection: 'users',
        email: user.email,
      },
      process.env.PAYLOAD_SECRET!,
      { expiresIn: '7d' },
    )

    // 5. Redirect to frontend with token as cookie
    const redirectUrl = state || process.env.NEXT_PUBLIC_FRONTEND_URL || `${baseUrl}/admin`
    const response = NextResponse.redirect(new URL(redirectUrl, baseUrl))
    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Authentik OAuth error:', error)
    return NextResponse.redirect(new URL('/admin/login?error=oauth_failed', baseUrl))
  }
}
