import { addLast, setIn } from "timm";
import { z } from "zod";
import { withColorDefaults } from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  hexColor,
  onOff,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementModelType2 } from "visual/component/Elements/Types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { setIds } from "visual/utils/models";
import {
  TableAside,
  TableCol,
  TableColHead,
  type TableElement,
  TableRow,
  appendColumns,
  createBodyRows
} from "./utils";

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

export const tablePropsSchema = z.object({
  // content
  rows: z.number().min(1).max(10).optional(),
  columns: z.number().min(1).max(10).optional(),

  // layout
  tableHead: onOff.optional(),
  tableAside: onOff.optional(),
  width: z.number().min(1).max(100).optional(),
  widthSuffix: z.enum(["%"]).optional(),

  // typography
  typographyFontStyle: z.string().optional(),
  typographyFontSize: z.number().min(1).max(100).optional(),
  typographyFontWeight: z.number().min(100).max(900).optional(),
  typographyLineHeight: z.number().min(0.5).max(5).optional(),
  typographyLetterSpacing: z.number().min(-5).max(15).optional(),

  // background color
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorPalette: colorPalette,

  // active background color
  activeBgColorHex: hexColor,
  activeBgColorOpacity: opacity,
  activeBgColorPalette: colorPalette,

  // border style
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),

  // border color
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette
});

export type TableProps = z.infer<typeof tablePropsSchema>;

export const withTableDefaults = withColorDefaults;

const tablePropertyDefinitions = {
  rows: {
    type: "number",
    description: "Number of rows in the table (1-10)",
    minimum: 1,
    maximum: 10
  },
  columns: {
    type: "number",
    description: "Number of columns in the table (1-10)",
    minimum: 1,
    maximum: 10
  },
  tableHead: {
    type: "string",
    enum: ["on", "off"],
    description:
      "Show table header row (top row with its own background color). Style it via updateTableHead."
  },
  tableAside: {
    type: "string",
    enum: ["on", "off"],
    description:
      "Show table sidebar column (first column with its own background color, used for row labels). Each cell is a TableAside element with labelText and optional icon."
  },
  width: {
    type: "number",
    description: "Table width in percent (1-100)",
    minimum: 1,
    maximum: 100
  },
  widthSuffix: {
    type: "string",
    enum: ["%"],
    description: "Width unit (always '%')"
  },
  typographyFontStyle: {
    type: "string",
    description:
      "Font style preset: 'paragraph', 'subtitle', 'heading1'-'heading6', etc."
  },
  typographyFontSize: {
    type: "number",
    description: "Font size in pixels (1-100)",
    minimum: 1,
    maximum: 100
  },
  typographyFontWeight: {
    type: "number",
    description: "Font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  typographyLineHeight: {
    type: "number",
    description: "Line height multiplier (0.5-5)",
    minimum: 0.5,
    maximum: 5
  },
  typographyLetterSpacing: {
    type: "number",
    description: "Letter spacing in pixels (-5 to 15)",
    minimum: -5,
    maximum: 15
  },
  bgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  bgColorHex: {
    type: "string",
    description:
      "Background color hex (e.g., '#FFFFFF'). Palette is auto-cleared when hex is provided."
  },
  bgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  activeBgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using activeBgColorHex. For palette colors use 'color1'-'color8'."
  },
  activeBgColorHex: {
    type: "string",
    description:
      "Active/hover row background color hex (e.g., '#F9F9F9'). Palette is auto-cleared when hex is provided."
  },
  activeBgColorOpacity: {
    type: "number",
    description: "Active background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description: "Border line style"
  },
  borderColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using borderColorHex. For palette colors use 'color1'-'color8'."
  },
  borderColorHex: {
    type: "string",
    description:
      "Border color hex (e.g., '#DCDEE1'). Palette is auto-cleared when hex is provided."
  },
  borderColorOpacity: {
    type: "number",
    description: "Border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  }
} as const;

