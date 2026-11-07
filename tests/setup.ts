import '@testing-library/jest-dom/vitest'
import { expect } from 'vitest'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// jsdom gaps that Radix UI (menus, dialogs) and our components rely on.
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

const elementProto = Element.prototype as unknown as Record<string, unknown>
elementProto.scrollIntoView ??= () => {}
elementProto.hasPointerCapture ??= () => false
elementProto.releasePointerCapture ??= () => {}
