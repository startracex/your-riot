export default function execFromPos(
  re: RegExp,
  pos: number,
  string: string,
): RegExpMatchArray | null {
  re.lastIndex = pos;
  return re.exec(string);
}
