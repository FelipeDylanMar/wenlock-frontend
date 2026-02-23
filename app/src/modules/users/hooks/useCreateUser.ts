import { useCallback, useState } from 'react'
import type { CreateUserPayload, User } from '../domain/types'
import { createUser } from '../services'

export function useCreateUser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const create = useCallback(async (payload: CreateUserPayload) => {
    setLoading(true)
    setError(null)
    setUser(null)
    try {
      const created = await createUser(payload)
      setUser(created)
      return created
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setUser(null)
  }, [])

  return { create, loading, error, user, reset }
}
