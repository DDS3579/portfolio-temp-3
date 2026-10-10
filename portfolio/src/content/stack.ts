import { ventures } from './ventures';
import { logEntries } from './log';

export type Discipline = 'frontend' | 'backend' | 'product';

export interface StackItem {
  name: string;
  category: Discipline;
  usedBy: string[]; // venture or log slugs. Empty unless the owner has stated it.
}

export const stackItems: StackItem[] = [
  { name: 'Next.js', category: 'frontend', usedBy: ['meroseo'] },
  { name: 'TypeScript', category: 'frontend', usedBy: [] },
  { name: 'Tailwind', category: 'frontend', usedBy: [] },

  { name: 'FastAPI', category: 'backend', usedBy: [] },
  { name: 'n8n', category: 'backend', usedBy: [] },
  { name: 'Ollama', category: 'backend', usedBy: [] },
  { name: 'LangGraph', category: 'backend', usedBy: [] },
  { name: 'Mastra', category: 'backend', usedBy: [] },
  { name: 'Claude API', category: 'backend', usedBy: [] },
  { name: 'ESP32 / IoT', category: 'backend', usedBy: ['krishisaathi'] },

  { name: 'Animation and interaction design', category: 'product', usedBy: [] },
  { name: 'Architecture and scaling', category: 'product', usedBy: [] },
  { name: 'MVP development', category: 'product', usedBy: [] },
  { name: 'Building from zero to launch', category: 'product', usedBy: [] },
];

export const disciplines: { id: Discipline; name: string }[] = [
  { id: 'frontend', name: 'Frontend Engineering' },
  { id: 'backend', name: 'Backend and Agentic Systems' },
  { id: 'product', name: 'Product and Business' },
];

export const usedByName = (slug: string) =>
  ventures.find((v) => v.id === slug)?.name ?? logEntries.find((e) => e.id === slug)?.title ?? slug;

/** Log entries live on main, so they light the main lane. */
export const usedByLane = (slug: string) => (ventures.some((v) => v.id === slug) ? slug : 'main');

export const stackFor = (ventureId: string) =>
  stackItems.filter((s) => s.usedBy.includes(ventureId)).map((s) => s.name);