import {range} from "./range.js";
import {zip} from "./zip.js";

export function enumerate<T>(
  it: Iterator<T>
): Generator<[number, T], void, void> {
  return zip(range(0, Infinity), it);
}
