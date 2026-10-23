<script setup lang="ts">
import type { Map as LeafletMap } from 'leaflet'
import type { default as HlsInstance, ErrorData } from 'hls.js'

const { data: markers } = await useFetch('/api/markers')

type MarkerItem = NonNullable<typeof markers.value>[number]

const mapEl = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const selectedCctv = ref<MarkerItem | null>(null)
const loading = ref(false)
const loadError = ref(false)
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

  map = L.map(mapEl.value as HTMLElement, { zoomControl: false }).setView(
    [-8.4095, 115.1889],
    10
  )
  L.control.zoom({ position: 'bottomright' }).addTo(map)

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

// Fly out to the marker smoothly; nudge the map up afterwards so the marker
// stays clear of the bottom sheet.
function flyToMarker(item: MarkerItem) {
  map?.flyTo([item.lat, item.lng], 13, { duration: 1 })
}

async function loadStream(cctv: MarkerItem) {
  destroyHls()
  loadError.value = false
  loading.value = true

  await nextTick()
  const video = videoRef.value
  if (!video || selectedCctv.value !== cctv) return

  const proxyUrl = `/api/cctv/${cctv.id}`

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Native HLS (Safari / iOS)
    video.src = proxyUrl
  } else {
    try {
      const { default: Hls } = await import('hls.js')
      if (selectedCctv.value !== cctv) return // selection changed while loading
      hls = new Hls()
      hls.loadSource(proxyUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.ERROR, (_event, data: ErrorData) => {
        if (data.fatal) {
          destroyHls()
          loading.value = false
          loadError.value = true
        }
      })
    } catch {
      loading.value = false
      loadError.value = true
    }
  }
}

function retry() {
  if (selectedCctv.value) loadStream(selectedCctv.value)
}

function onVideoPlaying() {
  loading.value = false
  loadError.value = false
}

function onVideoError() {
  loading.value = false
  loadError.value = true
}

watch(selectedCctv, (cctv) => {
  if (!cctv) {
    loading.value = false
    loadError.value = false
    return
  }
  loadStream(cctv)
  flyToMarker(cctv)
  setTimeout(() => map?.panBy([0, 100], { animate: true }), 300)
})
</script>

<template>
  <div class="relative h-[100dvh] w-full">
    <div ref="mapEl" class="absolute inset-0" />

    <!-- Floating header -->
    <header
      class="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 shadow-lg backdrop-blur-md"
    >
      <div class="flex items-center gap-2.5">
        <span class="relative flex h-2.5 w-2.5">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/60" />
          <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
        </span>
        <span class="text-sm font-bold tracking-widest text-white">NAYANA</span>
      </div>
      <span class="text-xs text-slate-300">Pantau Bali Real-time</span>
    </header>

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

        <div class="relative overflow-hidden rounded-lg bg-black">
          <video
            ref="videoRef"
            controls
            autoplay
            playsinline
            class="w-full aspect-video"
            @playing="onVideoPlaying"
            @error="onVideoError"
          />

          <!-- Buffering spinner -->
          <div
            v-if="loading && !loadError"
            class="absolute inset-0 flex items-center justify-center bg-black/40"
          >
            <span class="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>

          <!-- Stream error -->
          <div
            v-if="loadError"
            class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 px-4 text-center"
          >
            <p class="text-sm text-white">Stream CCTV saat ini sedang tidak tersedia / offline.</p>
            <button
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              @click="retry"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
