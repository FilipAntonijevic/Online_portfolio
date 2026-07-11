import { PROJECT_VIDEOS } from './projectVideos';

/** @type {Map<string, { url?: string, promise?: Promise<string> }>} */
const cache = new Map();

function typedBlob(blob, mime) {
  if (blob.type && blob.type !== 'application/octet-stream') return blob;
  return new Blob([blob], { type: mime });
}

/** Resolve a blob: URL for a project video, fetching once and caching. */
export function ensureProjectVideo(name, baseUrl = import.meta.env.BASE_URL) {
  const config = PROJECT_VIDEOS[name];
  if (!config) return Promise.reject(new Error(`No video for ${name}`));

  const hit = cache.get(name);
  if (hit?.url) return Promise.resolve(hit.url);
  if (hit?.promise) return hit.promise;

  const promise = fetch(baseUrl + config.src, { mode: 'cors', credentials: 'omit' })
    .then((res) => {
      if (!res.ok) throw new Error(`video fetch ${res.status}`);
      return res.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(typedBlob(blob, config.type));
      cache.set(name, { url });
      return url;
    })
    .catch((err) => {
      cache.delete(name);
      throw err;
    });

  cache.set(name, { promise });
  return promise;
}

/** Kick off background downloads for every project video. */
export function preloadAllProjectVideos(baseUrl = import.meta.env.BASE_URL) {
  return Promise.allSettled(
    Object.keys(PROJECT_VIDEOS).map((name) => ensureProjectVideo(name, baseUrl))
  );
}

export function getCachedProjectVideoUrl(name) {
  return cache.get(name)?.url ?? null;
}
