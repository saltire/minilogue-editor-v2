export const clamp = (value: number, min: number, max: number) => (
  Math.max(min, Math.min(value, max)));

export const classList = (...classes: (string | number | boolean | null | undefined)[]) => classes
  .filter(Boolean).join(' ');

export const delay = (timeout: number) => new Promise<void>(resolve => {
  setTimeout(resolve, timeout);
});

export const mapToRange = (
  value: number, inLow: number, inHigh: number, outLow: number, outHigh: number,
) => {
  const fromRange = inHigh - inLow;
  const toRange = outHigh - outLow;
  const scale = (value - inLow) / fromRange;
  return (toRange * scale) + outLow;
};

export const range = (length: number) => [...Array(length).keys()];

export const series = <T>(array: T[], func: (item: T, index: number) => Promise<void>) =>
  array.reduce(
    (lastPromise, item, index) => lastPromise.then(() => func(item, index)),
    Promise.resolve());

export const toHex = (data: number[] | Uint8Array) => Array.from(data).map(val => val.toString(16));

export const toNote = (code: number) => [
  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][code % 12],
  Math.floor(code / 12) - 1,
].join('');
