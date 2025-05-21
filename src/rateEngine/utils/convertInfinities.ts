export function convertInfinity(num: number | 'Infinity'): number {
  return num === 'Infinity' ? Infinity : num;
}

export default function convertInfinities(arr: Array<number | 'Infinity'>): Array<number> {
  return arr.map(convertInfinity);
}
