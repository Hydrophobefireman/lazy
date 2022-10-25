import {isCustomIterator} from "../util.js";

type $Iterator<T> = import("../iterator").$Iterator<T>;

export function* flatten<T>(
  it: Iterator<T | $Iterator<T>>
): Generator<T, void, unknown> {
  while (true) {
    const next = it.next();
    if (next.done) return;
    const item = next.value;
    if (isCustomIterator(item)) {
      let i = item as $Iterator<T>;
      while (true) {
        let n = i.next();
        if (n.done) break;
        yield n.value;
      }
    } else {
      yield item;
    }
  }
}
