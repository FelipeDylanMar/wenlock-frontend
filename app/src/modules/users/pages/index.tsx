import { useEffect, useState, useRef, useId } from 'react'
import { Search, Plus, ChevronDown } from 'lucide-react'
import { listUsers } from '../services'
import type { User, ListUsersResult } from '../domain/types'

const LIMIT_OPTIONS = [15, 50, 80, 100]

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [data, setData] = useState<ListUsersResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [limitDropdownOpen, setLimitDropdownOpen] = useState(false)
  const limitDropdownRef = useRef<HTMLDivElement>(null)

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
    return () => { cancelled = true }
  }, [page, limit, search])

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1
  const canPrev = page > 1
  const canNext = page < totalPages

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
            className="w-[223px] h-[56px] rounded-[8px] font-['Manrope'] font-semibold text-white flex items-center justify-center gap-2 shrink-0 transition-all duration-300 ease-out hover:opacity-90 opacity-100 disabled:opacity-100 disabled:cursor-not-allowed"
            style={{
              background: '#0290A4 0% 0% no-repeat padding-box',
              opacity: 1,
            }}
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
                        <UserRow key={user.id} user={user} />
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

function UserRow({ user }: { user: User }) {
  return (
    <tr className="group border-t border-[#e2e8f0] hover:bg-[#f8fafc] opacity-100" style={{ opacity: 1 }}>
      <td className="px-4 font-['Manrope'] text-[#0D1931] align-middle h-[36px] group-hover:h-[56px] transition-[height] duration-200 ease-out">
        {user.name}
      </td>
      <td className="w-[120px] min-w-[120px] px-8 align-middle h-[36px] group-hover:h-[56px] transition-[height] duration-200 ease-out text-left">
        <div className="flex items-center justify-start gap-2">
          <ActionIconButton aria-label="Visualizar" onClick={() => {}}>
            <IconView className="w-5 h-5" />
          </ActionIconButton>
          <ActionIconButton aria-label="Editar" onClick={() => {}}>
            <IconEdit className="w-5 h-5" />
          </ActionIconButton>
          <ActionIconButton aria-label="Excluir" onClick={() => {}}>
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
}: {
  children: React.ReactNode
  onClick: () => void
  'aria-label': string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-1.5 rounded hover:bg-[#e2e8f0] transition-colors"
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
}: {
  children: React.ReactNode
  onClick: () => void
  disabled: boolean
  'aria-label': string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="w-[32px] h-[44px] flex items-center justify-center rounded-[5px] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f1f5f9] transition-colors"
    >
      {children}
    </button>
  )
}
