import type { Access, FieldAccess } from 'payload'

/**
 * Authenticated users can perform this action.
 * Covers: advisor, assistant, super-admin
 */
export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

/**
 * Only super-admins can perform this action.
 */
export const isSuperAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'super-admin'
}

/**
 * Advisors and super-admins can perform this action.
 */
export const isAdvisorOrAbove: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'advisor'
}

/**
 * Standard collection access: authenticated users can read/create/update,
 * only super-admins can delete.
 */
export const standardAccess = {
  read: isAuthenticated,
  create: isAdvisorOrAbove,
  update: isAdvisorOrAbove,
  delete: isSuperAdmin,
}

/**
 * Open read access (for API-Key based integrations),
 * write restricted to authenticated users.
 */
export const apiAccess = {
  read: isAuthenticated,
  create: isAuthenticated,
  update: isAuthenticated,
  delete: isSuperAdmin,
}
