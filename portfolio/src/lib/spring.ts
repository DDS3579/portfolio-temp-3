export interface Spring {
  value: number;
  velocity: number;
}

export const createSpring = (value = 0): Spring => ({ value, velocity: 0 });

/** Advances the spring by dt seconds. Returns true while it is still moving. */
export function stepSpring(s: Spring, target: number, dt: number, stiffness = 120, damping = 30): boolean {
  const h = Math.min(dt, 1 / 30);
  s.velocity += (-stiffness * (s.value - target) - damping * s.velocity) * h;
  s.value += s.velocity * h;
  if (Math.abs(s.value - target) < 0.05 && Math.abs(s.velocity) < 0.05) {
    s.value = target;
    s.velocity = 0;
    return false;
  }
  return true;
}