import { SLOTS } from '../assets/images';
import { useImageOverride } from '../content/ContentProvider';
import './ImageSlot.css';

function PlaceholderIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

// Cached images can finish decoding before React attaches onLoad, so the ref
// marks those as settled immediately - otherwise they would stay faded out.
function markSettled(el) {
  if (el && el.complete) el.setAttribute('data-settled', '');
}

/**
 * Responsive image slot using native browser layout.
 *
 * The previous implementation measured every frame with ResizeObserver and
 * created a second Image object for every photograph. Safari can enter a
 * resize feedback loop when those calculated dimensions are used inside flex
 * rails. All current crops are centred, so object-fit gives the same visual
 * result without eager downloads, layout churn or observer loops.
 *
 * Pass `priority` for slots that sit above the fold on first paint. Those load
 * eagerly at high fetch priority so the frame is never left standing empty
 * while the browser defers a lazy image.
 */
export default function ImageSlot({ id, placeholder, fit = 'cover', alt = '', priority = false }) {
  // An image uploaded through the admin replaces the bundled photograph for
  // this slot. Its crop is the slot's default, since a new file has no saved
  // pan or scale of its own.
  const override = useImageOverride(id);
  const bundled = SLOTS[id];
  const slot = override ? { src: override, s: 1, x: 0, y: 0 } : bundled;

  if (!slot) {
    return (
      <div className="imgslot" data-slot={id}>
        <div className="frame">
          <div className="empty">
            <PlaceholderIcon />
            <div className="cap">{placeholder || 'Image unavailable'}</div>
          </div>
          <div className="ring" />
        </div>
      </div>
    );
  }

  const settle = (e) => e.currentTarget.setAttribute('data-settled', '');

  return (
    <div className="imgslot" data-slot={id} data-filled="">
      <div className="frame">
        <img
          src={slot.src}
          alt={alt}
          draggable="false"
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : 'auto'}
          decoding="async"
          ref={markSettled}
          onLoad={settle}
          onError={settle}
          style={{
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            objectFit: fit === 'contain' ? 'contain' : 'cover',
            objectPosition: `${50 + slot.x}% ${50 + slot.y}%`,
            transform: slot.s === 1 ? 'none' : `scale(${slot.s})`,
          }}
        />
        <div className="ring" />
      </div>
    </div>
  );
}
