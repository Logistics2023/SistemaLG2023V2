import { UserProvider } from '../context/Context'
import { useEffect } from 'react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister())
      })
    }

    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key))
      })
    }
  }, [])

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  ) 
}

export default MyApp

