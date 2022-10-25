export function isCustomIterator<T>(
  item: unknown
): item is import("./iterator").$Iterator<T> {
  return item && (item as any).__$Iterator;
}
