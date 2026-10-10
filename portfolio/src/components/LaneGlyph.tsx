import { laneColor } from '../content/graph';

export function LaneGlyph({ laneId, label }: { laneId: string; label: string }) {
  const color = laneColor(laneId);
  return (
    <span className="lane-glyph data-line" aria-label={`Branch: ${label}`}>
      <svg width="28" height="12" aria-hidden="true">
        <line x1="0" y1="6" x2="28" y2="6" stroke={color} strokeWidth="1.5" />
        <circle cx="20" cy="6" r="3" fill={color} />
      </svg>
      <span>{label}</span>
    </span>
  );
}