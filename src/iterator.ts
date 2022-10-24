import {ARRAY_COLLECTOR} from "./_collectors/index.js";
import {range} from "./_range/index.js";
import {chain} from "./iter/chain.js";
import {enumerate} from "./iter/enumerate.js";
import {filterFn} from "./iter/filter.js";
import {intersperse} from "./iter/intersperse.js";
import {mapper} from "./iter/map.js";
import {skip} from "./iter/skip.js";
import {stepBy} from "./iter/step-by.js";
import {zip} from "./iter/zip.js";

type IterableCompatible<T> = Iterator<T> | $Iterator<T>;
class $Iterator<T> {
  private __$Iterator = true;
  constructor(private it: Iterator<T> | $Iterator<T>) {}
  public static maybe<U>(it: IterableCompatible<U>): $Iterator<U> {
    if ((it as $Iterator<U>).__$Iterator) {
      return it as $Iterator<U>;
    }
    return new $Iterator(it);
  }
  public map<U>(callbackfn: (value: T) => U): $Iterator<U> {
    const it = this.it;
    return new $Iterator(mapper(it, callbackfn));
  }
  public filter(predicate: (value: T) => unknown): $Iterator<T> {
    return new $Iterator(filterFn(this.it, predicate));
  }
  public skip(n: number): $Iterator<T> {
    return new $Iterator(skip(this.it, n));
  }
  public next(): IteratorResult<T> {
    return this.it.next();
  }
  public collect<R>(collector: (c: Iterator<T>) => R): R {
    return collector(this.it);
  }
  public nextChunk(n: number): T[] {
    return this.zip(new $Iterator(range(n)))
      .map((value) => value[0])
      .collect(ARRAY_COLLECTOR);
  }
  public advanceBy(n: number): void {
    while (n--) {
      this.next();
    }
  }
  public zip<U>(it: IterableCompatible<U>): $Iterator<[T, U]> {
    return new $Iterator(zip(this.it, $Iterator.maybe(it)));
  }
  public count(): number {
    return this.fold(0, (c) => c + 1);
  }
  public fold<U>(init: U, f: (acc: U, _: T) => U): U {
    let accum = init;
    while (true) {
      const n = this.next();
      if (n.done) break;
      const val = n.value;
      accum = f(accum, val);
    }
    return accum;
  }
  public last(): T {
    return this.fold(null as T, (_, x) => x)!;
  }

  public nth(n: number): IteratorResult<T, any> {
    this.advanceBy(n);
    return this.next();
  }
  public stepBy(n: number) {
    return new $Iterator(stepBy(this.it, n));
  }

  public chain<U>(other: IterableCompatible<U>) {
    let o = $Iterator.maybe(other);
    return chain(this.it, o.it);
  }
  public intersperse<U>(item: U) {
    intersperse(this.it, item);
  }
  public forEach(f: (x: T) => void) {
    this.fold(undefined as void, (_, item) => {
      f(item);
    });
  }
  public enumerate(number: string): $Iterator<[number, T]> {
    return enumerate(this.it, number);
  }
}

export function arrayIter<T>(arr: T[]): $Iterator<T> {
  return new $Iterator(arr.values());
}

export {$Iterator};
