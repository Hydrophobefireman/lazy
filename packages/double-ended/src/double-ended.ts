import {$Iterator} from "@hydrophobefireman/lazy";

export class DoubleEndedIterator<T> extends $Iterator<T> {
  private start: number;
  private end: number;

  constructor(
    private _it: T[],
    private isReversed?: boolean,
    start?: number,
    end?: number
  ) {
    super(_it.values());
    this.end = end ?? _it.length - 1;
    this.start = start ?? 0;
  }
  public last(): T {
    return this._it[this.end];
  }
  public count(): number {
    return this._it.length;
  }
  public rev(): DoubleEndedIterator<T> {
    return new DoubleEndedIterator(
      this._it,
      !this.isReversed,
      this.start,
      this.end
    );
  }
  public next(): IteratorResult<T, any> {
    const index = this.isReversed ? this.end-- : this.start++;
    const isDone = this.isReversed ? index < 0 : this.start >= this.count();
    return {value: isDone ? void 0 : this._it[index], done: isDone} as any;
  }
}
