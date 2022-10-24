export function* stepBy<T>(
  it: Iterator<T>,
  by: number
): Generator<T, void, unknown> {
  by--;
  while (true) {
    const next = it.next();
    if (next.done) return;
    let steps = by;
    while (steps--) {
      it.next();
    }
  }
}
