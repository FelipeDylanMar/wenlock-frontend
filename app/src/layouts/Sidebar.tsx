import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Users } from 'lucide-react'
import logo from '@/assets/Group 48687.svg'
import collapsedLogo from '@/assets/Group 48700.svg'
import homeIcon from '@/assets/Group 48166.svg'
import accessIcon from '@/assets/Group 47406.svg'
import accessDropdownIcon from '@/assets/Group 47405.svg'
import sidebarToggleIcon from '@/assets/Group 47408.svg'

type SidebarProps = {
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function Sidebar({ collapsed, onToggleCollapsed }: SidebarProps) {
  const location = useLocation()
  const [accessOpen, setAccessOpen] = useState(true)

  const isActive = (path: string) => location.pathname === path
  const itemBase =
    'h-[54px] rounded-[6px] px-3 text-sm font-medium transition-colors flex items-center gap-3'

  return (
    <aside
      className={`absolute top-0 left-0 flex flex-col bg-sidebar-bg text-sidebar-fg h-screen opacity-100 shadow-[7px_0px_6px_#0000002C] transition-all duration-300 ease-out ${
        collapsed ? 'w-[116px]' : 'w-[336px]'
      }`}
    >
      <div className="relative h-[122px] border-b border-sidebar-hover">
        {!collapsed && (
          <img
            src={logo}
            alt="WenLock"
            className="absolute left-[40px] top-[43px] w-[235px] h-[36px] object-contain opacity-100 transition-opacity duration-300 ease-out"
          />
        )}
        {collapsed && (
          <img
            src={collapsedLogo}
            alt="WenLock"
            className="absolute top-[42px] left-1/2 -translate-x-1/2 w-[72px] h-[56px] object-contain opacity-100 transition-opacity duration-300 ease-out"
          />
        )}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="absolute top-[45px] right-[-18.5px] z-20 w-[37px] h-[37px] p-0 rounded-full opacity-100 cursor-pointer transition-all duration-300 ease-out"
          style={{
            background: '#F2F2F2 0% 0% no-repeat padding-box',
            boxShadow: '0px 3px 6px #00000029',
          }}
        >
          <img
            src={sidebarToggleIcon}
            alt="Alternar sidebar"
            className={`w-[18px] h-[18px] object-contain mx-auto my-auto ${collapsed ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-[15px]">
        <Link
          to="/"
          className={`${itemBase} ${
            collapsed ? 'justify-center px-0 gap-0' : ''
          } ${isActive('/') ? 'bg-sidebar-active text-sidebar-active-fg' : 'hover:bg-sidebar-hover'}`
          }
        >
          <span className="w-6 h-6 min-w-[24px] min-h-[24px] shrink-0 flex-none flex items-center justify-center">
            <img
              src={homeIcon}
              alt="Home"
              className="w-6 h-6 object-contain shrink-0 flex-none"
            />
          </span>
          {!collapsed && <span>Home</span>}
        </Link>

        <div>
          <button
            type="button"
            onClick={() => setAccessOpen(!accessOpen)}
            className={`${itemBase} ${
              collapsed ? 'w-full justify-center px-0 gap-0' : 'w-[304px]'
            } bg-transparent opacity-100 hover:bg-sidebar-hover`}
          >
            <span className="w-6 h-6 min-w-[24px] min-h-[24px] shrink-0 flex-none flex items-center justify-center">
              <img
                src={accessIcon}
                alt="Controle de Acesso"
                className="w-6 h-6 object-contain shrink-0 flex-none opacity-100"
              />
            </span>
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Controle de Acesso</span>
                <img
                  src={accessDropdownIcon}
                  alt="Expandir controle de acesso"
                  className={`w-6 h-6 object-contain shrink-0 flex-none transition-transform duration-300 ease-out ${
                    accessOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </>
            )}
          </button>
          {accessOpen && !collapsed && (
            <Link
              to="/usuarios"
              className={`${itemBase} ml-6 ${
                isActive('/usuarios')
                  ? 'bg-sidebar-active text-sidebar-active-fg'
                  : 'hover:bg-sidebar-hover'
              }`}
            >
              <Users size={24} className="w-6 h-6 shrink-0 flex-none" />
              <span>Usuários</span>
            </Link>
          )}
        </div>
      </nav>

      <div
        className={`px-4 py-4 text-xs text-sidebar-fg/60 border-t border-sidebar-hover flex flex-col ${
          collapsed ? 'items-center' : ''
        }`}
      >
        {collapsed ? (
          <div
            className="w-[39px] h-[17px] flex items-center justify-center font-['Poppins'] font-normal text-[12px] leading-none text-[#AACBC4]"
          >
            V 0.0.0
          </div>
        ) : (
          <>
            <p className="font-semibold text-sidebar-fg/80">© WenLock</p>
            <p>Power by Conecthus</p>
            <p className="font-['Poppins'] font-normal text-[12px] text-[#AACBC4]">V 0.0.0</p>
          </>
        )}
      </div>
    </aside>
  )
}
