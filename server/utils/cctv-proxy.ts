import type { H3Event } from 'h3'
import cctvData from '../data/cctv.json'

// Request headers some HLS sources require before serving their streams.
export const PROXY_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
  Referer: 'https://cctv-pemerintah.baliprov.go.id/'
}

export function findCctv(id: string | undefined) {
  return cctvData.find((entry) => entry.id === id)
}

// Only allow proxied segment targets that live under the stream origin dir,
// so the segment catcher cannot be abused as an open proxy.
export function isAllowedSegmentTarget(streamUrl: string, targetUrl: string): boolean {
  try {
    const stream = new URL(streamUrl)
    const target = new URL(targetUrl)
    const baseDir = stream.pathname.slice(0, stream.pathname.lastIndexOf('/') + 1)
    return (
      target.protocol === stream.protocol &&
      target.host === stream.host &&
      target.pathname.startsWith(baseDir)
    )
  } catch {
    return false
  }
}

// Point every URI in an HLS playlist back at our proxy so the real stream
// host stays hidden and segments are CORS-safe.
export function rewriteHlsUrls(text: string, id: string, playlistUrl: string): string {
  const prefix = `/api/cctv/${id}/segments/`

  const toProxyTarget = (uri: string): string | null => {
    if (!uri || uri.startsWith('data:')) return null
    try {
      const abs = new URL(uri, playlistUrl).href
      if (!isAllowedSegmentTarget(playlistUrl, abs)) return null
      return `${prefix}${encodeURIComponent(abs)}`
    } catch {
      return null
    }
  }

  return text
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return line
      if (trimmed.startsWith('#')) {
        return line.replace(/URI="([^"]+)"/g, (_match, uri: string) => {
          const target = toProxyTarget(uri)
          return target ? `URI="${target}"` : _match
        })
      }
      return toProxyTarget(trimmed) ?? line
    })
    .join('\n')
}

// Proxy one resource: playlists come back with rewritten URIs, raw
// segments are piped straight through.
export async function handleCctvProxy(
  event: H3Event,
  cctv: (typeof cctvData)[number],
  targetUrl: string
) {
  if (/\.m3u8(\?|$)/.test(targetUrl)) {
    const res = await fetch(targetUrl, { headers: PROXY_HEADERS })
    const text = await res.text()
    setResponseHeader(
      event,
      'content-type',
      res.headers.get('content-type') || 'application/vnd.apple.mpegurl'
    )
    return rewriteHlsUrls(text, cctv.id, targetUrl)
  }

  return proxyRequest(event, targetUrl, { headers: PROXY_HEADERS })
}
