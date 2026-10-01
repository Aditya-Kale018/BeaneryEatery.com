// The design prototype expressed every rule as a CSS declaration string in an
// inline `style` attribute, and several of those strings are produced at
// runtime by the component (selected/unselected button states, profile bars).
// Keeping the strings verbatim and parsing them here means the styles in this
// app are byte-identical to the ones in the design - nothing is retyped into
// a React object, so nothing can drift.

const cache = new Map();

// Palette sampled toward the real room: limewashed plaster, cane and oak,
// dark espresso metalwork, terracotta tableware and muted foliage. Mapping at
// the parser keeps the original design's hundreds of carefully composed rules
// intact while allowing the venue palette to evolve as one system.
const VENUE_PALETTE = {
  '#5E2B17': '#35261F', // espresso / near-black timber
  '#FBF8F4': '#F6F0E7', // warm plaster
  '#EFE3D8': '#E8DDCE', // limestone
  '#DFCBB9': '#D2B996', // cane / light oak
  '#A35730': '#9A5D3B', // terracotta
  '#6E4A34': '#655248', // warm body copy
  '#96755C': '#897466', // muted stone
  '#B78765': '#B77C58', // copper highlight
  '#71351C': '#4A3025', // dark walnut
  '#2E5D36': '#4D6048', // botanical green
  '#6B8F5A': '#66775B',
  '#A7B88F': '#9DA98B',
};

function venueValue(value) {
  return value.replace(/#[A-Fa-f0-9]{6}/g, (colour) => VENUE_PALETTE[colour.toUpperCase()] || colour);
}

function toCamel(prop) {
  if (prop.startsWith('--')) return prop; // custom property, pass through
  return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Parse a CSS declaration string ("color:#5E2B17;font-size:14px") into the
 * style object React expects. Values stay strings, so React writes them out
 * exactly as authored instead of appending units of its own.
 */
export function st(css) {
  if (!css) return undefined;
  const hit = cache.get(css);
  if (hit) return hit;

  const out = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop || !value) continue;
    out[toCamel(prop)] = venueValue(value);
  }

  cache.set(css, out);
  return out;
}
