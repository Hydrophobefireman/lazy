export function skip<T>(it: Iterator<T>, n: number) {
  while (n--) {
    it.next();
  }
  return it;
}
