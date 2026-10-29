import {
  tableAsidePropsSchema,
  tableHeadBodyPropsSchema,
  tablePropsSchema
} from "@brizy/ai-tools";
import { addLast, setIn } from "timm";
import type { ElementModelType2 } from "visual/component/Elements/Types";
import {
  appendColumns,
  createBodyRows,
  TableAside,
  TableCol,
  TableColHead,
  type TableElement,
  TableRow
} from "visual/editorComponents/Table/utils";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import { setIds } from "visual/utils/models";
import {
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export function buildTableItems(
  rows: number,
  columns: number
): ElementModelType2[] {
  const cols = Array(columns).fill(TableCol);
  const bodyRow = setIn(TableRow, ["value", "items"], [TableAside, ...cols]);
  const bodyRows = Array(rows).fill(bodyRow);

  const headCols = Array(columns).fill(TableColHead);
  const headRow = setIn(
    TableRow,
    ["value", "items"],
    [TableAside, ...headCols]
  );

  const tableHead = {
    type: ElementTypes.TableHead,
    value: { items: [headRow] }
  };
  const tableBody = {
    type: ElementTypes.TableBody,
    value: { items: bodyRows }
  };

  return setIds([tableHead, tableBody]);
}
export function resizeTableItems(
  currentItems: ElementModelType2[],
  currentRows: number,
  currentCols: number,
  newRows: number | undefined,
  newCols: number | undefined
): ElementModelType2[] | undefined {
  if (newRows === undefined && newCols === undefined) return undefined;

  const targetRows = newRows ?? currentRows;
  const targetCols = newCols ?? currentCols;

  if (targetRows === currentRows && targetCols === currentCols) {
    return undefined;
  }

  const [tableHead, tableBody] = currentItems;

  let headRow = tableHead.value.items?.[0];
  let bodyRows = [...(tableBody.value?.items ?? [])];

  if (!headRow) {
    return;
  }

  // Resize columns
  if (targetCols > currentCols) {
    const result = appendColumns(
      headRow as TableElement,
      bodyRows as TableElement[],
      targetCols - currentCols
    );
    headRow = result.headRow;
    bodyRows = result.bodyRows;
  } else if (targetCols < currentCols) {
    headRow = setIn(
      headRow,
      ["value", "items"],
      (headRow.value.items ?? []).slice(0, 1 + targetCols)
    ) as TableElement;
    bodyRows = bodyRows.map(
      (row) =>
        setIn(
          row,
          ["value", "items"],
          (row.value.items ?? []).slice(0, 1 + targetCols)
        ) as TableElement
    );
  }

  // Resize rows
  if (targetRows > currentRows) {
    const nRows = createBodyRows(targetRows - currentRows, targetCols);
    bodyRows = addLast(bodyRows, nRows);
  } else if (targetRows < currentRows) {
    bodyRows = bodyRows.slice(0, targetRows);
  }

  return [
    setIn(tableHead, ["value", "items"], [headRow]) as ElementModelType2,
    setIn(tableBody, ["value", "items"], bodyRows) as ElementModelType2
  ];
}
export const withTableDefaults = pipe(
  withColorDefaults,
  withAllFontFamilyNormalize
);
export const withTableHeadBodyDefaults = pipe(
  withColorDefaults,
  withAllFontFamilyNormalize
);
export const addTableConfig: AddToolConfig = {
  kind: "add",
  alias: "addTable",
  elementType: ElementTypes.Table,
  schema: tablePropsSchema,
  defaults: withTableDefaults,
  transformProps: (parsed) => {
    const initialProperties: Record<string, unknown> = { ...parsed };

    // Build items hierarchy when rows or columns are specified
    // (shortcode default is 9 rows x 2 columns)
    const { rows, columns } = parsed as { rows?: number; columns?: number };
    if (rows !== undefined || columns !== undefined) {
      const targetRows = rows ?? 9;
      const targetCols = columns ?? 2;
      initialProperties.items = buildTableItems(targetRows, targetCols);
      initialProperties.rows = targetRows;
      initialProperties.columns = targetCols;
    }

    return initialProperties;
  }
};
export const updateTableConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateTable",
  elementType: ElementTypes.Table,
  schema: tablePropsSchema,
  defaults: withTableDefaults,
  beforeUpdate: (deps, elementId, parsed) => {
    const changes = { ...parsed };

    // When rows or columns change, resize the items array to match
    const { rows: newRows, columns: newCols } = parsed as {
      rows?: number;
      columns?: number;
    };
    if (newRows !== undefined || newCols !== undefined) {
      const elResult = deps.pageRepository.getElementById(elementId);
      if (elResult.success && elResult.data) {
        const currentValue = elResult.data.value as ElementModelType2["value"];
        const currentItems = currentValue.items;
        const currentRows = (currentValue.rows as number) ?? 9;
        const currentCols = (currentValue.columns as number) ?? 2;

        if (currentItems && currentItems.length === 2) {
          const resizedItems = resizeTableItems(
            // @ts-expect-error: Argument of type ElementModelType[] is not assignable to parameter of type ElementModelType2<ElementModel>[]
            currentItems,
            currentRows,
            currentCols,
            newRows,
            newCols
          );
          if (resizedItems) {
            changes.items = resizedItems;
          }
        }
      }
    }

    return changes;
  }
};
export const updateTableAsideConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateTableAside",
  elementType: ElementTypes.TableAside,
  schema: tableAsidePropsSchema
};
export const updateTableHeadConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateTableHead",
  elementType: ElementTypes.TableHead,
  schema: tableHeadBodyPropsSchema,
  defaults: withTableHeadBodyDefaults
};
export const updateTableBodyConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateTableBody",
  elementType: ElementTypes.TableBody,
  schema: tableHeadBodyPropsSchema,
  defaults: withTableHeadBodyDefaults
};
