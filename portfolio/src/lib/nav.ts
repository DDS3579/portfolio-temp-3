import { ventures } from '../content/ventures';
import { layout, sceneL } from './layout';
import { sceneCentre } from './scenes/geometry';

const behavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

export const sceneIdFromHash = (hash: string): string | null => (hash.startsWith('#scene-') ? hash.slice(7) : null);

export function goToScene(id: string, instant = false) {
  const k = ventures.findIndex((v) => v.id === id);
  if (k < 0) return;
  const b: ScrollBehavior = instant ? 'auto' : behavior();
  if (layout.pinned) {
    window.scrollTo({ top: sceneCentre(k, layout.pinTop, sceneL()), behavior: b });
  } else {
    document.getElementById(`scene-${id}`)?.scrollIntoView({ behavior: b, block: 'center' });
  }
}

export function focusForm() {
  const form = document.getElementById('contact-form');
  const first = document.getElementById('contact-name');
  if (!form || !first) return;
  window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.25, behavior: behavior() });
  first.focus({ preventScroll: true });
}

/** One delegated handler for every in-page link (nav, hero CTAs, Graph commits, footer, skip link). */
export function handleAnchorClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a) return;
  if (a.dataset.action === 'form') {
    e.preventDefault();
    focusForm();
    return;
  }
  const hash = a.getAttribute('href') ?? '';
  if (hash.length < 2) return;
  const sceneId = sceneIdFromHash(hash);
  if (sceneId) {
    e.preventDefault();
    history.replaceState(null, '', hash);
    goToScene(sceneId);
    return;
  }
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  e.preventDefault();
  history.pushState(null, '', hash);
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: behavior() });
  if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
}