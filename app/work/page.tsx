import { WorkGrid, HireInvite } from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'My work — Miso',
  'Three fictional case studies. Rigorous methods. Extremely comfortable outcomes.',
  '/work/',
  'laptop-warming',
);
export default function WorkPage() {
  return (
    <>
      <div className="wrap work-index">
        <div className="page-intro">
          <h1>
            A body of work.
            <br />
            <em>Usually my whole body.</em>
          </h1>
          <p>
            Three projects. One highly consistent methodology: find the important thing and sit on
            it.
          </p>
        </div>
        <WorkGrid />
        <p className="fine-note">
          Fictional projects from my home studio. No real client businesses were inconvenienced.
        </p>
      </div>
      <HireInvite />
    </>
  );
}
