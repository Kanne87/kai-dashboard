const isProduction = process.env.NODE_ENV === 'production'

const cookieBase = [
  'Path=/',
  'HttpOnly',
  'SameSite=Lax',
  isProduction ? 'Secure' : '',
].filter(Boolean)

export function appendCookie(
  headers: Headers,
  name: string,
  value: string,
  maxAge = 180,
) {
  headers.append(
    'Set-Cookie',
    [`${name}=${value}`, ...cookieBase, `Max-Age=${maxAge}`].join('; '),
  )
}

export function clearCookie(headers: Headers, name: string) {
  headers.append(
    'Set-Cookie',
    [
      `${name}=`,
      ...cookieBase,
      'Max-Age=0',
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ].join('; '),
  )
}
