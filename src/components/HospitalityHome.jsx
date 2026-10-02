import CafeModules from './CafeModules';
import './HospitalityHome.css';

export default function HospitalityHome({ goFood }) {
  return (
    <section className="hospitality-home" id="home-more-than" aria-labelledby="home-modules-title">
      <div className="hospitality-home__rule">
        <span>Beanery · Pune</span>
        <span>Coffee · Kitchen · Gatherings</span>
      </div>
      <div className="hospitality-home__intro" data-reveal="0">
        <h2 id="home-modules-title">One café.<br /><em>Many ways to gather.</em></h2>
        <p>Come for coffee, stay for lunch, bring the team together, or make an evening of it on the rooftop. Find your Beanery.</p>
      </div>
      <CafeModules goFood={goFood} variant="home" />
    </section>
  );
}
