function* gen(from: number, to: number) {
  for (let i = from; i < to; i++) {
    yield i;
  }
}
function _range(from: number, to: number) {
  return gen(from, to);
}

export function range(
  from: number,
  to?: number
): Generator<number, void, unknown> {
  if (arguments.length === 2) {
    return _range(from, to!);
  }
  return _range(0, from);
}
