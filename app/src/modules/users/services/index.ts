import type {
  CreateUserPayload,
  ListUsersParams,
  ListUsersResult,
  UpdateUserPayload,
  User,
} from '../domain/types'

const STORAGE_KEY = 'wenlock_mock_users'

const MOCK_SEED: User[] = [
  { id: 'seed-1', name: 'Ana Paula Silva', email: 'ana.silva@example.com', matricula: '1001' },
  { id: 'seed-2', name: 'Bruno Oliveira Santos', email: 'bruno.santos@example.com', matricula: '1002' },
  { id: 'seed-3', name: 'Carla Mendes Costa', email: 'carla.costa@example.com', matricula: '1003' },
  { id: 'seed-4', name: 'Daniel Ferreira Lima', email: 'daniel.lima@example.com', matricula: '1004' },
  { id: 'seed-5', name: 'Elena Rodrigues Souza', email: 'elena.souza@example.com', matricula: '1005' },
  { id: 'seed-6', name: 'Fernando Almeida Pereira', email: 'fernando.pereira@example.com', matricula: '1006' },
  { id: 'seed-7', name: 'Gabriela Martins Rocha', email: 'gabriela.rocha@example.com', matricula: '1007' },
  { id: 'seed-8', name: 'Henrique Carvalho Dias', email: 'henrique.dias@example.com', matricula: '1008' },
  { id: 'seed-9', name: 'Isabela Nascimento Freitas', email: 'isabela.freitas@example.com', matricula: '1009' },
  { id: 'seed-10', name: 'João Pedro Barbosa', email: 'joao.barbosa@example.com', matricula: '1010' },
  { id: 'seed-11', name: 'Larissa Araújo Castro', email: 'larissa.castro@example.com', matricula: '1011' },
  { id: 'seed-12', name: 'Marcos Vinícius Teixeira', email: 'marcos.teixeira@example.com', matricula: '1012' },
  { id: 'seed-13', name: 'Natália Correia Gomes', email: 'natalia.gomes@example.com', matricula: '1013' },
  { id: 'seed-14', name: 'Otávio Henrique Lopes', email: 'otavio.lopes@example.com', matricula: '1014' },
  { id: 'seed-15', name: 'Patrícia Ribeiro Moreira', email: 'patricia.moreira@example.com', matricula: '1015' },
  { id: 'seed-16', name: 'Quintino Souza Barros', email: 'quintino.barros@example.com', matricula: '1016' },
]

let usersCache: User[] | null = null

function loadUsers(): User[] {
  if (usersCache) return usersCache

  if (typeof window === 'undefined') {
    usersCache = []
    return usersCache
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      usersCache = [...MOCK_SEED]
      saveUsers(usersCache)
      return usersCache
    }
    const parsed = JSON.parse(raw)
    const isNonEmptyArray = Array.isArray(parsed) && parsed.length > 0
    const hasEnoughForPagination = isNonEmptyArray && (parsed as User[]).length >= 16
    if (hasEnoughForPagination) {
      usersCache = parsed as User[]
    } else {
      usersCache = [...MOCK_SEED]
      saveUsers(usersCache)
    }
  } catch {
    usersCache = [...MOCK_SEED]
    saveUsers(usersCache)
  }
  return usersCache
}

function saveUsers(users: User[]): void {
  usersCache = users
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch {
  }
}

export async function listUsers(params: ListUsersParams): Promise<ListUsersResult> {
  const { search, page, limit } = params
  const all = loadUsers()

  const term = search?.trim().toLowerCase()
  const filtered = term
    ? all.filter((u) =>
        [u.name, u.email, u.matricula].some((v) => v.toLowerCase().includes(term)),
      )
    : all

  const total = filtered.length
  const safeLimit = Math.max(1, limit)
  const safePage = Math.max(1, page)
  const start = (safePage - 1) * safeLimit
  const end = start + safeLimit
  const items = filtered.slice(start, end)

  return Promise.resolve({
    items,
    total,
    page: safePage,
    limit: safeLimit,
  })
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const users = loadUsers()

  const normalizedName = payload.name.trim().toLowerCase()
  const normalizedEmail = payload.email.trim().toLowerCase()
  const normalizedMatricula = payload.matricula.trim()

  if (users.some((u) => u.name.trim().toLowerCase() === normalizedName)) {
    throw new Error('DUPLICATE_NAME')
  }
  if (users.some((u) => u.email.trim().toLowerCase() === normalizedEmail)) {
    throw new Error('DUPLICATE_EMAIL')
  }
  if (users.some((u) => u.matricula.trim() === normalizedMatricula)) {
    throw new Error('DUPLICATE_MATRICULA')
  }
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : String(Date.now())

  const user: User = {
    id,
    name: payload.name.trim(),
    email: payload.email.trim(),
    matricula: payload.matricula.trim(),
  }

  const next = [user, ...users]
  saveUsers(next)
  return Promise.resolve(user)
}

export async function getUserById(id: string): Promise<User> {
  const users = loadUsers()
  const user = users.find((u) => u.id === id)
  if (!user) {
    throw new Error('User not found')
  }
  return Promise.resolve(user)
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const users = loadUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) {
    throw new Error('User not found')
  }

  const current = users[index]

  const updated: User = {
    ...current,
    ...('name' in payload && payload.name !== undefined ? { name: payload.name.trim() } : {}),
    ...('email' in payload && payload.email !== undefined ? { email: payload.email.trim() } : {}),
    ...('matricula' in payload && payload.matricula !== undefined ? { matricula: payload.matricula.trim() } : {}),
  }

  const normalizedUpdatedName = updated.name.trim().toLowerCase()
  const normalizedUpdatedEmail = updated.email.trim().toLowerCase()
  const normalizedUpdatedMatricula = updated.matricula.trim()

  if (
    payload.name !== undefined &&
    payload.name.trim() !== current.name.trim() &&
    users.some((u) => u.id !== id && u.name.trim().toLowerCase() === normalizedUpdatedName)
  ) {
    throw new Error('DUPLICATE_NAME')
  }

  if (
    payload.email !== undefined &&
    payload.email.trim() !== current.email.trim() &&
    users.some((u) => u.id !== id && u.email.trim().toLowerCase() === normalizedUpdatedEmail)
  ) {
    throw new Error('DUPLICATE_EMAIL')
  }

  if (
    payload.matricula !== undefined &&
    payload.matricula.trim() !== current.matricula.trim() &&
    users.some((u) => u.id !== id && u.matricula.trim() === normalizedUpdatedMatricula)
  ) {
    throw new Error('DUPLICATE_MATRICULA')
  }

  const next = [...users]
  next[index] = updated
  saveUsers(next)
  return Promise.resolve(updated)
}

export async function deleteUser(id: string): Promise<void> {
  const users = loadUsers()
  const next = users.filter((u) => u.id !== id)
  saveUsers(next)
  return Promise.resolve()
}

