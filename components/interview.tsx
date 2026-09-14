'use client';
import { useState } from 'react';
import { interview } from '@/lib/content';
import { Arrow, Photo } from './ui';
export function Interview() {
  const [selected, setSelected] = useState(0);
  return (
    <section className="interview-section">
      <div className="wrap interview-grid">
        <div>
          <h2>
            You probably
            <br />
            have questions.
          </h2>
          <p>My interview technique is excellent eye contact.</p>
          <div className="question-list" aria-label="Interview questions">
            {interview.map((q, i) => (
              <button key={q.question} aria-pressed={i === selected} onClick={() => setSelected(i)}>
                {q.question}
                <Arrow />
              </button>
            ))}
          </div>
        </div>
        <div className="answer-panel">
          <Photo name="resume-portrait" />
          <div className="answer-copy" aria-live="polite" aria-atomic="true">
            <span>Miso, on the record</span>
            <blockquote>“{interview[selected].answer}”</blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
