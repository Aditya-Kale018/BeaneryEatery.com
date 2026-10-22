import ImageSlot from './ImageSlot';
import './CafeModules.css';

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
    name: 'The Open Gathering Room',
    copy: 'A ventilated setting for celebrations, close-knit dinners and conversations worth lingering over.',
    image: 'exp-3',
    alt: 'A comfortable gathering room at Beanery',
    action: 'Enquire about the room',
    kind: 'enquire',
    href: 'tel:+919860934080',
  },
  {
    label: 'Open-air dining',
    name: 'The Rooftop Table',
    copy: 'Open skies, good food and an easy setting for golden-hour catch-ups and evenings together.',
    image: 'exp-banner',
    alt: 'Beanery rooftop prepared for an evening',
    action: 'Enquire about the rooftop',
    kind: 'enquire',
    href: 'tel:+919860934080',
  },
  {
    label: 'Corporate & team gatherings',
    name: 'The Conference Room',
    copy: 'A considered room for team conversations, client meetings and working sessions over good coffee.',
    image: 'exp-2',
    alt: 'A conference room prepared for a team meeting',
    action: 'Plan a meeting',
    kind: 'enquire',
    href: 'tel:+919860934080',
  },
  {
    label: 'Weekend gatherings',
    name: 'Sunday Brunch',
    copy: 'Bring your favourite people together for a relaxed brunch, good coffee and an unhurried start to Sunday.',
    image: 'part-morning',
    alt: 'A bright Beanery table ready for a relaxed brunch',
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
  {
    label: 'Good people, good coffee',
    name: 'Meetups',
    copy: 'Make room for a club, community or catch-up. Beanery offers a welcoming place to meet over coffee and food.',
    image: 'exp-4',
    alt: 'A welcoming café table prepared for a small meetup',
    action: 'Plan a meetup',
    kind: 'enquire',
    href: '#event-enquiry',
  },
];

const homeModules = [
  { label: 'Coffee specialty', name: 'Coffee Specialty', copy: 'Explore our selected beans, espresso favourites and carefully prepared brewing methods.', image: 'coffee-hero', alt: 'Beanery coffee prepared at the bar', action: 'Explore coffee', target: 'coffee' },
  { label: 'Fresh from the oven', name: 'Bake House', copy: 'Slow-fermented bread, fresh bakes and a small selection of sweet and savoury favourites.', image: 'bakery-1', alt: 'Freshly baked bread from the Beanery bake house', action: 'Explore the menu', target: 'food' },
  { label: 'From the kitchen', name: 'European Food', copy: 'A considered all-day menu shaped by European café food and made with care in our kitchen.', image: 'dishstory-1', alt: 'A European-style café dish from the Beanery kitchen', action: 'Explore the menu', target: 'food' },
  { label: 'A place to settle in', name: 'Good Ambience & Facilities', copy: 'A welcoming dining room, ventilated gathering space, rooftop seating and a conference room for longer visits.', image: 'hero-grid-2', alt: 'The welcoming Beanery dining room', action: 'Explore the spaces', target: 'experiences' },
];

export default function CafeModules({ goFood, goCoffee, goExperiences, detailed = false, variant = 'standard' }) {
  const visibleModules = variant === 'home' ? homeModules : modules;
  const navigate = (target) => target === 'coffee' ? goCoffee : target === 'experiences' ? goExperiences : goFood;
  return (
    <div className={`cafe-module-grid${detailed ? ' cafe-module-grid--detailed' : ''}${variant === 'home' ? ' cafe-module-grid--home' : ''}`}>
      {visibleModules.map((module, index) => (
        <article className={`cafe-module${variant === 'home' ? ' cafe-module--home' : ''}`} key={module.name} data-reveal={index * 50}>
          <div className="cafe-module__image">
            <ImageSlot id={module.image} alt={module.alt} priority={detailed && index === 0} />
            {variant === 'home' ? <span className="cafe-module__index">0{index + 1}</span> : null}
          </div>
          <div className="cafe-module__copy">
            <span className="hospitality-label">{module.label}</span>
            <h3>{module.name}</h3>
            <p>{module.copy}</p>
            {(module.kind === 'menu' || module.target) ? (
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
