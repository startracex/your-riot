/**
 * Get the code chunks from start and end range
 */
export default function getChunk(
  source: string,
  start: number,
  end: number,
): string {
  return source.slice(start, end)
}
