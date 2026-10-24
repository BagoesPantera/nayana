export default defineEventHandler((event) => {
  assertSameOrigin(event)

  const item = findCctv(getRouterParam(event, 'id'))

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'CCTV not found' })
  }

  return handleCctvProxy(event, item, item.streamUrl)
})
