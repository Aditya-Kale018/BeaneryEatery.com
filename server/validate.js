import { DEFAULT_CONTENT, DIETS } from '../shared/content-defaults.js';

/**
 * Normalises whatever the admin UI posts into the exact shape the site renders.
 *
 * This is deliberately a whitelist rather than a schema check: unknown keys are
 * dropped and missing ones fall back to the current value, so a stale or partial
 * payload can never leave the site with a hole in it.
 */

const MAX_TEXT = 4000;

function text(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  return value.replace(/\r\n/g, '\n').slice(0, MAX_TEXT);
}

function url(value, fallback = '') {
  const raw = text(value, fallback).trim();
  if (!raw) return '';
  // Only http(s) - a javascript: or data: URL here would end up in an href.
  if (!/^https?:\/\//i.test(raw)) return fallback;
  return raw;
}

function slug(value, fallback) {
  const raw = text(value, '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
  return raw || fallback;
}

function menuItem(raw) {
  return {
    name: text(raw?.name).trim(),
    description: text(raw?.description).trim(),
    price: text(raw?.price, '').trim().slice(0, 40),
    diet: DIETS.includes(raw?.diet) ? raw.diet : 'V',
  };
}

function menuGroup(raw, index) {
  const items = Array.isArray(raw?.items) ? raw.items : [];
  return {
    id: slug(raw?.id, `group-${index + 1}`),
    number: text(raw?.number, String(index + 1).padStart(2, '0')).trim().slice(0, 8),
    title: text(raw?.title).trim(),
    note: text(raw?.note).trim(),
    // An item with no name has nothing to render, so drop it rather than
    // leaving a blank row on the menu.
    items: items.map(menuItem).filter((i) => i.name),
  };
}

function page(raw, fallback) {
  const out = {};
  for (const key of Object.keys(fallback)) {
    out[key] = text(raw?.[key], fallback[key]);
  }
  return out;
}

function images(raw, uploadUrls) {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [slotId, value] of Object.entries(raw)) {
    if (typeof value !== 'string' || !value) continue;
    // Only ever point a slot at a file this server actually serves.
    if (!uploadUrls.has(value)) continue;
    out[slotId] = value;
  }
  return out;
}

export function normaliseContent(input, current, uploadUrls) {
  const base = current ?? DEFAULT_CONTENT;
  const groups = Array.isArray(input?.menu?.groups) ? input.menu.groups : base.menu.groups;

  const pages = {};
  for (const [key, fallback] of Object.entries(DEFAULT_CONTENT.pages)) {
    pages[key] = page(input?.pages?.[key] ?? base.pages?.[key], fallback);
  }

  return {
    site: {
      reserveUrl: url(input?.site?.reserveUrl, base.site.reserveUrl),
      mapsUrl: url(input?.site?.mapsUrl, base.site.mapsUrl),
      instagramUrl: url(input?.site?.instagramUrl, base.site.instagramUrl),
      liveMenuUrl: url(input?.site?.liveMenuUrl, base.site.liveMenuUrl),
    },
    pages,
    menu: {
      ...page(input?.menu ?? base.menu, {
        eyebrowLeft: DEFAULT_CONTENT.menu.eyebrowLeft,
        eyebrowRight: DEFAULT_CONTENT.menu.eyebrowRight,
        kicker: DEFAULT_CONTENT.menu.kicker,
        titleLine1: DEFAULT_CONTENT.menu.titleLine1,
        titleLine2: DEFAULT_CONTENT.menu.titleLine2,
        intro: DEFAULT_CONTENT.menu.intro,
        legendNote: DEFAULT_CONTENT.menu.legendNote,
      }),
      groups: groups.map(menuGroup).filter((g) => g.title),
    },
    images: images(input?.images, uploadUrls),
  };
}
