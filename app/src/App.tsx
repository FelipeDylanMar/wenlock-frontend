import { useEffect, useState } from 'react'
import { routes } from '@/routes'
import '@/styles/global.css'

function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const route = routes.find((r) => r.path === path) ?? routes[0]
  return route.element
}

export default App
