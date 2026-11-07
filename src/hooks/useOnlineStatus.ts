import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void): () => void {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

const isOnline = (): boolean => navigator.onLine
const serverSnapshot = (): boolean => true

/** True while the browser has a network connection. Updates when the connection comes or goes. */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, isOnline, serverSnapshot)
}
