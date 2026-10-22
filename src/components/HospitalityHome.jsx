import CafeModules from './CafeModules';
import './HospitalityHome.css';

export default function HospitalityHome({ goFood, goCoffee, goExperiences }) {
  return (
    <section className="hospitality-home" id="home-more-than" aria-labelledby="home-modules-title">
      <div className="hospitality-home__rule">
        <span>Beanery · Pune</span>
        <span>Coffee Specialty · Bake House · European Food</span>
      </div>
      <div className="hospitality-home__intro" data-reveal="0">
        <h2 id="home-modules-title">Four Beanery<br /><em>signatures.</em></h2>
        <p>Explore our coffee specialty, bake house, European food, and the good ambience and facilities that make Beanery a place to stay awhile.</p>
      </div>
      <CafeModules goFood={goFood} goCoffee={goCoffee} goExperiences={goExperiences} variant="home" />
    </section>
  );
}
