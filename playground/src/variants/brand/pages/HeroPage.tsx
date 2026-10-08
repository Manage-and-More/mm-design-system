import cohort from '@ds/assets/photography/website/cohort-group.webp';
import graduation from '@ds/assets/photography/website/graduation.webp';
import { Specimen } from '@/core/docs/Specimen';
import { ArrowLink, Hero, TwoTone } from '../components';

export default function HeroPage() {
  return (
    <>
      <Specimen title="Home hero" description="Full-bleed photo, 40% black shade, two-tone h1, endorsement label in the corner." bleed>
        <Hero home image={cohort}>
          <TwoTone as="h1" setup="ENABLING ENTREPRENEURIAL LEADERS OF TOMORROW" payoff="People who build and scale companies." />
        </Hero>
      </Specimen>
      <Specimen title="Page hero" description="With meta line and arrow link." bleed>
        <Hero image={graduation} meta="Graduation · Batch 34 · July 2026">
          <h1>Alumni Network</h1>
          <ArrowLink>Meet the alumni</ArrowLink>
        </Hero>
      </Specimen>
    </>
  );
}
