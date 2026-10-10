import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Log } from '@/components/Log';
import { Navbar } from '@/components/Navbar';
import { Principles } from '@/components/Principles';
import { Behaviors, GraphSlot, Hairline, HeadSlot } from '@/components/Runtime';
import { Stack } from '@/components/Stack';
import { Work } from '@/components/Work';
import { World } from '@/components/World';
import { site } from '@/content/site';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  jobTitle: 'Founder & Full Stack Developer',
  address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
  sameAs: [site.github, site.linkedin, site.x].filter(Boolean),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <World />
      <Hairline />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="page-offset relative z-10 outline-none">
        <GraphSlot />
        <Hero />
        <Work />
        <Log />
        <Stack />
        <Principles />
        <Contact />
      </main>
      <Footer />
      <HeadSlot />
      <Behaviors />
    </>
  );
}