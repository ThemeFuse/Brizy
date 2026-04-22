import { addLast, setIn } from "timm";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { setIds } from "visual/utils/models";

export interface TableElement {
  type: string;
  value: {
    items: TableElement[];
    [key: string]: unknown;
  };
}

export const TableRow = {
  type: ElementTypes.TableRow,
  value: {
    items: [] as TableElement[]
  }
};

export const TableCol = {
  type: ElementTypes.TableCol,
  value: { items: [] }
};

export const TableColHead = {
  type: ElementTypes.TableAside,
  value: { labelText: "H 1", items: [] }
};

export const TableAside = {
  type: ElementTypes.TableAside,
  value: { labelText: "A 1", items: [] }
};

/**
 * Create new body rows, each shaped [TableAside, ...N×TableCol].
 * Returns an array of rows with unique IDs assigned.
 */
export function createBodyRows(
  numRows: number,
  numCols: number
): TableElement[] {
  const cols = Array(numCols).fill(TableCol);
  const row = setIn(TableRow, ["value", "items"], [TableAside, ...cols]);
  return setIds(Array(numRows).fill(row));
}

/**
 * Append new columns to a head row and all body rows.
 * Adds `colsToAdd` TableColHead items to the head row
 * and `colsToAdd` TableCol items to each body row.
 */
export function appendColumns(
  headRow: TableElement,
  bodyRows: TableElement[],
  colsToAdd: number
): { headRow: TableElement; bodyRows: TableElement[] } {
  const nHeadCols = setIds(Array(colsToAdd).fill(TableColHead));
  const updatedHeadRow = setIn(
    headRow,
    ["value", "items"],
    addLast(headRow.value?.items ?? [], nHeadCols)
  );

  const updatedBodyRows = bodyRows.map((row) => {
    const nCols = setIds(Array(colsToAdd).fill(TableCol));
    return setIn(
      row,
      ["value", "items"],
      addLast(row.value?.items ?? [], nCols)
    );
  });

  return {
    headRow: updatedHeadRow as TableElement,
    bodyRows: updatedBodyRows as TableElement[]
  };
}
