export function* filterFn<T>(
  it: Iterator<T>,
  predicate: (value: T) => unknown
): Generator<T, void, unknown> {
  while (true) {
    const next = it.next();
    if (next.done) return;
    const v = predicate(next.value);
    if (v) {
      yield next.value;
    }
  }
}
