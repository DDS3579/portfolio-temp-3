export interface LogEntry {
  id: string;
  title: string;
  role: string;
  duration: string | null; // [FILL]
  description: string | null; // [FILL]
}

export const originStory: string | null = null; // [FILL] opens the Log section when set

export const logEntries: LogEntry[] = [
  { id: 'cozmos', title: 'Cozmos & Co.', role: 'Design internship', duration: null, description: null },
  { id: 'meroseo', title: 'MeroSEO', role: 'Next.js development internship', duration: null, description: 'Next.js development.' },
  // Dummy until you send the real ones. It says so on the page on purpose.
  { id: 'early', title: 'Early projects', role: 'Placeholder', duration: null, description: 'Placeholder entry. Real projects will be added here.' },
];

export const principles = [
  { number: '01', title: 'Clarity over complexity', description: 'Every system should be understandable at a glance. If it needs a manual, it needs redesign.' },
  { number: '02', title: 'Design with intent', description: 'Each decision serves the product. Decoration without purpose is noise.' },
  { number: '03', title: 'Engineer for scale', description: 'Architecture that holds up as it grows. What works for one user has to keep working for many.' },
];

export const SHOW_TESTIMONIALS = false;