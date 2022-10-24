export function* zip<T, U>(
  a: Iterator<T>,
  b: Iterator<U>
): Generator<[T, U], void, unknown> {
  while (true) {
    let x = a.next();
    if (x.done) return;
    let y = b.next();
    if (y.done) return;
    yield [x.value, y.value];
  }
}
