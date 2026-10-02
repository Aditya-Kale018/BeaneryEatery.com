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
    name: 'The Private Lounge',
    copy: 'A more intimate setting for celebrations, close-knit dinners and conversations worth lingering over.',
    image: 'exp-3',
    alt: 'A private dining setting at Beanery',
    action: 'Enquire about the lounge',
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
    name: 'The Meeting Table',
    copy: 'A considered café setting for team conversations, client meetings and working sessions over good coffee.',
    image: 'exp-2',
    alt: 'A meeting table in a café setting',
    action: 'Plan a meeting',
    kind: 'enquire',
    href: 'tel:+919860934080',
  },
];

export default function CafeModules({ goFood, detailed = false, variant = 'standard' }) {
  return (
    <div className={`cafe-module-grid${detailed ? ' cafe-module-grid--detailed' : ''}${variant === 'home' ? ' cafe-module-grid--home' : ''}`}>
      {modules.map((module, index) => (
        <article className={`cafe-module${variant === 'home' ? ' cafe-module--home' : ''}`} key={module.name} data-reveal={index * 50}>
          <div className="cafe-module__image">
            <ImageSlot id={module.image} alt={module.alt} priority={detailed && index === 0} />
            {variant === 'home' ? <span className="cafe-module__index">0{index + 1}</span> : null}
          </div>
          <div className="cafe-module__copy">
            <span className="hospitality-label">{module.label}</span>
            <h3>{module.name}</h3>
            <p>{module.copy}</p>
            {module.kind === 'menu' ? (
              <button type="button" onClick={goFood}>{module.action}<span aria-hidden="true">→</span></button>
            ) : (
              <a href={module.href}>{module.action}<span aria-hidden="true">→</span></a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
