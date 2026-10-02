import ImageSlot from './ImageSlot';
import { DEFAULT_CONTENT } from '../../shared/content-defaults';
import venueInterior from '../assets/images/beanery-interior-real-v1.webp';
import './StoryPage.css';

const journey = [
  ['The beginning', 'Behind the coffee bar', 'A barista at Barista Café. The starting point of a life in cafés.'],
  ['Growing into leadership', 'Beyond the counter', 'From café manager to area manager, with a wider view of hospitality.'],
  ['A step into ownership', 'A café of his own', 'Owning a Cafe Peter franchise brought a new chapter in the journey.'],
  ['The next chapter', 'Beanery Cafe & Eatery', 'Bringing that experience together under a name of his own.'],
];

export default function StoryPage({ copy, flower, openReserve, goCoffee, goFood, goVisit }) {
  // Older CMS installations retain the original seed copy. Refresh only that
  // untouched seed, so an owner's custom story heading remains editable.
  const isOriginalCopy = copy.titleLine1 === 'Made from coffee.' &&
    copy.titleLine2 === 'Shaped by the room.' && !copy.intro &&
    copy.eyebrowLeft === 'Our story' && copy.eyebrowRight === 'Established 2025 · Pune';
  const storyCopy = isOriginalCopy ? DEFAULT_CONTENT.pages.story : copy;
  return (
    <main className="beanery-story">
      <header className="story-hero" data-flower-section="">
        {flower}
        <div className="story-eyebrow"><span>{storyCopy.eyebrowLeft}</span><span>{storyCopy.eyebrowRight}</span></div>
        <h1 data-reveal="0">{storyCopy.titleLine1}<br /><em>{storyCopy.titleLine2}</em></h1>
        <div className="story-introduction" data-reveal="80">
          <span className="story-label">Coffee was only the beginning.</span>
          <p>{storyCopy.intro}</p>
        </div>
        <figure className="story-opening-image" data-reveal="120">
          <div className="story-wide-photo"><ImageSlot id="story-hero" priority alt="A warm, light-filled café dining room" /></div>
          <figcaption><span>A place to settle in. A reason to stay.</span><span>Beanery · Pune</span></figcaption>
        </figure>
      </header>

      <section className="story-founder story-section" aria-labelledby="story-founder-title">
        <div className="story-section-label"><span>01 / The person behind the place</span><span>Meet our founder</span></div>
        <div className="story-founder-layout">
          <figure data-reveal="0">
            <div className="story-portrait"><ImageSlot id="founder-kamlesh" alt="Kamlesh Kale, founder of Beanery Cafe & Eatery" /></div>
            <figcaption className="story-founder-signature"><span>Kamlesh Kale</span><span>Founder, Beanery Cafe & Eatery</span></figcaption>
            <a className="story-linkedin-button" href="https://www.linkedin.com/in/kamlesh-kale-50b207424/" target="_blank" rel="noopener noreferrer">
              <span className="story-linkedin-mark" aria-hidden="true">in</span>
              <span>Meet Kamlesh on LinkedIn</span>
              <span className="story-linkedin-arrow" aria-hidden="true">↗</span>
            </a>
          </figure>
          <div className="story-founder-copy" data-reveal="100">
            <p className="story-label">A life in cafés</p>
            <h2 id="story-founder-title">Before Beanery,<br />there was <em>a barista.</em></h2>
            <p className="story-standfirst">Every café has a story. Ours begins on the other side of the counter.</p>
            <p>Kamlesh Kale began his journey as a barista at Barista Café. Before he became a founder, his work started with the cup in front of him: making coffee and serving the people who came through the door.</p>
            <p>That beginning grew into a career. He moved from barista to café manager, and then to area manager. With each step, his world expanded from the coffee bar to the running of a café, and from one café to a wider operation.</p>
            <p>Then came a new kind of responsibility: ownership. Kamlesh went on to own a Cafe Peter franchise, taking the next step from managing cafés to running a business of his own.</p>
            <p>Beanery Cafe & Eatery is the next chapter in that journey. It brings together the perspectives of someone who has been behind the counter, managed the floor, and taken on the responsibility of ownership. A place built around coffee, food, and the people who make a café feel alive.</p>
          </div>
        </div>
        <ol className="story-journey" aria-label="Kamlesh Kale’s journey">
          {journey.map(([label, title, description], index) => (
            <li key={title}><span className="story-journey-number">0{index + 1}</span><p className="story-label">{label}</p><h3>{title}</h3><p>{description}</p></li>
          ))}
        </ol>
      </section>

      <div className="story-interlude" data-reveal="0">
        <p className="story-label">The idea at the heart of Beanery</p>
        <p className="story-interlude-line">Come for a coffee.<br /><em>Find your own reason to stay.</em></p>
        <span className="story-interlude-rule" aria-hidden="true" />
      </div>

      <section className="story-place story-section" aria-labelledby="story-place-title">
        <div className="story-section-label"><span>02 / A place of our own</span><span>Rooted in Pune</span></div>
        <div className="story-place-layout">
          <div className="story-place-copy" data-reveal="0">
            <p className="story-label">Senapati Bapat Road</p>
            <h2 id="story-place-title">A little pause.<br /><em>A whole day of possibilities.</em></h2>
            <p>The story that started behind a coffee bar now has a home on Senapati Bapat Road. Here, coffee shares the table with food, and a quick stop can turn into a longer conversation.</p>
            <p>Beanery is our invitation to make a little room in your day. Meet a friend over breakfast. Sit down to a proper lunch. Order something sweet with a second cup. Or simply take a seat and let the afternoon unfold.</p>
            <p>Warm light, familiar company, something good on the table. These are the everyday moments we want Beanery to be part of.</p>
            <a className="story-text-link" href="#/visit" onClick={goVisit}>Find your way to Beanery <span aria-hidden="true">↗</span></a>
          </div>
          <figure data-reveal="100"><div className="story-room-photo"><img src={venueInterior} alt="Inside Beanery: flower-shaped lamps, cane chairs, brick walls and warm lighting" loading="lazy" decoding="async" /></div><figcaption>Our corner of Pune. Ready for your next visit.</figcaption></figure>
        </div>
      </section>

      <section className="story-everyday story-section" aria-labelledby="story-everyday-title">
        <div className="story-section-label"><span>03 / The story, every day</span><span>Coffee · Kitchen · Company</span></div>
        <div className="story-everyday-heading" data-reveal="0"><h2 id="story-everyday-title">The little things<br /><em>make it Beanery.</em></h2><p>A founder’s journey gives a café its beginning. What happens around its tables gives it a life of its own.</p></div>
        <div className="story-details">
          <article><span className="story-label">01 / In the cup</span><h3>Where it all began.</h3><p>Coffee runs through our story, from Kamlesh’s first role as a barista to the cups we serve today. It is a good place to begin your visit, too.</p><a className="story-text-link" href="#/coffee" onClick={goCoffee}>Explore our coffee <span aria-hidden="true">↗</span></a></article>
          <article><span className="story-label">02 / At the table</span><h3>Something to linger over.</h3><p>There is room for more than a coffee break here. From breakfast to a meal shared with friends, the kitchen gives you another reason to settle in.</p><a className="story-text-link" href="#/food" onClick={goFood}>Explore the food <span aria-hidden="true">↗</span></a></article>
          <article><span className="story-label">03 / In good company</span><h3>A place that becomes yours.</h3><p>The catch-ups, the conversations, the table you return to. Your everyday moments are the part of Beanery’s story we look forward to most.</p><a className="story-text-link" href="https://www.linkedin.com/company/beanery-cafe-eatery/about/" target="_blank" rel="noopener noreferrer">Follow our journey <span aria-hidden="true">↗</span></a></article>
        </div>
      </section>

      <section className="story-invitation" aria-labelledby="story-invitation-title">
        <div className="story-invitation__headline">
          <p className="story-label">The next chapter is yours</p>
          <h2 id="story-invitation-title">Pull up <em>a chair.</em></h2>
        </div>
        <div className="story-invitation__actions">
          <p>You know a little of our story.<br />We’d love to be part of yours.</p>
          <div className="story-actions"><button type="button" className="hv2 cafe-green-button" onClick={openReserve} style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 500, color: "#FBF8F4", background: "#5E2B17", border: "none", padding: "13px 22px", cursor: "pointer", transition: "background .3s ease" }}>Reserve a table</button><a className="story-text-link" href="#/visit" onClick={goVisit}>Visit Beanery <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>
    </main>
  );
}
