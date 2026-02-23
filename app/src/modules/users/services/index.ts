import { API_BASE_URL } from '@/shared/constants'
import type {
  CreateUserPayload,
  ListUsersParams,
  ListUsersResult,
  UpdateUserPayload,
  User,
} from '../domain/types'

const usersUrl = () => `${API_BASE_URL}/users`

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function listUsers(params: ListUsersParams): Promise<ListUsersResult> {
  const { search, page, limit } = params
  const q = new URLSearchParams()
  q.set('page', String(page))
  q.set('limit', String(limit))
  if (search?.trim()) q.set('search', search.trim())
  const url = `${usersUrl()}?${q}`
  return request<ListUsersResult>(url)
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  return request<User>(usersUrl(), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getUserById(id: string): Promise<User> {
  return request<User>(`${usersUrl()}/${id}`)
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  return request<User>(`${usersUrl()}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteUser(id: string): Promise<void> {
  return request<void>(`${usersUrl()}/${id}`, { method: 'DELETE' })
}
