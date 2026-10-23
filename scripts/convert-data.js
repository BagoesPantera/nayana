// One-run converter: camera.txt (scraped JSON) -> server/data/cctv.json
// Usage: node scripts/convert-data.js
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SRC = resolve(__dirname, '../server/data/camera.txt');
const OUT = resolve(__dirname, '../server/data/cctv.json');

// Normalize upstream HLS url: trim junk, ensure a playable .m3u8 manifest.
// Upstream style: "https://atcs.denpasarkota.go.id/stream/<NAME>/ \r\n" -> append index.m3u8
function normalizeHls(raw) {
  let url = String(raw || '').trim();
  if (!url) return '';
  if (/\.m3u8(\?.*)?$/i.test(url)) return url;
  return url.endsWith('/') ? `${url}index.m3u8` : `${url}/index.m3u8`;
}

const src = JSON.parse(readFileSync(SRC, 'utf8'));
const rows = Array.isArray(src) ? src : src.data ?? [];

const out = rows
  .filter((it) => it.is_active === true && Array.isArray(it.tb_device_lokasi) && it.tb_device_lokasi.length > 0)
  .map((it) => ({
    id: `denpasar-${it.id_lokasi}`,
    title: String(it.nama_lokasi ?? '').replace(/\s+/g, ' ').trim(),
    lat: Number(it.lat_lokasi),
    lng: Number(it.lon_lokasi),
    streamUrl: normalizeHls(it.tb_device_lokasi[0].url_proxy_hls),
  }))
  .filter((it) => it.streamUrl && Number.isFinite(it.lat) && Number.isFinite(it.lng));

writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`Converted ${out.length} items -> ${OUT}`);
