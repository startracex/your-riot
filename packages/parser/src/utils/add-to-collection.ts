/**
 * Add an item into a collection, if the collection is not an array
 * we create one and add the item to it.
 */
export default function addToCollection<T = any>(
  collection: T[] = [],
  item: T,
): T[] {
  collection.push(item);
  return collection;
}
