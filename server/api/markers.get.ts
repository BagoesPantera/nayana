import cctvData from '../data/cctv.json'

export default defineEventHandler(() =>
  cctvData.map(({ streamUrl: _streamUrl, ...marker }) => marker)
)
