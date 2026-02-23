import { useCallback, useEffect, useState } from 'react'
import type { UpdateUserPayload, User } from '../domain/types'
import { getUserById, updateUser } from '../services'

export function useEditUser(id: string | null) {
  const [user, setUser] = useState<User | null>(null)
  const [loadLoading, setLoadLoading] = useState(false)
  const [loadError, setLoadError] = useState<Error | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    if (!id) {
      setUser(null)
      return
    }
    setLoadLoading(true)
    setLoadError(null)
    try {
      const u = await getUserById(id)
      setUser(u)
    } catch (e) {
      setLoadError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setLoadLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const update = useCallback(async (payload: UpdateUserPayload) => {
    if (!id) throw new Error('ID is required')
    setUpdateLoading(true)
    setUpdateError(null)
    try {
      const updated = await updateUser(id, payload)
      setUser(updated)
      return updated
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      setUpdateError(err)
      throw err
    } finally {
      setUpdateLoading(false)
    }
  }, [id])

  const reset = useCallback(() => {
    setLoadError(null)
    setUpdateError(null)
  }, [])

  return {
    user,
    loadLoading,
    loadError,
    updateLoading,
    updateError,
    update,
    refetch: load,
    reset,
  }
}
