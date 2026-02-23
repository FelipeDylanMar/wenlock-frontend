import { useCallback, useEffect, useState } from 'react'
import type { ListUsersResult, User } from '../domain/types'
import { listUsers } from '../services'

const DEFAULT_LIMIT = 10

export function useUsersList(initialPage = 1, limit = DEFAULT_LIMIT) {
  const [data, setData] = useState<ListUsersResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(initialPage)
  const [search, setSearch] = useState('')

  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await listUsers({ search, page, limit })
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setLoading(false)
    }
  }, [search, page, limit])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const goToPage = useCallback((p: number) => {
    setPage((prev) => (p >= 1 ? p : prev))
  }, [])

  const setSearchTerm = useCallback((term: string) => {
    setSearch(term)
    setPage(1)
  }, [])

  return {
    items: data?.items ?? ([] as User[]),
    total: data?.total ?? 0,
    page,
    limit,
    loading,
    error,
    refetch: fetchList,
    setPage: goToPage,
    setSearch: setSearchTerm,
    search,
  }
}
