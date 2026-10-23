export default defineEventHandler((event) => {
  const item = findCctv(getRouterParam(event, 'id'))

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'CCTV not found' })
  }

  return handleCctvProxy(event, item, item.streamUrl)
})
