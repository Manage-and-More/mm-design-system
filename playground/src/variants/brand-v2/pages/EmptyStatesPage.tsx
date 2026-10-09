import { Specimen } from '@/core/docs/Specimen';
import { Button, EmptyState } from '../components';

export default function EmptyStatesPage() {
  return (
    <Specimen title="Empty states" description="A library figure at 200px above a heading and one action. The rest pose is the picture; the pointer is a bonus.">
      <div className="v2-grid v2-grid--3">
        <EmptyState figure="plot" title="No scores yet" text="Scores appear here as judges submit them." action={<Button variant="quiet" small>Invite judges</Button>} />
        <EmptyState figure="query" title="No results" text="No team matches that name. Try the team number." action={<Button variant="quiet" small>Clear search</Button>} />
        <EmptyState figure="drawer" title="No submissions" text="Teams have not submitted anything for this track." action={<Button variant="quiet" small>Remind teams</Button>} />
      </div>
    </Specimen>
  );
}
