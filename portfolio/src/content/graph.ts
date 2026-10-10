export interface Lane {
  id: string;
  parent: string | null;
  group: 'digira' | 'nss' | 'lab' | null;
  scene: string;
  label: string;
}

export const lanes: Lane[] = [
  { id: 'main', parent: null, group: null, scene: 'hero', label: 'main' },
  { id: 'digira', parent: 'main', group: 'digira', scene: 'digira', label: 'digira' },
  { id: 'agency', parent: 'digira', group: 'digira', scene: 'agency', label: 'agency' },
  { id: 'esports', parent: 'digira', group: 'digira', scene: 'esports', label: 'esports' },
  { id: 'education', parent: 'digira', group: 'digira', scene: 'education', label: 'education' },
  { id: 'nss', parent: 'main', group: 'nss', scene: 'nss', label: 'nss' },
  { id: 'krishisaathi', parent: 'main', group: 'lab', scene: 'krishisaathi', label: 'krishisaathi' },
  { id: 'neurosync', parent: 'main', group: 'lab', scene: 'neurosync', label: 'neurosync' },
  { id: 'mirror', parent: 'main', group: 'lab', scene: 'mirror', label: 'mirror' },
];

export const laneIndex = (id: string): number => lanes.findIndex(l => l.id === id);

export const laneColor = (id: string): string => {
  const lane = lanes.find(l => l.id === id);
  if (!lane?.group) return 'var(--color-text)';
  switch (lane.group) {
    case 'digira': return 'var(--color-hue-digira)';
    case 'nss': return 'var(--color-hue-nss)';
    case 'lab': return 'var(--color-hue-lab)';
  }
};
