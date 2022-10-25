export function* skipWhile<T>(
  it: Iterator<T>,
  predicate: (value: T) => unknown
): Generator<T, void, unknown> {
  let skipping = true;
  while (true) {
    const next = it.next();
    if (next.done) return;
    if (skipping) {
      const v = predicate(next.value);
      if (v) {
        continue;
      }
      skipping = false;
    }
    yield next.value;
  }
}
