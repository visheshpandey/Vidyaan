import { APP_NAME, APP_TAGLINE } from '@/constants/app'

export default function App() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center p-6 text-center">
      <div>
        <h1 className="font-serif text-5xl text-primary">{APP_NAME}</h1>
        <p className="mt-2 text-muted">{APP_TAGLINE}</p>
      </div>
    </main>
  )
}
