export default function convertInfinities(arr: Array<number | 'Infinity'>): number[] {
  return arr.map((n) => n === 'Infinity' ? Infinity : n);
};
