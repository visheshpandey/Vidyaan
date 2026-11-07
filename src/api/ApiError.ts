/** Why a request failed. Callers branch on this instead of parsing messages. */
type ApiErrorCode = 'network' | 'timeout' | 'http' | 'invalid'

/** The only error type the API layer throws. */
export class ApiError extends Error {
  readonly code: ApiErrorCode
  /** HTTP status, present when `code` is 'http'. */
  readonly status: number | undefined

  constructor(
    message: string,
    code: ApiErrorCode,
    options: { status?: number; cause?: unknown } = {},
  ) {
    super(message, { cause: options.cause })
    this.name = 'ApiError'
    this.code = code
    this.status = options.status
  }
}
