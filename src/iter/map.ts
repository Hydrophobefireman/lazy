export function* mapper<T, U>(
  it: Iterator<T>,
  map: (value: T) => U
): Generator<U, void, unknown> {
  while (true) {
    const next = it.next();
    if (next.done) return;
    yield map(next.value);
  }
}
