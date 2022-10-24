function* gen<T, U>(X: Iterator<T>, Y: Iterator<U>) {
  while (true) {
    let a = X.next();
    if (a.done) {
      break;
    }
    yield a.value;
  }
  while (true) {
    let a = Y.next();
    if (a.done) {
      break;
    }
    yield a.value;
  }
  return;
}

export function chain<T, U>(X: Iterator<T>, Y: Iterator<U>) {
  return gen(X, Y);
}
