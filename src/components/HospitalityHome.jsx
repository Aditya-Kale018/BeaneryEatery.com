import ImageSlot from './ImageSlot';
import './HospitalityHome.css';

const spaces = [
  ['COMMON AREA 01', '50', 'GUESTS'],
  ['COMMON AREA 02', '50', 'GUESTS'],
  ['CORPORATE', '7', 'GUESTS'],
  ['ROOFTOP', '25', 'GUESTS'],
  ['PRIVATE LOUNGE', '15', 'GUESTS'],
];

export default function HospitalityHome({ openReserve, goFood, goExp, goVisit }) {
  const anchor = (event, handler) => { if (handler) handler(event); };

  return (
    <div className="hospitality-home">
      <section className="hospitality-more" id="home-more-than" aria-labelledby="more-than-title">
        <div className="hospitality-rule"><span>More than a café</span><span>Coffee · Craft · Food · Gatherings</span></div>
        <div className="hospitality-intro" data-reveal="0">
          <h2 id="more-than-title">More than<br /><em>a café.</em></h2>
          <p><strong>Coffee, craft, food &amp; gatherings — all under one roof.</strong><br />Come for one thing. Stay for another. Beanery is made for the full rhythm of the day.</p>
        </div>
        <div className="hospitality-editorial-grid">
          <article className="hospitality-feature hospitality-feature--bakery" data-reveal="40">
            <div className="hospitality-photo hospitality-photo--portrait"><ImageSlot id="bakery-1" alt="Freshly baked pastries and artisan bread at Beanery" /></div>
            <div className="hospitality-feature-copy"><span className="hospitality-label">Artisan bakery &amp; patisserie</span><h3>Freshly crafted in-house.</h3><p>From delicate pastries to freshly baked favourites, our in-house bakery brings a little more craft to every visit.</p><a href="#/food" onClick={(e) => anchor(e, goFood)}>Explore the bakery <span>→</span></a></div>
          </article>
          <article className="hospitality-feature hospitality-feature--pizza" data-reveal="100">
            <div className="hospitality-photo hospitality-photo--landscape"><ImageSlot id="food-hero-1" alt="Wood-fired pizza and food prepared at Beanery" /></div>
            <div className="hospitality-feature-copy"><span className="hospitality-label">Woodfire Neapolitan pizza</span><h3>Born in fire. Inspired by Naples.</h3><p>Handcrafted dough, quality ingredients and the unmistakable character of a wood-fired oven.</p><a href="#/food" onClick={(e) => anchor(e, goFood)}>Discover the pizza <span>→</span></a></div>
          </article>
          <article className="hospitality-feature hospitality-feature--workshops" data-reveal="160">
            <div className="hospitality-photo hospitality-photo--square"><ImageSlot id="exp-4" alt="Hands shaping dough during a Beanery workshop" /></div>
            <div className="hospitality-feature-copy"><span className="hospitality-label">Workshops</span><h3>Learn something. Make something.</h3><p>From coffee workshops to intimate creative sessions, Beanery is a space to gather, learn and create.</p><a href="#home-events" onClick={(e) => anchor(e, goExp)}>View workshops <span>→</span></a></div>
          </article>
          <article className="hospitality-feature hospitality-feature--gatherings" data-reveal="220">
            <div className="hospitality-photo hospitality-photo--square"><ImageSlot id="exp-3" alt="A warm private gathering at Beanery" /></div>
            <div className="hospitality-feature-copy"><span className="hospitality-label">Gatherings</span><h3>Your table. Your people. Your occasion.</h3><p>From casual coffee catch-ups to private celebrations and corporate gatherings, our spaces adapt to the moment.</p><button type="button" onClick={openReserve}>Plan your gathering <span>→</span></button></div>
          </article>
        </div>
      </section>

      <section className="hospitality-spaces" id="home-spaces" aria-labelledby="spaces-title">
        <div className="hospitality-rule"><span>Spaces for every gathering</span><span>Find your room</span></div>
        <div className="hospitality-spaces-heading" data-reveal="0"><h2 id="spaces-title">A space for every<br /><em>kind of gathering.</em></h2><div><p>Coffee dates. Celebrations. Team meetings. Late-night conversations.</p><p>Beanery brings together thoughtfully designed spaces for intimate meetups, private events, corporate gatherings and celebrations.</p><button type="button" onClick={openReserve}>Plan your gathering <span>→</span></button></div></div>
        <div className="hospitality-space-list" data-reveal="100">
          {spaces.map(([name, number, unit]) => <div className="hospitality-space" key={name}><span className="hospitality-label">{name}</span><strong>{number}</strong><span>{unit}</span></div>)}
        </div>
      </section>

      <section className="hospitality-rooftop" id="home-rooftop" aria-labelledby="rooftop-title">
        <div className="hospitality-rooftop-photo"><ImageSlot id="exp-banner" alt="Beanery rooftop set for an evening gathering" /></div>
        <div className="hospitality-rooftop-copy" data-reveal="80"><span className="hospitality-label">Rooftop at Beanery</span><h2 id="rooftop-title">Good food.<br />Open skies.<br /><em>Better conversations.</em></h2><p>A relaxed rooftop setting designed for celebrations, parties and evenings worth staying out for.</p><div className="hospitality-rooftop-footer"><strong>25</strong><span>Up to 25 guests</span><button type="button" onClick={openReserve}>Host an event <span>→</span></button></div></div>
      </section>

      <section className="hospitality-events" id="home-events" aria-labelledby="events-title">
        <div className="hospitality-rule"><span>Events</span><span>Gather · Celebrate · Meet</span></div>
        <div className="hospitality-events-heading" data-reveal="0"><h2 id="events-title">Make it<br /><em>a moment.</em></h2><p>From slow weekend brunches to rooftop celebrations and focused corporate gatherings, Beanery gives every occasion its own space.</p></div>
        <div className="hospitality-event-list">
          <article data-reveal="40"><div className="hospitality-event-photo"><ImageSlot id="part-morning" alt="A warm Beanery brunch table" /></div><div className="hospitality-event-copy"><span className="hospitality-label">Brunch</span><h3>Slow mornings. Good food. Better company.</h3><p>Make your weekends a little more special with leisurely brunches, freshly crafted plates and plenty of time to stay awhile.</p><button type="button" onClick={openReserve}>Plan your brunch <span>→</span></button></div></article>
          <article data-reveal="100"><div className="hospitality-event-photo"><ImageSlot id="exp-3" alt="A rooftop birthday celebration at Beanery" /></div><div className="hospitality-event-copy"><span className="hospitality-label">Birthday parties</span><h3>Make your day. Take it to the rooftop.</h3><p>Celebrate above the city with great food, good music and your favourite people — with our rooftop space made for unforgettable birthday gatherings.</p><div className="hospitality-event-meta"><strong>25</strong><span>Up to 25 guests</span></div><button type="button" onClick={openReserve}>Plan your party <span>→</span></button></div></article>
          <article data-reveal="160"><div className="hospitality-event-photo"><ImageSlot id="exp-2" alt="A focused corporate meeting at Beanery" /></div><div className="hospitality-event-copy"><span className="hospitality-label">Corporate meetings</span><h3>Meet differently. Think better.</h3><p>A private setting with dedicated tables, a screen and everything you need for focused meetings, team discussions and presentations.</p><div className="hospitality-event-tags"><span>Private space</span><span>Screen</span><span>Tables</span></div><button type="button" onClick={openReserve}>Plan a meeting <span>→</span></button></div></article>
        </div>
      </section>

      <section className="hospitality-workshops" aria-labelledby="workshops-title">
        <div><span className="hospitality-label">Workshops &amp; community</span><h2 id="workshops-title">Come for coffee.<br /><em>Stay to learn.</em></h2><p>Beanery hosts intimate workshops and events designed around coffee, food, creativity and community.</p><a href="#home-events" onClick={(e) => anchor(e, goExp)}>See upcoming events <span>→</span></a></div>
        <div className="hospitality-workshop-list"><div><span>01</span><h3>Coffee workshops</h3><p>Learn the craft behind your cup.</p></div><div><span>02</span><h3>Food experiences</h3><p>Explore the techniques, ingredients and stories behind what we make.</p></div><div><span>03</span><h3>Community events</h3><p>Small gatherings built around good conversations and shared interests.</p></div></div>
      </section>

      <section className="hospitality-numbers" aria-label="Beanery in numbers"><div><strong>2</strong><span>Common areas</span></div><div><strong>50</strong><span>Guest capacity</span></div><div><strong>25</strong><span>Rooftop guests</span></div><div><strong>15</strong><span>Private lounge</span></div><div><strong>1</strong><span>In-house bakery</span></div></section>
      <div className="hospitality-contact-link"><a href="#/visit" onClick={(e) => anchor(e, goVisit)}>Visit Beanery on Senapati Bapat Road <span>↗</span></a></div>
    </div>
  );
}
