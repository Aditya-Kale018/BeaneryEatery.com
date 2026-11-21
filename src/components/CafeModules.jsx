import ImageSlot from './ImageSlot';
import './CafeModules.css';
import { FLOOR_MANAGER_PHONE, MEETING_ROOM_COVER_CHARGE } from '../../shared/venue-config';

const FLOOR_MANAGER_DIGITS = FLOOR_MANAGER_PHONE.replace(/\D/g, '');

const modules = [
  {
    label: 'All-day café',
    name: 'The Everyday Table',
    copy: 'Thoughtful coffee, bakery favourites and an all-day kitchen menu, ready for a quick pause or a long lunch.',
    image: 'hero-grid-1',
    alt: 'The dining room at Beanery, set for all-day café dining',
    action: 'Explore the menu',
    kind: 'menu',
  },
  {
    label: 'Private dining',
    name: 'The Open Lounge',
    copy: 'A ventilated setting for celebrations, close-knit dinners and conversations worth lingering over.',
    image: 'open-lounge',
    alt: 'The Open Lounge at Beanery, with rattan chairs and warm pendant lights',
    action: 'Enquire about the room',
    kind: 'enquire',
    href: 'tel:+919860934080',
  },
  {
    label: 'Open-air dining',
    name: 'The Rooftop Table',
    copy: 'Open skies, good food and an easy setting for golden-hour catch-ups and evenings together.',
    image: 'rooftop-table',
    alt: 'Beanery rooftop prepared for an evening',
    action: 'Enquire about the rooftop',
    kind: 'enquire',
    href: 'tel:+919860934080',
  },
  {
    id: 'meeting-room',
    label: 'Meetings & team gatherings',
    name: 'The Meeting Room',
    copy: 'A considered room for team conversations, client meetings and working sessions over good coffee.',
    image: 'exp-2',
    alt: 'A conference room prepared for a team meeting',
    action: 'Call to Book',
    kind: 'enquire',
    href: `tel:${FLOOR_MANAGER_PHONE}`,
    whatsappHref: `https://wa.me/${FLOOR_MANAGER_DIGITS}`,
    coverCharge: MEETING_ROOM_COVER_CHARGE,
    coverNote: 'Redeemable on your bill.',
    confirmationNote: 'Booking is confirmed after payment, handled by our team over a call.',
  },
  {
    id: 'coworking-space',
    label: 'Work from Beanery',
    name: 'Coworking Space',
    copy: 'Settle in for focused work with coffee and food close by. A calm café setting for a few productive hours.',
    image: 'exp-4',
    alt: 'A quiet table at Beanery for working over coffee',
    action: 'Enquire',
    kind: 'enquire',
    href: '#event-enquiry',
    amenities: ['Wi-Fi', 'Power outlets', 'Quiet seating', 'Food and coffee on site'],
    detailNote: 'Pricing, timings and amenity details are being confirmed.',
  },
  {
    label: 'Weekend gatherings',
    name: 'Sunday Brunch',
    copy: 'Bring your favourite people together for a relaxed brunch, good coffee and an unhurried start to Sunday.',
    image: 'sunday-brunch',
    alt: 'A spread of freshly baked breads for Sunday brunch at Beanery',
    action: 'Plan a brunch',
    kind: 'enquire',
    href: '#event-enquiry',
  },
  {
    label: 'Teams & businesses',
    name: 'Corporate Events',
    copy: 'Gather your team or welcome clients in a considered café setting, with food and coffee to keep the conversation going.',
    image: 'exp-2',
    alt: 'A café table arranged for a team gathering',
    action: 'Plan a corporate event',
    kind: 'enquire',
    href: '#event-enquiry',
  },
  {
    label: 'A day worth celebrating',
    name: 'Birthday Parties',
    copy: 'Mark the occasion around a table with your favourite people, thoughtful plates and something sweet to finish.',
    image: 'exp-3',
    alt: 'A warm dining room setting for a birthday celebration',
    action: 'Plan a birthday',
    kind: 'enquire',
    href: '#event-enquiry',
  },
];

