export default function makePatch(path, value) {
  return path.reduceRight((acc, part) => {
    if (typeof part === "number") {
      const arr = new Array(part + 1);
      arr[part] = acc;

      return arr;
    } else {
      return { [part]: acc };
    }
  }, value);
}
