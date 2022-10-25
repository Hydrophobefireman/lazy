export function* take<T>(it: Iterator<T>, n: number) {
  while (n--) {
    let val = it.next();
    if (val.done) return;
    yield val.value;
  }
}