export const addTableDefinition: ToolDefinition = {
  name: "addTable",
  strict: true,
  description: `Add a Table to an EXISTING Section. Creates a table with configurable rows, columns, header, and sidebar.
TABLE STRUCTURE: Table > TableHead + TableBody. TableHead contains one TableRow with TableAside cells (header labels). TableBody contains multiple TableRow elements; each row has a TableAside (row label) + TableCol cells. TableCol works like a Column — it accepts any child components (RichText, Image, Button, etc.). TableAside only has a built-in labelText and optional icon — it does NOT accept child components.
CRITICAL: NEVER use removeElement on TableRow, TableCol, TableAside, TableHead, or TableBody. To change the number of rows or columns, use updateTable with the 'rows' and 'columns' properties on the Table element itself.
COLORS: The bgColor properties on the Table element control the overall table background. Header and sidebar cells do NOT have their own color — they inherit from their parent section. To change the header row color, use updateTableHead with bgColorHex/bgColorOpacity. To change body row and sidebar cell colors, use updateTableBody with bgColorHex/bgColorOpacity. Default: dark background (#2B3039) with white text (#FFFFFF).
REQUIRED WORKFLOW — After adding a table, you MUST populate ALL content:
1. Set rows/columns to match the desired structure.
2. searchElements({type:'TableAside'}) — find ALL header cells and row labels. Update each one with updateTableAside({labelText:'...'}) to set the correct text.
3. searchElements({type:'RichText'}) — find ALL data cell text elements inside the table. Update each one with updateText to fill in cell content.
4. (Optional) Update icons on TableAside elements — MUST call getAvailableIcons first, use exact name+type.
5. (Optional) Style header/body sections with updateTableHead/updateTableBody.
Do NOT stop after setting rows/columns — the table is not complete until ALL cell content is populated.
For new sections use generateBlock.`,
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description: "ID of the Section or Column container"
      },
      insertIndex: {
        type: "number",
        description: "Position in container (0-indexed). Omit to add at end.",
        minimum: 0
      },
      ...tablePropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateTableDefinition: ToolDefinition = {
  name: "updateTable",
  strict: true,
  description: `Update a Table element's properties (styling, layout, colors, border). Use searchElements({type:'Table'}) to find IDs.
CRITICAL: To change the number of rows or columns, set 'rows' and 'columns' here. NEVER use removeElement on TableRow, TableCol, TableAside, TableHead, or TableBody — always control table structure through rows/columns on the Table itself.
COLORS: bgColor here is the overall table background. To change the header row background/text color, use updateTableHead instead. To change body row background/text color (including sidebar cells in the body), use updateTableBody instead. TableAside cells inherit color from their parent section — they have no own color properties.
REQUIRED WORKFLOW — After changing rows/columns, you MUST update ALL cell content:
1. searchElements({type:'TableAside'}) — update every header cell and row label with updateTableAside({labelText:'...'}).
2. searchElements({type:'RichText'}) — update every data cell with updateText.
Do NOT stop after setting rows/columns — the table is not complete until ALL cell content is populated with the user's requested data.`,
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Table to update"
      },
      ...tablePropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

// ===========================================
// TableAside (header cells & row labels)
// ===========================================

export const tableAsidePropsSchema = z.object({
  labelText: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(["outline", "glyph", "fa"]).optional(),
  headerWidth: z.number().min(1).max(1000).optional(),
  headerWidthSuffix: z.enum(["px", "%"]).optional()
});

export type TableAsideProps = z.infer<typeof tableAsidePropsSchema>;

const tableAsidePropertyDefinitions = {
  labelText: {
    type: "string",
    description:
      "The text label displayed in this header cell or row label (e.g., 'Features', 'Car A', 'Engine')"
  },
  name: {
    type: "string",
    description:
      "CRITICAL: MUST be an exact 'name' value returned by getAvailableIcons. NEVER guess or invent icon names — only use values from getAvailableIcons results. Set to '' to remove icon."
  },
  type: {
    type: "string",
    enum: ["outline", "glyph", "fa"],
    description:
      "CRITICAL: MUST be the exact 'type' value from the same getAvailableIcons result as the 'name'. The name and type MUST come from the same icon entry — never mix them."
  },
  headerWidth: {
    type: "number",
    description: "Width of the aside column (1-1000 for px, 1-100 for %)",
    minimum: 1,
    maximum: 1000
  },
  headerWidthSuffix: {
    type: "string",
    enum: ["px", "%"],
    description: "Width unit for the aside column"
  }
} as const;

