export const clamp = (value: number, min: number, max: number) => (
  Math.max(min, Math.min(value, max)));

export const classList = (...classes: (string | number | boolean | null | undefined)[]) => classes
  .filter(Boolean).join(' ');
