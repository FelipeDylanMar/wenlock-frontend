import welcomeImg from '@/assets/Group 669.svg'

export function HomePage() {
  const today = new Date()
  const day = today.toLocaleDateString('pt-BR', { day: '2-digit' })
  const monthRaw = today.toLocaleDateString('pt-BR', { month: 'long' })
  const month = monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1)
  const year = today.getFullYear()
  const formatted = `${day}, ${month} ${year}`

  return (
    <div className="h-full bg-[#F3F3F3] flex flex-col min-h-0 pl-[44px] pr-[46px] pt-[10px] pb-[76px] overflow-hidden">
      <div className="ml-auto flex flex-col min-h-0 flex-1 max-w-[1494px] w-full">
        <h1 className="font-['Manrope'] text-[38px] leading-[52px] font-bold text-[#0B2B25] mb-6">Home</h1>
        <div
          className="bg-white px-6 py-5 w-[1494px] max-w-full h-[834px] min-h-0 overflow-hidden flex flex-col"
        style={{
          background: 'var(--full-branco-ffffff, #FFFFFF) 0% 0% no-repeat padding-box',
          boxShadow: '0px 1px 4px #00000029',
          borderRadius: '5px',
          opacity: 1,
        }}
      >
        <h2 className="font-['Manrope'] text-[32px] leading-[44px] font-bold text-[#0D1931] shrink-0">
          Olá Millena!
        </h2>
        <p className="font-['Manrope'] text-[18px] leading-[32px] font-semibold text-[#0D1931] shrink-0">
          {formatted}
        </p>

        <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-4">
          <div className="w-full max-w-[609px] flex flex-col items-center justify-center gap-8 -mt-12">
            <img
              src={welcomeImg}
              alt="Bem-vindo ao WenLock"
              className="w-full max-w-[460px] h-auto max-h-[384px] object-contain opacity-100"
            />
            <div
              className="w-full max-w-[540px] h-[81px] min-h-[81px] flex items-center justify-center shrink-0"
              style={{
                background: '#28284700 0% 0% no-repeat padding-box',
                boxShadow: '0px 3px 6px #00000029',
                border: '1px solid #272846',
                borderRadius: '9px',
                opacity: 1,
              }}
            >
              <p className="font-['Manrope'] font-bold text-[#0D1931] text-lg">Bem-vindo ao WenLock!</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
