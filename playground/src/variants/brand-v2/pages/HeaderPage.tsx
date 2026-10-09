import { Specimen } from '@/core/docs/Specimen';
import { Header } from '../components';

export default function HeaderPage() {
  return (
    <Specimen title="Header" bleed description="Sticky, 56px, a translucent material (blur 20px, saturate 180%, 72% surface) over the content; a hairline appears once scrolled. Logo at 28px, nav 15px, one CTA. Below 768px a menu toggle opens a full-screen list.">
      <Header inline />
    </Specimen>
  );
}
