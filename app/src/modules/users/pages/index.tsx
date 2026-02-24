import { useEffect, useState, useRef, useId } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, Plus, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { listUsers, deleteUser } from '../services'
import type { ListUsersResult, CreateUserPayload, UpdateUserPayload } from '../domain/types'
import { useCreateUser, useEditUser } from '../hooks'
import {
  validateCreateUser,
  validateUpdateUser,
  isCreateUserValid,
  isUpdateUserValid,
} from '../domain/validations'
import type {
  UserFormValues,
  UserFormErrors,
  UserFormLayoutProps,
  UserRowProps,
  ActionIconButtonProps,
  PaginationButtonProps,
} from './types'

const LIMIT_OPTIONS = [15, 50, 80, 100]

export function UsersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [data, setData] = useState<ListUsersResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [limitDropdownOpen, setLimitDropdownOpen] = useState(false)
  const limitDropdownRef = useRef<HTMLDivElement>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!limitDropdownOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (limitDropdownRef.current && !limitDropdownRef.current.contains(e.target as Node)) {
        setLimitDropdownOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [limitDropdownOpen])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listUsers({ search: search || undefined, page, limit })
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch(() => {
        if (!cancelled) {
          setData({
            items: [
              { id: '1', name: 'Raimundo Neto Abreu Teixeira', email: 'raimundo@example.com', matricula: '001' },
            ],
            total: 13,
            page: 1,
            limit: 15,
          })
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [page, limit, search])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(id)
  }, [toast])

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId)
      let newPage = page
      let res = await listUsers({ search: search || undefined, page, limit })
      if (res.items.length === 0 && res.total > 0 && page > 1) {
        newPage = 1
        res = await listUsers({ search: search || undefined, page: 1, limit })
      }
      setData(res)
      if (newPage !== page) setPage(newPage)
      setToast('Usuário excluído com sucesso.')
    } catch {
      setToast('Erro ao excluir usuário.')
    }
  }

  const totalPages =
    data && data.limit > 0
      ? Math.max(1, Math.ceil(data.total / data.limit))
      : 1
  const canPrev = page > 1
  const canNext = totalPages > 1 && page < totalPages

  return (
    <div className="h-full bg-[#F3F3F3] flex flex-col min-h-0 pl-[44px] pr-[46px] pt-[10px] pb-[76px]">
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-[1494px] mx-auto">
        <div className="flex-1 min-h-0 overflow-auto">
        <h1
          className="font-['Manrope'] font-bold text-left mb-6 opacity-100"
          style={{
            fontSize: '38px',
            lineHeight: '52px',
            letterSpacing: '0px',
            color: '#0B2B25',
          }}
        >
          Usuários
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 w-full">
          <div
            className="relative w-[285px] h-[56px] transition-opacity duration-300 ease-out shrink-0"
            style={{ opacity: 1 }}
          >
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b] pointer-events-none"
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="Pesquisa"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
              className="w-full h-full pl-11 pr-4 font-['Manrope'] text-[#0D1931] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#00aac1]/40 focus:border-[#00aac1] transition-all duration-300 ease-out hover:shadow-[0px_3px_5px_#00000029]"
              style={{
                background: '#FFFFFF 0% 0% no-repeat padding-box',
                boxShadow: '0px 3px 5px #00000029',
                border: '1px solid #86868645',
                borderRadius: '7px',
                opacity: 1,
              }}
            />
          </div>
        <button
          type="button"
          onClick={() => navigate('/usuarios/novo')}
          className="w-[223px] h-[56px] rounded-[8px] font-['Manrope'] font-semibold text-white flex items-center justify-center gap-2 shrink-0 transition-colors duration-200 ease-out bg-[#0290A4] hover:bg-[#017E92] active:bg-[#016979] cursor-pointer"
        >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            Cadastrar Usuário
          </button>
        </div>

        <div className="max-w-[1503px] w-full">
          {!loading && data && data.total === 0 ? (
            <div
              className="w-full rounded-[6px] bg-white flex items-center justify-center"
              style={{
                minHeight: '640px',
                boxShadow: '0px 1px 4px #00000029',
                border: '1px solid #e2e8f0',
              }}
            >
              <div className="text-center font-['Manrope'] text-[#0B2B25]">
                <p className="text-[18px] leading-[24px] font-semibold mb-1">
                  Nenhum Usuário Registrado
                </p>
                <p className="text-[14px] leading-[19px]">
                  Clique em &quot;Cadastrar Usuário&quot; para começar a cadastrar.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div
                className="flex items-center h-12 px-4 rounded-t-[6px]"
                style={{
                  width: '100%',
                  height: '48px',
                  background: '#0D1931 0% 0% no-repeat padding-box',
                  opacity: 1,
                }}
              >
                <span className="flex-1 text-left font-['Manrope'] font-semibold text-white">
                  Nome
                </span>
                <span className="text-left font-['Manrope'] font-semibold text-white w-[120px] shrink-0">
                  Ações
                </span>
              </div>

              <div className="h-[13px] w-full" aria-hidden />

              <div
                className="rounded-b-md overflow-hidden border border-t-0 border-[#e2e8f0] bg-white"
                style={{ boxShadow: '0px 1px 4px #00000029' }}
              >
                <table className="w-full border-collapse">
                  <tbody className="[&>tr:first-child]:border-t-0">
                    {loading ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center font-['Manrope'] text-[#64748b]">
                          Carregando...
                        </td>
                      </tr>
                    ) : data?.items.length ? (
                      data.items.map((user) => (
                        <UserRow
                          key={user.id}
                          user={user}
                          onView={(u) => navigate(`/usuarios/${u.id}`)}
                          onEdit={(u) => navigate(`/usuarios/${u.id}/editar`)}
                          onDelete={(u) => handleDelete(u.id)}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center font-['Manrope'] text-[#64748b]">
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        </div>

        {data && (
          <footer
            className="mt-auto shrink-0 w-full max-w-[1503px] flex flex-wrap items-center justify-between gap-4 px-0 py-4 font-['Manrope'] text-left text-[14px] leading-[19px] tracking-[0px] text-[#0B2B25]"
          >
              <span className="font-medium">
                Total de itens: <span className="font-bold">{data.total}</span>
              </span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 font-medium">
                  Itens por página
                  <div className="relative ml-1" ref={limitDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setLimitDropdownOpen((o) => !o)}
                      className="h-8 min-w-[72px] px-3 flex items-center justify-between gap-2 rounded border bg-white font-['Manrope'] text-[14px] leading-[19px] text-[#0B2B25] border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#0290A4] focus:border-[#0290A4]"
                      style={{ boxShadow: limitDropdownOpen ? '0 0 0 2px rgba(2,144,164,0.4)' : undefined }}
                    >
                      <span className="font-bold">{limit}</span>
                      <ChevronDown className="w-4 h-4 text-[#0B2B25] shrink-0" />
                    </button>
                    {limitDropdownOpen && (
                      <div
                        className="absolute bottom-full left-0 right-0 mb-0.5 rounded border border-[#0290A4] bg-white overflow-hidden z-10"
                        style={{ boxShadow: '0 0 0 2px rgba(2,144,164,0.4)' }}
                      >
                        {[100, 80, 50, 15].filter((n) => LIMIT_OPTIONS.includes(n)).map((n) => (
                          <button
                            key={n}
                            type="button"
                            className="w-full py-2 px-3 text-left font-['Manrope'] text-[14px] leading-[19px] text-[#0B2B25] hover:bg-[#f1f5f9]"
                            onClick={() => { setLimit(n); setPage(1); setLimitDropdownOpen(false) }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </span>
                <div className="flex items-center gap-1">
                  <PaginationButton
                    onClick={() => setPage(1)}
                    disabled={!canPrev}
                    aria-label="Primeira página"
                  >
                    <IconPageFirst />
                  </PaginationButton>
                  <PaginationButton
                    onClick={() => setPage((p) => p - 1)}
                    disabled={!canPrev}
                    aria-label="Página anterior"
                  >
                    <IconPagePrev />
                  </PaginationButton>
                  <span className="min-w-[32px] h-8 flex items-center justify-center rounded font-semibold text-white" style={{ background: '#0290A4' }}>
                    {page}
                  </span>
                  <PaginationButton
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!canNext}
                    aria-label="Próxima página"
                  >
                    <IconPageNext />
                  </PaginationButton>
                  <PaginationButton
                    onClick={() => setPage(totalPages)}
                    disabled={!canNext}
                    aria-label="Última página"
                  >
                    <IconPageLast />
                  </PaginationButton>
                </div>
                <span className="ml-2 font-medium">de <span className="font-bold">{totalPages}</span></span>
              </div>
            </footer>
          )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="min-w-[240px] max-w-[320px] px-4 py-3 rounded-[6px] bg-white shadow-[0px_2px_8px_#00000040] border-l-4 border-l-[#0290A4] font-['Manrope'] text-sm text-[#0B2B25]">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

function UserFormLayout({
  mode,
  title,
  breadcrumbLabel,
  primaryButtonLabel,
  submitting,
  canSubmit,
  values,
  errors,
  onChange,
  onSubmit,
  onCancel,
}: UserFormLayoutProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [focusedField, setFocusedField] = useState<keyof UserFormValues | null>(null)

  const showLabel = (field: keyof UserFormValues) =>
    focusedField === field || (values[field] !== undefined && String(values[field]).trim() !== '')

  const inputBase =
    'w-full h-[44px] px-3 pt-4 pb-1 font-[\'Manrope\'] text-sm text-[#0B2B25] placeholder:text-[#9ca3af] rounded-t-[4px] rounded-b-[4px] border border-[#e5e7eb] bg-[#F5F5F5] hover:bg-[#EAEAEA] cursor-pointer focus:cursor-text transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-[#e5e7eb] focus:border-b-2 focus:border-b-[#0290A4]'
  const labelTeal = 'text-[12px] leading-[17px] font-[\'Manrope\'] font-semibold text-[#0290A4]'

  return (
    <div className="h-full bg-[#F3F3F3] flex flex-col min-h-0 pl-[44px] pr-[46px] pt-[10px] pb-[76px]">
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-[1494px] mx-auto">
        <div className="flex-1 min-h-0 overflow-auto">
          <p className="font-['Manrope'] text-sm text-[#64748b] mb-1">
            Usuários {'>'}{' '}
            <span className="text-[#0B2B25]">{breadcrumbLabel}</span>
          </p>
          <h1
            className="font-['Manrope'] font-bold text-left mb-4 opacity-100"
            style={{
              fontSize: '38px',
              lineHeight: '52px',
              letterSpacing: '0px',
              color: '#0B2B25',
            }}
          >
            {title}
          </h1>

          <form
            onSubmit={onSubmit}
            className="w-full max-w-[1503px] bg-white rounded-[6px] shadow-[0px_1px_4px_#00000029] border border-[#e2e8f0] px-6 py-6 flex flex-col gap-6"
          >
            <section>
              <div className="flex items-center mb-4">
                <h2 className="font-['Manrope'] text-[14px] leading-[19px] font-bold text-[#0B2B25]">
                  Dados do Usuário
                </h2>
                <div className="ml-4 flex-1 h-px bg-[#CBD5E1]" />
              </div>
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <input
                        id="user-name"
                        type="text"
                        value={values.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Insira o nome completo*"
                        className={inputBase}
                      />
                      {showLabel('name') && (
                        <label
                          className={`${labelTeal} absolute left-3 top-1 pointer-events-none`}
                          htmlFor="user-name"
                        >
                          Nome Completo
                        </label>
                      )}
                    </div>
                    <div className="mt-[2px] text-[12px] leading-[16px] font-['Manrope'] text-[#64748b] text-right">
                      Máx. 30 caracteres
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500 font-['Manrope'] text-right">{errors.name}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <input
                        id="user-email"
                        type="email"
                        value={values.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Insira o E-mail*"
                        className={inputBase}
                      />
                      {showLabel('email') && (
                        <label
                          className={`${labelTeal} absolute left-3 top-1 pointer-events-none`}
                          htmlFor="user-email"
                        >
                          E-mail
                        </label>
                      )}
                    </div>
                    <div className="mt-[2px] text-[12px] leading-[16px] font-['Manrope'] text-[#64748b] text-right">
                      Máx. 40 caracteres
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 font-['Manrope'] text-right">{errors.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <input
                        id="user-matricula"
                        type="text"
                        value={values.matricula}
                        onChange={(e) => onChange('matricula', e.target.value)}
                        onFocus={() => setFocusedField('matricula')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Insira o N° da matrícula"
                        className={inputBase}
                      />
                      {showLabel('matricula') && (
                        <label
                          className={`${labelTeal} absolute left-3 top-1 pointer-events-none`}
                          htmlFor="user-matricula"
                        >
                          N° da matrícula
                        </label>
                      )}
                    </div>
                    <div className="mt-[2px] text-[12px] leading-[16px] font-['Manrope'] text-[#64748b] text-right">
                      Min. 4 dígitos · Máx. 10
                    </div>
                    {errors.matricula && (
                      <p className="mt-1 text-xs text-red-500 font-['Manrope'] text-right">{errors.matricula}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <h2 className="font-['Manrope'] text-[14px] leading-[19px] font-bold text-[#0B2B25]">
                  Dados de acesso
                </h2>
                <div className="ml-4 flex-1 h-px bg-[#CBD5E1]" />
              </div>
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                <div className="flex-1 flex flex-col gap-1">
                  <div className="relative">
                    <input
                      id="user-password"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      onChange={(e) => onChange('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder={mode === 'create' ? 'Senha' : 'Nova senha (opcional)'}
                      className={inputBase + ' pr-10'}
                    />
                    {showLabel('password') && (
                      <label
                        className={`${labelTeal} absolute left-3 top-1 pointer-events-none`}
                        htmlFor="user-password"
                      >
                        Senha
                      </label>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center justify-center text-[#64748b]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500 font-['Manrope']">{errors.password}</p>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="relative">
                    <input
                      id="user-confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      value={values.confirmPassword}
                      onChange={(e) => onChange('confirmPassword', e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Repetir Senha"
                      className={inputBase + ' pr-10'}
                    />
                    {showLabel('confirmPassword') && (
                      <label
                        className={`${labelTeal} absolute left-3 top-1 pointer-events-none`}
                        htmlFor="user-confirmPassword"
                      >
                        Repetir Senha
                      </label>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center justify-center text-[#64748b]"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500 font-['Manrope']">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </section>

            <div className="mt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="h-[44px] px-8 rounded-[8px] border border-[#0D1931] bg-white font-['Manrope'] font-semibold text-[#0D1931] transition-all duration-200 hover:bg-[#f1f5f9] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="h-[44px] px-8 rounded-[8px] font-['Manrope'] font-semibold text-white transition-colors duration-200 bg-[#0290A4] hover:bg-[#017E92] active:bg-[#016979] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed cursor-pointer"
              >
                {primaryButtonLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export function UserCreatePage() {
  const navigate = useNavigate()
  const { create, loading } = useCreateUser()
  const [values, setValues] = useState<UserFormValues>({
    name: '',
    email: '',
    matricula: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<UserFormErrors>({})

  const validateValues = (vals: UserFormValues): UserFormErrors => {
    const payload: CreateUserPayload = {
      name: vals.name.trim(),
      email: vals.email.trim(),
      matricula: vals.matricula.trim(),
      password: vals.password,
    }
    const result = validateCreateUser(payload)
    const nextErrors: UserFormErrors = {}
    if (!result.success) {
      Object.assign(nextErrors, result.errors)
    }
    if (vals.password !== vals.confirmPassword) {
      nextErrors.confirmPassword = 'As senhas não coincidem'
    }
    return nextErrors
  }

  const handleChange = (field: keyof UserFormValues, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value }
      setErrors(validateValues(next))
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: CreateUserPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      matricula: values.matricula.trim(),
      password: values.password,
    }
    let nextErrors = validateValues(values)
    if (Object.keys(nextErrors).length === 0) {
      try {
        const existing = await listUsers({ search: '', page: 1, limit: 10_000 })
        const normalizedName = values.name.trim().toLowerCase()
        const normalizedEmail = values.email.trim().toLowerCase()
        const normalizedMatricula = values.matricula.trim()

        if (existing.items.some((u) => u.name.trim().toLowerCase() === normalizedName)) {
          nextErrors.name = 'Colaborador já cadastrado.'
        }
        if (existing.items.some((u) => u.email.trim().toLowerCase() === normalizedEmail)) {
          nextErrors.email = 'E-mail já cadastrado.'
        }
        if (existing.items.some((u) => u.matricula.trim() === normalizedMatricula)) {
          nextErrors.matricula = 'Esta matrícula já foi registrada no sistema.'
        }
      } catch {
      }
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      await create(payload)
      navigate('/usuarios')
    } catch {
    }
  }

  const canSubmit = isCreateUserValid({
    name: values.name.trim(),
    email: values.email.trim(),
    matricula: values.matricula.trim(),
    password: values.password,
  }) && values.password === values.confirmPassword

  return (
    <UserFormLayout
      mode="create"
      title="Cadastro de Usuário"
      breadcrumbLabel="Cadastro de Usuário"
      primaryButtonLabel="Cadastrar"
      submitting={loading}
      canSubmit={canSubmit}
      values={values}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/usuarios')}
    />
  )
}

export function UserEditPage() {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()
  const id = params.id ?? null
  const { user, loadLoading, update, updateLoading } = useEditUser(id)
  const [values, setValues] = useState<UserFormValues>({
    name: '',
    email: '',
    matricula: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<UserFormErrors>({})

  useEffect(() => {
    if (user) {
      setValues((prev) => ({
        ...prev,
        name: user.name ?? '',
        email: user.email ?? '',
        matricula: user.matricula ?? '',
      }))
    }
  }, [user])

  const handleChange = (field: keyof UserFormValues, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value }

      if (!user) {
        setErrors({})
        return next
      }

      const payload: UpdateUserPayload = {}
      if (next.name && next.name !== user.name) payload.name = next.name.trim()
      if (next.email && next.email !== user.email) payload.email = next.email.trim()
      if (next.matricula && next.matricula !== user.matricula) payload.matricula = next.matricula.trim()
      if (next.password) {
        if (next.password !== next.confirmPassword) {
          setErrors({ confirmPassword: 'As senhas não coincidem' })
          return next
        }
        payload.password = next.password
      }

      if (Object.keys(payload).length === 0) {
        setErrors({})
        return next
      }

      const result = validateUpdateUser(payload)
      const nextErrors: UserFormErrors = {}
      if (!result.success) {
        Object.assign(nextErrors, result.errors)
      }
      setErrors(nextErrors)

      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !id) return

    const payload: UpdateUserPayload = {}
    if (values.name && values.name !== user.name) payload.name = values.name.trim()
    if (values.email && values.email !== user.email) payload.email = values.email.trim()
    if (values.matricula && values.matricula !== user.matricula) payload.matricula = values.matricula.trim()
    if (values.password) {
      if (values.password !== values.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'As senhas não coincidem' }))
        return
      }
      payload.password = values.password
    }

    if (Object.keys(payload).length === 0) {
      navigate('/usuarios')
      return
    }

    const result = validateUpdateUser(payload)
    const nextErrors: UserFormErrors = {}
    if (!result.success) {
      Object.assign(nextErrors, result.errors)
    }

    if (Object.keys(nextErrors).length === 0) {
      try {
        const existing = await listUsers({ search: '', page: 1, limit: 10_000 })
        const normalizedName = (payload.name ?? '').trim().toLowerCase()
        const normalizedEmail = (payload.email ?? '').trim().toLowerCase()
        const normalizedMatricula = (payload.matricula ?? '').trim()

        if (
          payload.name &&
          payload.name.trim() !== user.name.trim() &&
          existing.items.some((u) => u.id !== user.id && u.name.trim().toLowerCase() === normalizedName)
        ) {
          nextErrors.name = 'Colaborador já cadastrado.'
        }
        if (
          payload.email &&
          payload.email.trim() !== user.email.trim() &&
          existing.items.some((u) => u.id !== user.id && u.email.trim().toLowerCase() === normalizedEmail)
        ) {
          nextErrors.email = 'E-mail já cadastrado.'
        }
        if (
          payload.matricula &&
          payload.matricula.trim() !== user.matricula.trim() &&
          existing.items.some((u) => u.id !== user.id && u.matricula.trim() === normalizedMatricula)
        ) {
          nextErrors.matricula = 'Esta matrícula já foi registrada no sistema.'
        }
      } catch {
      }
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      await update(payload)
      navigate('/usuarios')
    } catch {
    }
  }

  const derivedPayload: UpdateUserPayload = {}
  if (user) {
    if (values.name && values.name !== user.name) derivedPayload.name = values.name.trim()
    if (values.email && values.email !== user.email) derivedPayload.email = values.email.trim()
    if (values.matricula && values.matricula !== user.matricula) derivedPayload.matricula = values.matricula.trim()
    if (values.password) derivedPayload.password = values.password
  }

  const hasChanges = Object.keys(derivedPayload).length > 0
  const passwordsOk = !values.password || values.password === values.confirmPassword
  const canSubmit = hasChanges && passwordsOk && isUpdateUserValid(derivedPayload)

  if (loadLoading && !user) {
    return (
      <div className="h-full bg-[#F3F3F3] flex flex-col min-h-0 pl-[44px] pr-[46px] pt-[10px] pb-[76px]">
        <div className="flex-1 flex flex-col min-h-0 w-full max-w-[1494px] mx-auto">
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <p className="font-['Manrope'] text-[#64748b]">Carregando usuário...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <UserFormLayout
      mode="edit"
      title="Edição de Usuário"
      breadcrumbLabel="Edição de Usuário"
      primaryButtonLabel="Salvar"
      submitting={updateLoading}
      canSubmit={canSubmit}
      values={values}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/usuarios')}
    />
  )
}

export function UserViewPage() {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()
  const id = params.id ?? null
  const { user, loadLoading } = useEditUser(id)

  if (loadLoading && !user) {
    return (
      <div className="h-full bg-[#F3F3F3] flex flex-col min-h-0 pl-[44px] pr-[46px] pt-[10px] pb-[76px]">
        <div className="flex-1 flex flex-col min-h-0 w-full max-w-[1494px] mx-auto">
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <p className="font-['Manrope'] text-[#64748b]">Carregando usuário...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-full bg-[#F3F3F3] flex flex-col min-h-0 pl-[44px] pr-[46px] pt-[10px] pb-[76px]">
        <div className="flex-1 flex flex-col min-h-0 w-full max-w-[1494px] mx-auto">
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <p className="font-['Manrope'] text-[#64748b]">Usuário não encontrado.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-[#F3F3F3] flex flex-col min-h-0 pl-[44px] pr-[46px] pt-[10px] pb-[76px]">
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-[1494px] mx-auto">
        <div className="flex-1 min-h-0 overflow-auto">
          <p className="font-['Manrope'] text-sm text-[#64748b] mb-1">
            Usuários {'>'}{' '}
            <span className="text-[#0B2B25]">Visualização de Usuário</span>
          </p>
          <h1
            className="font-['Manrope'] font-bold text-left mb-4 opacity-100"
            style={{
              fontSize: '38px',
              lineHeight: '52px',
              letterSpacing: '0px',
              color: '#0B2B25',
            }}
          >
            Visualização de Usuário
          </h1>

          <div className="w-full max-w-[1503px] bg-white rounded-[6px] shadow-[0px_1px_4px_#00000029] border border-[#e2e8f0] px-6 py-6 flex flex-col gap-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-['Manrope'] text-[14px] leading-[19px] font-bold text-[#0B2B25]">
                  Dados do Usuário
                </h2>
              </div>
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[12px] leading-[16px] font-['Manrope'] text-[#64748b]">
                      <span>Nome completo</span>
                    </div>
                    <div className="w-full h-[44px] px-3 flex items-center rounded-[4px] border border-[#e5e7eb] bg-[#F5F5F5] font-['Manrope'] text-sm text-[#0B2B25]">
                      {user.name}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[12px] leading-[16px] font-['Manrope'] text-[#64748b]">
                      <span>E-mail</span>
                    </div>
                    <div className="w-full h-[44px] px-3 flex items-center rounded-[4px] border border-[#e5e7eb] bg-[#F5F5F5] font-['Manrope'] text-sm text-[#0B2B25]">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[12px] leading-[16px] font-['Manrope'] text-[#64748b]">
                      <span>N° da matrícula</span>
                    </div>
                    <div className="w-full h-[44px] px-3 flex items-center rounded-[4px] border border-[#e5e7eb] bg-[#F5F5F5] font-['Manrope'] text-sm text-[#0B2B25]">
                      {user.matricula}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/usuarios')}
              className="h-[44px] px-8 rounded-[8px] border border-[#0D1931] bg-white font-['Manrope'] font-semibold text-[#0D1931] transition-all duration-200 hover:bg-[#f1f5f9] cursor-pointer"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function IconView({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
      <defs>
        <clipPath id={`clip-view-${id}`}>
          <rect width="24" height="24" fill="none" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-view-${id})`}>
        <path d="M12.013,20.209a10.993,10.993,0,0,1-7.494-3.5A12.662,12.662,0,0,1,1.7,12.518a1.447,1.447,0,0,1-.051-1.011c1.532-3.441,3.9-6.1,7.565-7.252,3.615-1.138,6.825-.115,9.613,2.349a13.637,13.637,0,0,1,3.445,4.714,1.462,1.462,0,0,1,.09,1.054A12.677,12.677,0,0,1,14.9,19.607a22.5,22.5,0,0,1-2.889.6m.354-1.761a15.6,15.6,0,0,0,2.309-.548,11.033,11.033,0,0,0,5.93-5.695.821.821,0,0,0-.065-.626,11.858,11.858,0,0,0-2.879-3.763c-2.5-2.166-5.324-2.975-8.494-1.766a10.982,10.982,0,0,0-5.794,5.629.791.791,0,0,0,.065.675,28.7,28.7,0,0,0,2.291,3.16,8.878,8.878,0,0,0,6.637,2.934" fill="#0b2b25" />
        <path d="M7.379,11.981a4.563,4.563,0,0,1,4.612-4.654,4.64,4.64,0,1,1-4.612,4.654m1.678-.048a2.935,2.935,0,1,0,5.831-.43,2.728,2.728,0,0,0-2.925-2.421,2.491,2.491,0,0,1-2.906,2.851" fill="#0b2b25" />
      </g>
    </svg>
  )
}

function IconEdit({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
      <defs>
        <clipPath id={`clip-edit-${id}`}>
          <rect width="24" height="24" fill="none" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-edit-${id})`}>
        <path d="M18.6,1a2.928,2.928,0,0,1,2.107.88c.479.446.916.94,1.4,1.38A2.935,2.935,0,0,1,22.131,7.6c-2.412,2.355-4.78,4.753-7.164,7.134C13,16.7,11.042,18.671,9.064,20.622a4.767,4.767,0,0,1-2.093,1.1c-1.566.454-3.132.912-4.7,1.362A1.01,1.01,0,0,1,.958,21.868c.506-1.8,1.019-3.608,1.608-5.387A3.94,3.94,0,0,1,3.5,15q6.522-6.6,13.1-13.147A2.691,2.691,0,0,1,18.6,1M3.5,20.487c.033.027.066.054.1.081.959-.282,1.912-.587,2.878-.839a3.234,3.234,0,0,0,1.535-.9Q12.591,14.2,17.2,9.587c.115-.115.224-.236.329-.346a.718.718,0,0,0-.077-.138c-.805-.814-1.613-1.624-2.415-2.439-.2-.2-.309-.04-.436.087Q9.788,11.567,4.988,16.4a3.037,3.037,0,0,0-.594,1.052c-.183.477-.282.985-.425,1.477-.152.523-.314,1.042-.472,1.563" fill="#0b2b25" />
      </g>
    </svg>
  )
}

function IconDelete({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
      <defs>
        <clipPath id={`clip-delete-${id}`}>
          <rect width="24" height="24" fill="none" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-delete-${id})`}>
        <path d="M3.936,6.53c-.191-.018-.358-.024-.523-.05a1.021,1.021,0,0,1-.987-.985A.981.981,0,0,1,3.449,4.5,13.769,13.769,0,0,1,5.49,4.492a1.355,1.355,0,0,0,1.5-.8A18.086,18.086,0,0,1,8.026,2.142,2.326,2.326,0,0,1,10.04,1.066q1.958-.027,3.915,0a2.386,2.386,0,0,1,2.066,1.094c.418.63.843,1.255,1.241,1.9a.8.8,0,0,0,.782.429,24.9,24.9,0,0,1,2.607.039.922.922,0,0,1,.729,1.487,1.9,1.9,0,0,1-.8.464,1.825,1.825,0,0,1-.546.046c-.1,1.318-.206,2.612-.3,3.907-.247,3.316-.477,6.632-.742,9.946a2.634,2.634,0,0,1-2.82,2.571H7.832A2.657,2.657,0,0,1,5,20.274Q4.516,13.66,4.018,7.048c-.012-.166-.052-.331-.082-.518M6,6.518c0,.236-.01.4,0,.571.131,1.94.26,3.881.4,5.821q.259,3.617.531,7.233c.037.507.27.812.814.812q4.255,0,8.511,0a.735.735,0,0,0,.807-.76c.053-.564.087-1.129.128-1.694q.319-4.41.638-8.818c.075-1.046.135-2.094.2-3.165ZM9.015,4.431h6.028c-.374-1.1-.732-1.364-1.783-1.364H10.707c-.971,0-1.376.319-1.692,1.364" fill="#0d1931" />
      </g>
    </svg>
  )
}

function IconPageFirst({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="44"
      viewBox="0 0 32 44"
      className={className}
    >
      <g transform="translate(9.367 15)">
        <path
          d="M15.579,7.386,14.193,6,8.3,11.9l5.9,5.9,1.386-1.386-4.5-4.512Z"
          transform="translate(-4.698 -4.711)"
          fill="#616c84"
        />
        <line
          y1="14"
          fill="none"
          stroke="#616c84"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  )
}

function IconPageLast({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="44"
      viewBox="0 0 32 44"
      className={className}
    >
      <g transform="translate(32 44) rotate(180)">
        <rect width="32" height="44" rx="5" fill="none" />
        <g transform="translate(9.367 15)">
          <path
            d="M15.579,7.386,14.193,6,8.3,11.9l5.9,5.9,1.386-1.386-4.5-4.512Z"
            transform="translate(-4.698 -4.711)"
            fill="#616c84"
          />
          <line
            y1="14"
            fill="none"
            stroke="#616c84"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </g>
      </g>
    </svg>
  )
}

function IconPagePrev({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7.284"
      height="11.795"
      viewBox="0 0 7.284 11.795"
      className={className}
    >
      <path
        d="M15.579,7.386,14.193,6,8.3,11.9l5.9,5.9,1.386-1.386-4.5-4.512Z"
        transform="translate(-8.295 -6)"
        fill="#616c84"
      />
    </svg>
  )
}

function IconPageNext({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7.284"
      height="11.795"
      viewBox="0 0 7.284 11.795"
      className={className}
    >
      <g transform="translate(7.284 0) scale(-1 1)">
        <path
          d="M15.579,7.386,14.193,6,8.3,11.9l5.9,5.9,1.386-1.386-4.5-4.512Z"
          transform="translate(-8.295 -6)"
          fill="#616c84"
        />
      </g>
    </svg>
  )
}

function UserRow({ user, onView, onEdit, onDelete }: UserRowProps) {
  return (
    <tr className="group border-t border-[#e2e8f0] hover:bg-[#f8fafc] opacity-100" style={{ opacity: 1 }}>
      <td className="px-4 font-['Manrope'] text-[#0D1931] align-middle h-[36px] group-hover:h-[56px] transition-[height] duration-200 ease-out">
        {user.name}
      </td>
      <td className="w-[120px] min-w-[120px] px-8 align-middle h-[36px] group-hover:h-[56px] transition-[height] duration-200 ease-out text-left">
        <div className="flex items-center justify-start gap-2">
          <ActionIconButton aria-label="Visualizar" onClick={() => onView(user)}>
            <IconView className="w-5 h-5" />
          </ActionIconButton>
          <ActionIconButton aria-label="Editar" onClick={() => onEdit(user)}>
            <IconEdit className="w-5 h-5" />
          </ActionIconButton>
          <ActionIconButton aria-label="Excluir" onClick={() => onDelete(user)}>
            <IconDelete className="w-5 h-5" />
          </ActionIconButton>
        </div>
      </td>
    </tr>
  )
}

function ActionIconButton({
  children,
  onClick,
  'aria-label': ariaLabel,
}: ActionIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="w-9 h-9 flex items-center justify-center rounded-[4px] hover:bg-[#0290A4] transition-colors cursor-pointer"
    >
      {children}
    </button>
  )
}

function PaginationButton({
  children,
  onClick,
  disabled,
  'aria-label': ariaLabel,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="w-[32px] h-[44px] flex items-center justify-center rounded-[5px] bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f1f5f9] disabled:hover:bg-transparent transition-colors"
    >
      {children}
    </button>
  )
}
