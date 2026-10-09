import { Specimen } from '@/core/docs/Specimen';
import { Button, Hero } from '../components';

export default function HeroPage() {
  return (
    <Specimen title="Hero" bleed description="12-column split: two-line display, lead and actions on the left; the figure on the right as a product plate (heavy product shadow), playing its tour until the pointer arrives. BY UNTERNEHMERTUM outline label in the corner. No photo, no shade.">
      <Hero setup="Build in 48 hours." payoff="Run it in one." figure="bench" lead="One platform for teams, judges and organisers." actions={<><Button href="#">Start an event</Button><Button variant="action" href="#">Watch the tour</Button></>} />
    </Specimen>
  );
}
