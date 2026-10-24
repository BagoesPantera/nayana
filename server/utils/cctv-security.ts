import type { H3Event } from 'h3'

// Gatekeeping: only same-origin browser requests may hit the CCTV proxy.
// Direct address-bar access carries no Referer, so it gets rejected here.
export function isSameOriginRequest(event: H3Event): boolean {
  const host = getHeader(event, 'host')
  if (!host) return false

  // Helper header we send from the HLS player (xhrSetup) as a fallback,
  // since some browsers strip Referer on cross-worker segment fetches.
  if (getHeader(event, 'x-nayana-client') === 'true') return true

  const allowed = new Set([host, `${host}:3000`])
  if (import.meta.dev) {
    allowed.add('localhost:3000')
    allowed.add('127.0.0.1:3000')
  }

  for (const header of [getHeader(event, 'referer'), getHeader(event, 'origin')]) {
    if (!header) continue
    try {
      if (allowed.has(new URL(header).host)) return true
    } catch {
      // malformed header value — ignore and keep checking
    }
  }
  return false
}

export function assertSameOrigin(event: H3Event): void {
  if (!isSameOriginRequest(event)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access Denied: Direct access is prohibited'
    })
  }
}
