/**
 * Outputs the last parsed node. Can be used with a builder too.
 * @private
 */
export default function flush(store: any): void {
  const last = store.last;
  store.last = null;
  if (last && store.root) {
    store.builder.push(last);
  }
}
