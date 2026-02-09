import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const returnTo = searchParams.get('returnTo') || '/'

  const params = new URLSearchParams({
    client_id: process.env.AUTHENTIK_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/authentik/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state: returnTo,
  })

  return NextResponse.redirect(
    `${process.env.AUTHENTIK_AUTHORIZATION_URL}?${params.toString()}`,
  )
}
