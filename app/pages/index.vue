<script setup lang="ts">
import type { Map as MaplibreMap } from 'maplibre-gl'
import type { default as HlsInstance, ErrorData } from 'hls.js'

const { data: markers } = await useFetch('/api/markers')

type MarkerItem = NonNullable<typeof markers.value>[number]

const videoRef = ref<HTMLVideoElement | null>(null)
const selectedCctv = ref<MarkerItem | null>(null)
const loading = ref(false)
const loadError = ref(false)
let map: MaplibreMap | null = null
let settlePan: (() => void) | null = null
let hls: HlsInstance | null = null

onMounted(async () => {
  const maplibregl = await import('maplibre-gl')

  // Vite's worker bundling breaks MapLibre's internal worker — point it at
  // the pinned CDN copy (`maplibre-gl-csp-worker.js` no longer exists in v6)
  // before any Map is constructed.
  maplibregl.setWorkerUrl('https://unpkg.com/maplibre-gl@6.15.0/dist/maplibre-gl-worker.mjs')

  console.log('MARKERS DATA:', markers.value)

  // ponytail: temporary debug boot + one-shot fallback to prove whether the
  // blank map is an OpenFreeMap asset issue (glyphs/sprites/tiles) or our
  // setup. Remove the logging + fallback branch once the map renders.
  const bootMap = (style: string, isFallback = false) => {
    map?.remove()
    map = new maplibregl.Map({
      container: 'map',
      style,
      // MapLibre uses [lng, lat] order.
      center: [115.1889, -8.4095],
      zoom: 10
    })

    map.on('error', (e) => console.error('MAPLIBRE ERROR:', e))

    map.on('load', () => {
      if (!map) return
      console.log('MAP LOADED', map.getCenter(), isFallback ? '(fallback style)' : '')
      markers.value?.forEach((item) => {
        console.log('ADDING MARKER AT:', [item.lng, item.lat])
        new maplibregl.Marker()
          .setLngLat([item.lng, item.lat])
          .addTo(map as MaplibreMap)
          .getElement()
          .addEventListener('click', () => {
            selectedCctv.value = item
          })
      })
    })
  }

  bootMap('https://tiles.openfreemap.org/styles/liberty')

  // Retry once with the MapLibre demo style on the first style-level error.
  // ponytail: fires on any map error (tiles included), not only style errors.
  map?.once('error', (e) => {
    console.error('MAPLIBRE ERROR:', e)
    bootMap('https://demotiles.maplibre.org/style.json', true)
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
  if (!map) return
  if (settlePan) map.off('moveend', settlePan)

  map.flyTo({ center: [item.lng, item.lat], zoom: 13, duration: 1000 })

  settlePan = () => {
    if (!map || !settlePan) return
    map.off('moveend', settlePan)
    settlePan = null
    map.panBy([0, -100])
  }
  map.on('moveend', settlePan)
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
})
</script>

<template>
  <div class="relative h-[100dvh] w-full">
    <div id="map" class="w-full h-full absolute inset-0 z-0" />

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
