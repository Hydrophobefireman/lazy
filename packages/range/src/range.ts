import {$Iterator, _range} from "@hydrophobefireman/lazy";

export function range(from: number, to?: number): $Iterator<number> {
  return new $Iterator(_range(from, to));
}
