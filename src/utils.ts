export const clamp = (value: number, min: number, max: number) => (
  Math.max(min, Math.min(value, max)));

export const classList = (...classes: (string | number | boolean | null | undefined)[]) => classes
  .filter(Boolean).join(' ');

export const mapToRange = (
  value: number, inLow: number, inHigh: number, outLow: number, outHigh: number,
) => {
  const fromRange = inHigh - inLow;
  const toRange = outHigh - outLow;
  const scale = (value - inLow) / fromRange;
  return (toRange * scale) + outLow;
};
