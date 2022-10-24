function* gen<T>(c: Iterator<T>): Generator<T, void, unknown> {
  while (true) {
    let r = c.next();
    if (r.done) {
      return;
    }
    yield r.value;
  }
}
export function arrayCollector<T>(c: Iterator<T>): T[] {
  return Array.from(gen(c));
}
