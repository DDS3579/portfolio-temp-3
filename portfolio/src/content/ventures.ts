import { lanes } from './graph';

export type Group = 'digira' | 'nss' | 'lab';

export interface Venture {
  id: string;
  name: string;
  group: Group;
  category: string;
  role: string | null;
  context: string | null;
  challenge: string | null; // [FILL]
  outcome: string | null; // [FILL]
  tone: number; // lightness step inside the group hue (about +/-0.04)
  links: { label: string; url: string }[];
}

export const ventures: Venture[] = [
  {
    id: 'digira', name: 'Digira', group: 'digira', category: 'Umbrella', role: 'Founder', context: null,
    challenge: 'Running several ventures at once means splitting my time between all of them.',
    outcome: 'Three branches now sit under one umbrella.', // drafted from your facts: edit if you disagree
    tone: 0, links: [],
  },
  {
    id: 'agency', name: 'Digiragency', group: 'digira', category: 'Digital agency', role: 'Backend, AI agents, finance',
    context: 'A digital agency. My role: backend, AI agents and finance.', challenge: null, outcome: null, tone: 0.04, links: [],
  },
  {
    id: 'esports', name: 'Digira Esports', group: 'digira', category: 'Esports tournaments', role: 'Event director',
    context: 'Mobile Legends: Bang Bang tournaments in Nepal. I plan the events, set the dates, direct the managers who run them, work with sponsors, and handle the main business and finance.',
    challenge: null, outcome: null, tone: -0.04, links: [],
  },
  {
    id: 'education', name: 'Digira Education', group: 'digira', category: 'Education', role: null,
    context: 'Building products and solutions that help students learn effectively from scratch, starting with topics rarely taught in Nepal, like robotics. So far: a website for Olympiad enthusiasts, with curriculums and micro-SaaS learning products in progress.',
    challenge: null, outcome: null, tone: 0.02, links: [],
  },
  {
    id: 'nss', name: 'NSS Clubs', group: 'nss', category: 'Student organization', role: 'President',
    context: '56+ members. Events and Tech Fest.', challenge: null, outcome: null, tone: 0, links: [],
  },
  {
    id: 'krishisaathi', name: 'KrishiSaathi', group: 'lab', category: 'Agricultural advisory', role: null,
    context: 'Nepali-language agricultural advisory with ESP32 IoT sensors. A science exhibition project.',
    challenge: null, outcome: null, tone: 0, links: [],
  },
  {
    id: 'neurosync', name: 'NeuroSync', group: 'lab', category: 'Neuroplasticity and habit tracker', role: null,
    context: 'A neuroplasticity and habit tracker with a 3D dotted brain visualization. A science exhibition project.',
    challenge: null, outcome: null, tone: 0.04, links: [],
  },
  {
    id: 'mirror', name: 'Cognitive Mirror', group: 'lab', category: 'Personal AI twin', role: null,
    context: 'A personal AI twin with a cognitive-fidelity research layer. A science exhibition project.',
    challenge: null, outcome: null, tone: -0.04, links: [],
  },
];

const parentOf = (id: string) => lanes.find((l) => l.id === id)?.parent ?? null;

/** Branch name for the mono data line, from the single lane table. */
export const branchOf = (id: string) => `${parentOf(id) ?? 'main'}/${id}`;

/** Derived, never typed by hand. */
export const digiraBranchCount = lanes.filter((l) => l.parent === 'digira').length;

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];

export function digiraSummary(): string {
  const names = ventures.filter((v) => parentOf(v.id) === 'digira').map((v) => v.name);
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names.join('');
  return `${WORDS[names.length] ?? names.length} branches: ${list}.`;
}

export const contextOf = (v: Venture): string | null => (v.id === 'digira' ? digiraSummary() : v.context);