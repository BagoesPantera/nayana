<script setup lang="ts">
import type { Map as LeafletMap } from 'leaflet'

const { data: markers } = await useFetch('/api/markers')

type MarkerItem = NonNullable<typeof markers.value>[number]

const mapEl = ref<HTMLElement | null>(null)
const selectedCctv = ref<MarkerItem | null>(null)
let map: LeafletMap | null = null

onMounted(async () => {
  const L = await import('leaflet')

  // Bundlers break Leaflet's default icon paths; point them at the CDN.
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
  })

  map = L.map(mapEl.value as HTMLElement).setView([-8.4095, 115.1889], 10)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  markers.value?.forEach((item) => {
    L.marker([item.lat, item.lng])
      .addTo(map as LeafletMap)
      .on('click', () => {
        selectedCctv.value = item
      })
  })
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div class="relative h-[100dvh] w-full">
    <div ref="mapEl" class="absolute inset-0" />

    <div
      v-if="selectedCctv"
      class="absolute inset-x-3 bottom-3 z-[1000] rounded-xl bg-white/95 p-4 shadow-lg"
    >
      <p class="text-xs uppercase tracking-wide text-zinc-500">Selected CCTV</p>
      <p class="text-lg font-semibold">{{ selectedCctv.title }}</p>
    </div>
  </div>
</template>