const homeModules = [
  { label: 'Coffee specialty', name: 'Coffee Specialty', copy: 'Explore our selected beans, espresso favourites and carefully prepared brewing methods.', image: 'coffee-hero', alt: 'Beanery coffee prepared at the bar', action: 'Explore coffee', target: 'coffee' },
  { label: 'Fresh from the oven', name: 'Bake House', copy: 'Slow-fermented bread, fresh bakes and a small selection of sweet and savoury favourites.', image: 'bakery-1', alt: 'Freshly baked bread from the Beanery bake house', action: 'Explore the menu', target: 'food' },
  { label: 'From the kitchen', name: 'European Food', copy: 'A considered all-day menu shaped by European café food and made with care in our kitchen.', image: 'dishstory-1', alt: 'A European-style café dish from the Beanery kitchen', action: 'Explore the menu', target: 'food' },
  { label: 'A place to settle in', name: 'Good Ambience & Facilities', copy: 'A welcoming dining room, ventilated gathering space, rooftop seating and a conference room for longer visits.', image: 'good-ambience', alt: 'The welcoming Beanery dining room', action: 'Explore the spaces', target: 'experiences' },
];

export default function CafeModules({ goFood, goCoffee, goExperiences, detailed = false, variant = 'standard' }) {
  const visibleModules = variant === 'home' ? homeModules : modules;
  const navigate = (target) => target === 'coffee' ? goCoffee : target === 'experiences' ? goExperiences : goFood;
  return (
    <div className={`cafe-module-grid${detailed ? ' cafe-module-grid--detailed' : ''}${variant === 'home' ? ' cafe-module-grid--home' : ''}`}>
      {visibleModules.map((module, index) => (
        <article id={module.id} className={`cafe-module${variant === 'home' ? ' cafe-module--home' : ''}`} key={module.name} data-reveal={index * 50}>
          <div className="cafe-module__image">
            <ImageSlot id={module.image} alt={module.alt} priority={detailed && index === 0} />
            {variant === 'home' ? <span className="cafe-module__index">0{index + 1}</span> : null}
          </div>
          <div className="cafe-module__copy">
            <span className="hospitality-label">{module.label}</span>
            <h3>{module.name}</h3>
            {module.coverCharge ? (
              <div className="cafe-module__cover-charge">
                <strong>₹{module.coverCharge.toLocaleString('en-IN')}</strong>
                <span>Cover charge</span>
                <span className="cafe-module__redeemable">Redeemable</span>
                <p>{module.coverNote}</p>
              </div>
            ) : null}
            {module.confirmationNote ? <p className="cafe-module__confirmation-note">{module.confirmationNote}</p> : null}
            <p>{module.copy}</p>
            {module.amenities ? (
              <>
                {/* TODO: Replace placeholder amenities with the client's confirmed coworking facilities. */}
                <ul className="cafe-module__amenities">{module.amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}</ul>
                {/* TODO: Add confirmed coworking pricing and operating hours when supplied by the client. */}
                <p className="cafe-module__detail-note">{module.detailNote}</p>
              </>
            ) : null}
            {module.whatsappHref ? (
              <div className="cafe-module__contact-actions">
                <a href={module.href} aria-label="Call the floor manager to book the meeting room">Call to Book<span aria-hidden="true">↗</span></a>
                <a href={module.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Message the floor manager on WhatsApp about the meeting room">WhatsApp<span aria-hidden="true">↗</span></a>
              </div>
            ) : (module.kind === 'menu' || module.target) ? (
              <button type="button" onClick={navigate(module.target)}>{module.action}<span aria-hidden="true">→</span></button>
            ) : (
              <a
                href={module.href}
                onClick={module.href === '#event-enquiry' ? (event) => {
                  event.preventDefault();
                  document.getElementById('event-enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } : undefined}
              >{module.action}<span aria-hidden="true">→</span></a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
