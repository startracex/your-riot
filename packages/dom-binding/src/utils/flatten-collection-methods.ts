/**
 * Create a flat object having as keys a list of methods that if dispatched will propagate
 * on the whole collection.
 */
export default function flattenCollectionMethods<T, K extends keyof T, C>(
  collection: T[],
  methods: K[],
  context?: C,
): Record<K, (scope?: any) => C> {
  return methods.reduce(
    (acc, method) => {
      return {
        ...acc,
        [method]: (scope?: any) => {
          collection.map((item) => (item[method] as Function)(scope));
          return context;
        },
      };
    },
    {} as Record<K, (scope?: any) => C>,
  );
}
