<script setup lang="ts">
import type { Map as LeafletMap } from 'leaflet'
import type { default as HlsInstance } from 'hls.js'

const { data: markers } = await useFetch('/api/markers')

type MarkerItem = NonNullable<typeof markers.value>[number]

const mapEl = ref<HTMLElement | null>(null)
const selectedCctv = ref<MarkerItem | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
let map: LeafletMap | null = null
let hls: HlsInstance | null = null

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
  destroyHls()
})

function destroyHls() {
  hls?.destroy()
  hls = null
}

watch(selectedCctv, async (cctv) => {
  destroyHls()
  if (!cctv) return

  await nextTick()
  const video = videoRef.value
  if (!video) return

  const proxyUrl = `/api/cctv/${cctv.id}`

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Native HLS (Safari / iOS)
    video.src = proxyUrl
  } else {
    const { default: Hls } = await import('hls.js')
    if (selectedCctv.value !== cctv) return // selection changed while loading
    hls = new Hls()
    hls.loadSource(proxyUrl)
    hls.attachMedia(video)
  }
})
</script>

<template>
  <div class="relative h-[100dvh] w-full">
    <div ref="mapEl" class="absolute inset-0" />

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="selectedCctv"
        class="absolute inset-x-0 bottom-0 z-[1000] rounded-t-2xl bg-white/95 p-4 shadow-2xl backdrop-blur"
      >
        <div class="flex items-start justify-between pb-3">
          <div>
            <p class="text-xs uppercase tracking-wide text-zinc-500">CCTV Live</p>
            <p class="text-lg font-semibold">{{ selectedCctv.title }}</p>
          </div>
          <button
            aria-label="Close player"
            class="rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
            @click="selectedCctv = null"
          >
            &#10005;
          </button>
        </div>

        <video
          ref="videoRef"
          controls
          autoplay
          playsinline
          class="w-full aspect-video rounded-lg bg-black"
        />
      </div>
    </Transition>
  </div>
</template>
