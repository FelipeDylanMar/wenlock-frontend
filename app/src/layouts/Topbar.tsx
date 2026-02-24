import profileCaretIcon from '@/assets/Group 47410.svg'

type TopbarProps = {
  isProfileMenuOpen?: boolean
  onProfileClick?: () => void
  onProfileMouseEnter?: () => void
  onProfileMouseLeave?: () => void
}

export function Topbar({
  isProfileMenuOpen = false,
  onProfileClick,
  onProfileMouseEnter,
  onProfileMouseLeave,
}: TopbarProps) {
  return (
    <header
      className="top-0 left-0 w-full h-[64px] min-h-[64px] flex items-center justify-end px-6 shrink-0 opacity-100"
      style={{
        background: 'var(--full-branco-ffffff, #FFFFFF) 0% 0% no-repeat padding-box',
        boxShadow: '0px 3px 5px #15223214',
      }}
    >
      <div
        className="relative"
        onMouseEnter={onProfileMouseEnter}
        onMouseLeave={onProfileMouseLeave}
      >
      <button
        type="button"
        onClick={onProfileClick}
        data-profile-trigger
        className="relative w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold transition-opacity duration-300 ease-out hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D1931]/30 cursor-pointer overflow-visible"
        style={{ background: '#0D1931 0% 0% no-repeat padding-box' }}
        aria-label="Abrir perfil do usuário"
        aria-expanded={isProfileMenuOpen}
      >
        <span className="select-none">MS</span>
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: '#E91E8C' }}
        >
          17
        </span>
        <span
          role="button"
          tabIndex={0}
          className="absolute w-[17px] h-[17px] flex items-center justify-center flex-shrink-0 rounded-full border border-[#707070] bg-white box-border transition-transform duration-300 ease-out cursor-pointer"
          style={{
            right: '-3px',
            bottom: '0',
            opacity: 1,
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onProfileClick?.()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onProfileClick?.()
            }
          }}
          aria-label="Abrir menu do perfil"
        >
          <img
            src={profileCaretIcon}
            alt=""
            className={`w-[9px] h-[9px] object-contain opacity-100 transition-transform duration-300 ease-out pointer-events-none ${isProfileMenuOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </button>
      </div>
    </header>
  )
}
