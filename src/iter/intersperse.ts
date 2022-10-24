export function* intersperse<T, U>(
  t: Iterator<T>,
  u: U
): Generator<T | U, void, unknown> {
  while (true) {
    const next = t.next();
    if (next.done) return;
    yield next.value;
    yield u;
  }
}
