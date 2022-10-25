export function* skipWhile<T>(
  it: Iterator<T>,
  predicate: (value: T) => unknown
): Generator<T, void, unknown> {
  let taking = true;
  while (true) {
    const next = it.next();
    if (next.done) return;
    if (taking) {
      const v = predicate(next.value);
      if (v) {
        yield next.value;
      } else {
        return;
      }
    }
  }
}
