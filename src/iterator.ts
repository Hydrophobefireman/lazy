import {ARRAY_COLLECTOR} from "./_collectors/index.js";
import {range} from "./_range/index.js";
import {chain} from "./iter/chain.js";
import {enumerate} from "./iter/enumerate.js";
import {filterFn} from "./iter/filter.js";
import {flatten} from "./iter/flatten.js";
import {intersperse} from "./iter/intersperse.js";
import {mapper} from "./iter/map.js";
import {scan} from "./iter/scan.js";
import {skipWhile} from "./iter/skip-while.js";
import {skip} from "./iter/skip.js";
import {stepBy} from "./iter/step-by.js";
import {takeWhile} from "./iter/take-while.js";
import {take} from "./iter/take.js";
import {zip} from "./iter/zip.js";

type IterableCompatible<T> = Iterator<T> | $Iterator<T>;
type PredicateFn<T> = (x: T) => boolean;
class $Iterator<T> implements Iterator<T> {
  public __$Iterator = true;
  private it: Iterator<T>;
  constructor(it: IterableCompatible<T>) {
    this.it = it instanceof $Iterator ? it.it : it;
  }
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
  public enumerate(): $Iterator<[number, T]> {
    return new $Iterator(enumerate(this.it));
  }
  public skipWhile(predicate: (value: T) => unknown): $Iterator<T> {
    return new $Iterator(skipWhile(this.it, predicate));
  }
  public takeWhile(predicate: (value: T) => unknown): $Iterator<T> {
    return new $Iterator(takeWhile(this.it, predicate));
  }

  public take(n: number): $Iterator<T> {
    return new $Iterator(take(this.it, n));
  }

  public scan<ST>(state: ST, f: (st: ST, item: T) => ST) {
    return new $Iterator(scan(this.it, state, f));
  }
  public flatten(): $Iterator<T> {
    return new $Iterator(flatten(this.it));
  }
  public flatMap<U>(callbackfn: (value: T) => U): $Iterator<U> {
    const it = this.it;
    return new $Iterator(mapper(it, callbackfn)).flatten();
  }
  public partition(f: PredicateFn<T>): [T[], T[]] {
    const left: T[] = [];
    const right: T[] = [];
    function extend(_: null, x: T) {
      if (f(x)) {
        left.push(x);
      } else {
        right.push(x);
      }
    }
    this.fold(null, extend);
    return [left, right];
  }
  public reduce(f: (acc: T, x: T) => T): T | null {
    let first = this.next();
    if (first.done) return null;
    return this.fold(first.value, f);
  }

  public all(f: PredicateFn<T>): boolean {
    return this.find((x) => !f(x)) === null;
    // while (true) {
    //   const {value, done} = this.next();
    //   if (done) return true;
    //   if (f(value)) {
    //     continue;
    //   } else {
    //     return false;
    //   }
    // }
  }
  public any(f: PredicateFn<T>): boolean {
    return this.find((x) => f(x)) !== null;
  }

  public find(f: PredicateFn<T>): T | null {
    while (true) {
      const {value, done} = this.next();
      if (done) return null;
      if (f(value)) {
        return value;
      }
    }
  }
  public position(f: PredicateFn<T>): number | undefined {
    return this.enumerate().find(([_, x]) => f(x))?.[0];
  }
  public max_by(compare: (a: T, b: T) => -1 | 0 | 1) {
    function fold(x: T, y: T) {
      const cmp = compare(x, y);
      if (cmp >= 0) return x;
      return y;
    }
    return this.reduce(fold)!;
  }
  public min_by(compare: (a: T, b: T) => -1 | 0 | 1) {
    function fold(x: T, y: T) {
      const cmp = compare(x, y);
      if (cmp <= 0) return x;
      return y;
    }
    return this.reduce(fold)!;
  }

  public max(): T {
    return this.max_by(
      (x, y) => Math.min(1, Math.max((x as number) - (y as number), -1)) as any
    );
  }
  public min(): T {
    return this.min_by(
      (x, y) => Math.min(1, Math.max((x as number) - (y as number), -1)) as any
    );
  }
  public unzip<$T extends $Iterator<[T, unknown]>>(this: $T): [T[], unknown[]] {
    const left: T[] = [];
    const right: unknown[] = [];
    this.forEach(([a, b]) => {
      left.push(a);
      right.push(b);
    });
    return [left, right];
  }
  public sum<$T extends $Iterator<number>>(this: $T): number {
    return this.reduce((acc, current) => acc + current)!;
  }
  public product<$T extends $Iterator<number>>(this: $T): number {
    return this.reduce((acc, current) => acc * current)!;
  }
  public eqBy<I>(
    other: IterableCompatible<I>,
    eq: (a: T, b: I) => boolean
  ): boolean {
    other = $Iterator.maybe(other);
    while (true) {
      let x = this.next();
      if (x.done) {
        return !!other.next().done;
      }
      let xVal = x.value;
      let y = other.next();
      if (y.done) return false;
      let yVal = y.value;
      return eq(xVal, yVal);
    }
  }
  public eq<I extends T>(other: IterableCompatible<I>): boolean {
    return this.eqBy(other, (x, y) => x === y);
  }
  public ne<I extends T>(other: IterableCompatible<I>): boolean {
    return !this.eq(other);
  }
}

export function arrayIter<T>(arr: T[]): $Iterator<T> {
  return new $Iterator(arr.values());
}

export {$Iterator};
