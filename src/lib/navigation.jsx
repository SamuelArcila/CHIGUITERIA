import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const NavigationContext = createContext(null)

export function NavigationProvider({ children }) {
  const normalizar = (ruta) => ruta.replace(/\/+$/, '') || '/'
  const [path, setPath] = useState(() => normalizar(window.location.pathname))

  useEffect(() => {
    const sync = () => setPath(normalizar(window.location.pathname))
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (replace) window.history.replaceState({}, '', to)
    else window.history.pushState({}, '', to)
    setPath(normalizar(window.location.pathname))
    window.scrollTo(0, 0)
  }, [])

  const value = useMemo(() => ({ path, navigate }), [path, navigate])

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  const value = useContext(NavigationContext)
  if (!value) throw new Error('La navegación debe usarse dentro de NavigationProvider')
  return value
}

export function useNavigate() { return useNavigation().navigate }

export function useParams() {
  const { path } = useNavigation()
  const match = path.match(/^\/staff\/ingresar\/([^/]+)\/?$/)
  return { rol: match ? decodeURIComponent(match[1]) : undefined }
}

function seguirEnLaApp(event) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  return true
}

export function Link({ to, onClick, children, ...props }) {
  const navigate = useNavigate()
  return <a href={to} {...props} onClick={(event) => {
    onClick?.(event)
    if (!event.defaultPrevented && seguirEnLaApp(event)) {
      event.preventDefault()
      navigate(to)
    }
  }}>{children}</a>
}

export function NavLink({ to, children, ...props }) {
  const { path } = useNavigation()
  const activa = path === to || path.startsWith(`${to}/`)
  return <Link to={to} aria-current={activa ? 'page' : undefined} {...props}>{children}</Link>
}

export function Navigate({ to, replace = false }) {
  const navigate = useNavigate()
  useEffect(() => { navigate(to, { replace }) }, [navigate, replace, to])
  return null
}
