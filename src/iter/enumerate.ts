import {mapper} from "./map.js";

function* gen(from: number, to: number) {
  for (let i = from; i < to; i++) {
    yield i;
  }
}

export function* enumerate<T>(
  it: Iterator<T>
): Generator<[number, T], void, void> {
  let i = 0;
  while (true) {
    let n = it.next();
    if (n.done) {
      return;
    }
    yield [i++, n.value];
  }
}
