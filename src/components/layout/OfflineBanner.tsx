import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

/**
 * Thin notice shown only while offline. Everything the student has saved is in their browser, so the
 * app keeps working; the banner just explains why links to official sites will not open.
 */
export function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null
  return (
    <div
      role="status"
      className="no-print flex items-center justify-center gap-2 bg-warning px-4 py-2 text-center text-sm font-medium text-white"
    >
      <WifiOff size={16} aria-hidden />
      You are offline. Your saved data is still here; official sites will open once you reconnect.
    </div>
  )
}
