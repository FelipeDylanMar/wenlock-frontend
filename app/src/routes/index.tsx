import { UsersPage } from '@/modules/users/pages'

export const routes = [
  { path: '/', element: <UsersPage /> },
  { path: '/users', element: <UsersPage /> },
] as const
