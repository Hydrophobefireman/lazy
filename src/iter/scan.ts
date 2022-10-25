export function* scan<ST, T>(
  it: Iterator<T>,
  state: ST,
  f: (st: ST, item: T) => ST
): Generator<ST, void, unknown> {
  while (true) {
    const next = it.next();
    if (next.done) return;
    state = f(state, next.value);
    yield state;
  }
}