export const updateTableAsideDefinition: ToolDefinition = {
  name: "updateTableAside",
  strict: true,
  description: `Update a TableAside element (header cell or row label). TableAside has a built-in labelText and optional icon — it does NOT accept child components.
Use searchElements({type:'TableAside'}) to find all TableAside IDs. The labelText property is the displayed text — update it to change header titles (e.g., 'Features', 'Car A') or row labels (e.g., 'Engine', 'Power').
COLORS: TableAside has NO color properties — it inherits background/text color from its parent section. To change header aside cell colors use updateTableHead; to change body aside cell colors use updateTableBody.
CRITICAL — ICONS: NEVER guess or invent icon names. You MUST call getAvailableIcons first and use the exact 'name' and 'type' values from the results. The name and type must come from the same icon entry.
CRITICAL: NEVER use removeElement on TableAside. To add/remove rows or columns, use updateTable with rows/columns on the Table element.`,
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the TableAside element to update"
      },
      ...tableAsidePropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

// ===========================================
// TableHead & TableBody (section styling)
// ===========================================

export const tableHeadBodyPropsSchema = z.object({
  // text alignment
  horizontalAlign: z.enum(["left", "center", "right"]).optional(),

  // typography
  typographyFontStyle: z.string().optional(),
  typographyFontSize: z.number().min(1).max(100).optional(),
  typographyFontWeight: z.number().min(100).max(900).optional(),
  typographyLineHeight: z.number().min(0.5).max(5).optional(),
  typographyLetterSpacing: z.number().min(-5).max(15).optional(),

  // text color
  colorHex: hexColor,
  colorOpacity: opacity,
  colorPalette: colorPalette,

  // background color
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorPalette: colorPalette,

  // border
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderColorPalette: colorPalette,
  borderWidth: z.number().min(0).max(10).optional(),

  // padding
  paddingTop: z.number().min(0).max(100).optional(),
  paddingRight: z.number().min(0).max(100).optional(),
  paddingBottom: z.number().min(0).max(100).optional(),
  paddingLeft: z.number().min(0).max(100).optional(),

  // icon
  iconPosition: z.enum(["left", "right"]).optional(),
  iconSize: z.enum(["small", "medium", "large", "custom"]).optional(),
  iconCustomSize: z.number().min(8).max(50).optional(),
  iconSpacing: z.number().min(0).max(50).optional()
});

export type TableHeadBodyProps = z.infer<typeof tableHeadBodyPropsSchema>;

export const withTableHeadBodyDefaults = withColorDefaults;

