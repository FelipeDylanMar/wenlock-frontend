export type User = {
  id: string
  name: string
  email: string
  matricula: string
}

export type CreateUserPayload = {
  name: string
  email: string
  matricula: string
  password: string
}

export type UpdateUserPayload = {
  name?: string
  email?: string
  matricula?: string
  password?: string
}

export type ListUsersParams = {
  search?: string
  page: number
  limit: number
}

export type ListUsersResult = {
  items: User[]
  total: number
  page: number
  limit: number
}
