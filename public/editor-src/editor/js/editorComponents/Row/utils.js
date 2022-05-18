import { setIn } from "timm";

const ROW_WIDTH = 100; // percent
const truncate = num => Number(num.toFixed(1));

export function normalizeRowColumns(columns) {
  if (!columns || columns.length === 0) {
    return columns;
  }

  const nonLastColumnWidth = truncate(ROW_WIDTH / columns.length);
  const lastColumnWidth = truncate(
    ROW_WIDTH - nonLastColumnWidth * (columns.length - 1)
  );

  return columns.map((column, index) => {
    const width =
      index !== columns.length - 1 ? nonLastColumnWidth : lastColumnWidth;

    return setIn(column, ["value", "width"], width);
  });
}

export function getElemWidthWithoutPaddings(node) {
  const styles = window.getComputedStyle(node);

  return (
    node.clientWidth -
    parseFloat(styles.paddingLeft) -
    parseFloat(styles.paddingRight)
  );
}
