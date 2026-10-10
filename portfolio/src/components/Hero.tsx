import type { CSSProperties } from 'react';
import { site } from '../content/site';
import { digiraBranchCount } from '../content/ventures';

const d = (seconds: number) => ({ '--d': `${seconds}s` }) as CSSProperties;

export function Hero() {
  const proof = [
    `Digira: ${digiraBranchCount} branches`,
    `NSS Clubs: ${site.nssMembers} members`,
    'Kathmandu, Nepal',
    'Open to projects',
  ];

  return (
    <section id="hero" aria-labelledby="hero-title" className="hero">
      <p className="hero-label hero-fade" style={d(1.6)}>Founder &amp; Full Stack Developer</p>

      <h1 id="hero-title" className="display-hero">
        <span className="hero-line">
          <span className="hero-mask"><span className="hero-rise" style={d(0.3)}>I build businesses</span></span>
        </span>
        <span className="hero-line">
          <span className="hero-mask"><span className="hero-rise" style={d(0.42)}>from scratch to</span></span>
        </span>
        <span className="hero-line">
          <span className="hero-mask"><span className="hero-rise" style={d(0.54)}>conglomerates</span></span>
          <span id="hero-stop" className="hero-stop-box" aria-hidden="true"><span className="hero-stop" /></span>
          <span className="sr-only">.</span>
        </span>
      </h1>

      <p className="body-copy hero-fade mt-8" style={{ ...d(1.6), maxWidth: '44ch' }}>
        Crafting products, systems, and digital experiences from first idea to scalable reality.
      </p>

      <div className="hero-fade mt-10 flex flex-wrap gap-4" style={d(1.9)}>
        <a href="#work" className="btn-solid">View Work</a>
        <a href="#contact" data-action="form" className="btn-ghost">Start a Project</a>
      </div>

      <ul className="hero-proof hero-fade" style={d(1.9)}>
        {proof.map((p) => (
          <li key={p} className="data-line">{p}</li>
        ))}
      </ul>
    </section>
  );
}