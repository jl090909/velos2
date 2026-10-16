import type { CollectionConfig } from 'payload'

import { isAdminReq, selfOrAdmin } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Settings',
    defaultColumns: ['name', 'email', 'roles', 'updatedAt'],
    description: 'Staff accounts. HR owns Careers, Tech owns the Resources collections.',
  },
  auth: {
    tokenExpiration: 28800,
  },
  access: {
    // Anyone may create a user only while the collection is still empty (first-user bootstrap).
    create: async ({ req }) => {
      if (isAdminReq(req)) {
        return true
      }
      const existing = await req.payload.count({ collection: 'users' })
      return existing.totalDocs === 0
    },
    delete: ({ req }) => isAdminReq(req),
    read: selfOrAdmin,
    update: selfOrAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      index: true,
      options: [
        { label: 'Admin - full CMS access', value: 'admin' },
        { label: 'HR - job openings', value: 'hr' },
        { label: 'Tech - whitepapers + knowledge hub', value: 'tech' },
        { label: 'Editor - read access', value: 'editor' },
      ],
      access: {
        // Only admins may change role assignments, so nobody can promote themselves.
        update: ({ req }) => isAdminReq(req),
      },
    },
    {
      name: 'jobTitle',
      type: 'text',
      admin: { description: 'Shown as the author title on Knowledge Hub articles.' },
    },
  ],
  timestamps: true,
}