const tableHeadBodyPropertyDefinitions = {
  horizontalAlign: {
    type: "string",
    enum: ["left", "center", "right"],
    description: "Text alignment within cells"
  },
  typographyFontStyle: {
    type: "string",
    description:
      "Font style preset: 'paragraph', 'subtitle', 'heading1'-'heading6', etc."
  },
  typographyFontSize: {
    type: "number",
    description: "Font size in pixels (1-100)",
    minimum: 1,
    maximum: 100
  },
  typographyFontWeight: {
    type: "number",
    description: "Font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  typographyLineHeight: {
    type: "number",
    description: "Line height multiplier (0.5-5)",
    minimum: 0.5,
    maximum: 5
  },
  typographyLetterSpacing: {
    type: "number",
    description: "Letter spacing in pixels (-5 to 15)",
    minimum: -5,
    maximum: 15
  },
  colorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using colorHex. For palette colors use 'color1'-'color8'."
  },
  colorHex: {
    type: "string",
    description:
      "Text color hex (e.g., '#FFFFFF'). Palette is auto-cleared when hex is provided."
  },
  colorOpacity: {
    type: "number",
    description: "Text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  bgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  bgColorHex: {
    type: "string",
    description:
      "Background color hex (e.g., '#2B3039'). Palette is auto-cleared when hex is provided."
  },
  bgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description: "Border line style"
  },
  borderColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using borderColorHex. For palette colors use 'color1'-'color8'."
  },
  borderColorHex: {
    type: "string",
    description:
      "Border color hex (e.g., '#DCDEE1'). Palette is auto-cleared when hex is provided."
  },
  borderColorOpacity: {
    type: "number",
    description: "Border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  borderWidth: {
    type: "number",
    description: "Border width in pixels (0-10)",
    minimum: 0,
    maximum: 10
  },
  paddingTop: {
    type: "number",
    description: "Top padding in pixels (0-100)",
    minimum: 0,
    maximum: 100
  },
  paddingRight: {
    type: "number",
    description: "Right padding in pixels (0-100)",
    minimum: 0,
    maximum: 100
  },
  paddingBottom: {
    type: "number",
    description: "Bottom padding in pixels (0-100)",
    minimum: 0,
    maximum: 100
  },
  paddingLeft: {
    type: "number",
    description: "Left padding in pixels (0-100)",
    minimum: 0,
    maximum: 100
  },
  iconPosition: {
    type: "string",
    enum: ["left", "right"],
    description: "Icon position relative to the label text"
  },
  iconSize: {
    type: "string",
    enum: ["small", "medium", "large", "custom"],
    description:
      "Icon size preset (small=16px, medium=24px, large=32px, custom=use iconCustomSize)"
  },
  iconCustomSize: {
    type: "number",
    description:
      "Custom icon size in pixels (8-50). Only used when iconSize is 'custom'.",
    minimum: 8,
    maximum: 50
  },
  iconSpacing: {
    type: "number",
    description: "Spacing between icon and label text in pixels (0-50)",
    minimum: 0,
    maximum: 50
  }
} as const;

export const updateTableHeadDefinition: ToolDefinition = {
  name: "updateTableHead",
  strict: true,
  description: `Update a TableHead element's styling (the header row section of a table). This controls the background color, text color, typography, border, padding, alignment, and icon settings for ALL header cells (including header TableAside cells which inherit these colors).
Use searchElements({type:'TableHead'}) to find the ID. Default: dark background (#2B3039) with white text (#FFFFFF). Set bgColorHex to change header background, colorHex to change header text color.
To change individual header cell text, use updateTableAside instead.
CRITICAL: NEVER use removeElement on TableHead. To show/hide the header, use updateTable with tableHead='on'/'off' on the Table element.`,
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the TableHead element to update"
      },
      ...tableHeadBodyPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const updateTableBodyDefinition: ToolDefinition = {
  name: "updateTableBody",
  strict: true,
  description: `Update a TableBody element's styling (the body section of a table). This controls the background color, text color, typography, border, padding, alignment, and icon settings for ALL body cells (including body TableAside sidebar cells which inherit these colors).
Use searchElements({type:'TableBody'}) to find the ID. Default: dark background (#2B3039) with white text (#FFFFFF). Set bgColorHex to change body background, colorHex to change body text color.
To change individual row labels, use updateTableAside. To change data cell text, use updateText on the RichText elements inside TableCol.
CRITICAL: NEVER use removeElement on TableBody or its children (TableRow, TableCol). To change the number of rows/columns, use updateTable with rows/columns on the Table element.`,
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the TableBody element to update"
      },
      ...tableHeadBodyPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addTableConfig: AddToolConfig = {
  kind: "add",
  definition: addTableDefinition,
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
  definition: updateTableDefinition,
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
  definition: updateTableAsideDefinition,
  elementType: ElementTypes.TableAside,
  schema: tableAsidePropsSchema
};

export const updateTableHeadConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateTableHeadDefinition,
  elementType: ElementTypes.TableHead,
  schema: tableHeadBodyPropsSchema,
  defaults: withTableHeadBodyDefaults
};

export const updateTableBodyConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateTableBodyDefinition,
  elementType: ElementTypes.TableBody,
  schema: tableHeadBodyPropsSchema,
  defaults: withTableHeadBodyDefaults
};
