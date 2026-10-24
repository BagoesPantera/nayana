export default defineEventHandler((event) => {
  assertSameOrigin(event)

  const item = findCctv(getRouterParam(event, 'id'))

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'CCTV not found' })
  }

  const token = getRouterParam(event, 'path') ?? ''

  let target = ''
  try {
    // The playlist carries base64url tokens, never the real URL.
    target = Buffer.from(token, 'base64url').toString('utf-8')
    if (!/^https?:\/\//.test(target)) target = ''
  } catch {
    target = ''
  }

  // ponytail: whitelist is one directory deep from the stream origin; widen
  // isAllowedSegmentTarget if a stream ever partners outside its own folder.
  if (!isAllowedSegmentTarget(item.streamUrl, target)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden segment' })
  }

  return handleCctvProxy(event, item, target)
})
