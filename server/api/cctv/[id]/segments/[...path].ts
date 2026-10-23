export default defineEventHandler((event) => {
  const item = findCctv(getRouterParam(event, 'id'))

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'CCTV not found' })
  }

  let target = ''
  try {
    target = decodeURIComponent(getRouterParam(event, 'path') ?? '')
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
