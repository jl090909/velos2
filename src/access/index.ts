import type { Access, PayloadRequest } from 'payload'

export type Role = 'admin' | 'hr' | 'tech' | 'editor'

const STAFF_ROLES: Role[] = ['admin', 'hr', 'tech', 'editor']

export const rolesOf = (req: PayloadRequest): Role[] => {
  const user = req.user as { roles?: Role[] | null } | null | undefined
  const roles = user?.roles
  return Array.isArray(roles) ? roles : []
}

export const isAdminReq = (req: PayloadRequest): boolean => rolesOf(req).includes('admin')

export const hasRoleReq = (req: PayloadRequest, ...allowed: Role[]): boolean => {
  const roles = rolesOf(req)
  return allowed.some((role) => roles.includes(role))
}

export const isAdmin: Access = ({ req }) => isAdminReq(req)

export const anyone: Access = () => true

/** Logged-in user, or a where-constraint limiting an anonymous request to published docs. */
export const publishedOrStaff =
  (...staffRoles: Role[]): Access =>
  ({ req }) => {
    if (!req.user) {
      return { _status: { equals: 'published' } }
    }
    const roles = rolesOf(req)
    if (roles.length === 0) {
      return { _status: { equals: 'published' } }
    }
    if (roles.some((role) => staffRoles.includes(role) || role === 'admin')) {
      return true
    }
    return { _status: { equals: 'published' } }
  }

export const hasRole =
  (...allowed: Role[]): Access =>
  ({ req }) =>
    hasRoleReq(req, ...allowed)

/** Self, or any admin. */
export const selfOrAdmin: Access = ({ req }) => {
  if (!req.user) {
    return false
  }
  if (isAdminReq(req)) {
    return true
  }
  return { id: { equals: req.user.id } }
}

export const isStaffRole = (role: string): boolean => (STAFF_ROLES as string[]).includes(role)
