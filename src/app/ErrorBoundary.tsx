import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State {
  failed: boolean
}

/** Last-resort guard so a rendering bug shows a recovery screen, not a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Intentionally silent: no external logging in a frontend-only app.
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" className="mx-auto max-w-md p-10 text-center">
        <h1 className="font-serif text-2xl text-heading">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted">
          Your saved data is safe. Reload the page to continue.
        </p>
        <button
          className="mt-4 h-11 rounded-control bg-primary px-4 text-sm font-medium text-white"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    )
  }
}
