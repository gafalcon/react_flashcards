export function getRandomInt(max: number, current: number | null) {
  let n = Math.floor(Math.random() * max);
  while (n == current && max > 3) {
    n = Math.floor(Math.random() * max);
  }
  return n;
}
