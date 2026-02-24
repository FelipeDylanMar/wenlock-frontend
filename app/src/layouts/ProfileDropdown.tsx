import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import logoutIcon from '@/assets/Group 47446.svg'

type ProfileDropdownProps = {
  open: boolean
  onClose: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export function ProfileDropdown({ open, onClose, onMouseEnter, onMouseLeave }: ProfileDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (ref.current?.contains(target)) return
      if (target.closest('[data-profile-trigger]')) return
      onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onClose])

  if (!open) return null

  const content = (
    <div
      ref={ref}
      className="fixed right-6 top-[72px] z-[100] flex w-[294px] flex-col overflow-hidden rounded-md"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        height: '131px',
        background: '#FFFFFF 0% 0% no-repeat padding-box',
        boxShadow: '0px 3px 6px #00000029',
        border: '0.2px solid #707070',
        opacity: 1,
      }}
    >
      <div className="flex flex-1 items-center gap-3 px-4 pt-1">
        <div
          className="h-12 w-12 shrink-0 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ background: '#0D1931' }}
        >
          MS
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-['Manrope'] text-sm font-semibold text-[#0D1931] truncate">
            Milena Santana Borges
          </p>
          <p className="font-['Manrope'] text-xs text-[#707070] truncate">
            milena.santana@energy.org.br
          </p>
        </div>
      </div>
      <div
        className="border-t border-[#E5E5E5] mt-2"
        style={{ borderColor: 'rgba(0,0,0,0.08)' }}
      />
      <button
        type="button"
        className="flex w-full items-center gap-2 px-4 py-3 text-left font-['Manrope'] text-sm text-[#0D1931] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
        onClick={onClose}
      >
        <img src={logoutIcon} alt="" className="h-6 w-6 object-contain shrink-0" />
        <span>Sair</span>
      </button>
    </div>
  )

  return createPortal(content, document.body)
}
