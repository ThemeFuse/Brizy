import { z } from "zod";
import {
  restoreColorOpacity,
  withColorDefaults
} from "visual/ai/adapters/prop-defaults";
import {
  borderStyleEnum,
  colorPalette,
  hexColor,
  opacity
} from "visual/ai/adapters/schema-primitives";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { DH, DW } from "visual/editorComponents/Story/utils";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";

/**
 * Unit/type keys the Shape's cssStyle consumers need, keyed by the property
 * that requires them. Pinned here instead of exposed to the LLM because every
 * one of them is a silent-failure trap:
 *
 * - `borderRadiusSuffix` is stored as the NUMBER 0 in defaultValue.json, and
 *   cssStyleBorderRadius concatenates it raw — a bare borderRadius: 50 renders
 *   `border-radius: 500;`, invalid CSS, no rounding at all.
 * - height only renders through cssStyleSizeHeightPercentOnly, which emits
 *   `height: unset` (collapsing the shape) for any suffix other than "%".
 * - offsets only render through cssStyleOffset, which reads the suffixes.
 */
const PINNED_UNITS: Record<string, Record<string, string>> = {
  width: { widthSuffix: "%" },
  height: { heightSuffix: "%" },
  borderRadius: { borderRadiusSuffix: "%", borderRadiusType: "grouped" },
  borderWidth: { borderWidthType: "grouped" },
  // Raw offsets are documented as measured from the left/top edge, so pin the
  // alignment to match. `anchor` overrides this in transformProps/beforeUpdate
  // when an edge needs the opposite basis.
  offsetX: { offsetXSuffix: "%", offsetXAlignment: "left" },
  offsetY: { offsetYSuffix: "%", offsetYAlignment: "top" }
};

const withShapeUnits = (props: ToolArgs): ToolArgs => {
  const result = { ...props };

  for (const [prop, pins] of Object.entries(PINNED_UNITS)) {
    if (props[prop] !== undefined) {
      Object.assign(result, pins);
    }
  }

  // A stored bgColorType of "gradient" makes cssStyleBgColor emit
  // `background-color: transparent`, so a fill change would be invisible.
  if (props.bgColorHex !== undefined || props.bgColorPalette !== undefined) {
    result.bgColorType = "solid";
  }

  return result;
};

/**
 * Shape's stored borderColorOpacity is 0, so an added shape with a border
 * colour but no opacity draws nothing. Add-only: on update the stored value is
 * available and `restoreColorOpacity` handles it without clobbering a
 * deliberately translucent border.
 */
const withVisibleBorder = (props: ToolArgs): ToolArgs =>
  (props.borderColorHex !== undefined ||
    props.borderColorPalette !== undefined) &&
  props.borderColorOpacity === undefined
    ? { ...props, borderColorOpacity: 1 }
    : props;

const ANCHORS = [
  "top-left",
  "top-center",
  "top-right",
  "center-left",
  "center",
  "center-right",
  "bottom-left",
  "bottom-center",
  "bottom-right"
] as const;

// Shape defaults, for an `add` that anchors without giving a size.
const DEFAULT_WIDTH = 50;
const DEFAULT_HEIGHT = 60;

/**
 * Translate an anchor into offsetX/offsetY.
 *
 * Everything is resolved into offsets from the LEFT/TOP edge, never by flipping
 * offsetXAlignment/offsetYAlignment to right/bottom. A right/bottom alignment
 * renders correctly, but `tools/Draggable` declares hAlign/vAlign in its props
 * (index.tsx:17-18) and never reads them — the drag is `v.x + deltaX*100/cW`
 * regardless — so a right-aligned shape drags INVERTED afterwards. Leaving the
 * LLM's output draggable matters more than saving this arithmetic.
 *
 * The two axes do not share a basis:
 * `width` is a percentage of the slide width, but `height` renders as
 * `padding-top`, making it a percentage of the shape's OWN width. Converting it
 * to a share of the slide folds in the slide aspect ratio:
 *
 *   heightPct = width * (height / 100) * (DW / DH)
 *
 * The LLM has no access to DW/DH and should not be doing this per call, so it
 * sends intent ("bottom-right") and this resolves it.
 *
 * ponytail: anchors pin flush only — there is no inset ("20% in from the
 * right"). tldraw's agent PlaceAction pairs each anchor with a sideOffset/
 * alignOffset for exactly that; add the same pair here if insets are asked for.
 */
const anchorToOffsets = (
  anchor: string,
  width: number,
  height: number
): Record<string, unknown> => {
  // "center" is the only single-token anchor; every other value is "v-h".
  const [vertical, horizontal] =
    anchor === "center" ? ["center", "center"] : anchor.split("-");

  const clamp = (n: number): number =>
    Math.round(Math.min(100, Math.max(0, n)));

  // Share of the slide HEIGHT taken by the shape (see the aspect note above).
  const heightPct = width * (height / 100) * (DW / DH);

  const place = (edge: string, sizePct: number): number =>
    clamp(
      edge === "end" ? 100 - sizePct : edge === "center" ? (100 - sizePct) / 2 : 0
    );

  return {
    offsetX: place(
      horizontal === "right" ? "end" : horizontal,
      width
    ),
    offsetXAlignment: "left",
    offsetY: place(vertical === "bottom" ? "end" : vertical, heightPct),
    offsetYAlignment: "top"
  };
};

/**
 * Resolve `anchor` into real offset keys and drop it — it is a tool-level
 * convenience, not a key the Shape model understands. `stored` supplies the
 * current size on update, when the call changes position without size.
 */
const applyAnchor = (
  parsed: Record<string, unknown>,
  stored?: Record<string, unknown>
): Record<string, unknown> => {
  const { anchor, ...rest } = parsed;

  if (typeof anchor !== "string") {
    return rest;
  }

  const size = (key: string, fallback: number): number => {
    const fromCall = rest[key];
    if (typeof fromCall === "number") return fromCall;
    const fromStored = stored?.[key];
    return typeof fromStored === "number" ? fromStored : fallback;
  };

  return {
    ...rest,
    offsetXSuffix: "%",
    offsetYSuffix: "%",
    ...anchorToOffsets(
      anchor,
      size("width", DEFAULT_WIDTH),
      size("height", DEFAULT_HEIGHT)
    )
  };
};

// Written by `withShapeUnits`, never by the LLM — they are absent from the
// tool definitions below. The schema must still list them: z.object() strips
// unknown keys, so an unlisted pin would be silently dropped before the update.
const pinnedFields = {
  widthSuffix: z.string().optional(),
  heightSuffix: z.string().optional(),
  borderRadiusSuffix: z.string().optional(),
  borderRadiusType: z.string().optional(),
  borderWidthType: z.string().optional(),
  offsetXSuffix: z.string().optional(),
  offsetXAlignment: z.string().optional(),
  offsetYSuffix: z.string().optional(),
  offsetYAlignment: z.string().optional(),
  bgColorType: z.string().optional()
};

export const shapePropsSchema = z.object({
  ...pinnedFields,
  // size
  width: z.number().min(5).max(100).optional(),
  // Rendered as `padding-top: N%`, which resolves against the shape's WIDTH —
  // so this is an aspect ratio, not a share of the slide. 100 = square.
  height: z.number().min(5).max(300).optional(),
  // fill
  bgColorHex: hexColor,
  bgColorPalette: colorPalette,
  bgColorOpacity: opacity,
  // corners
  borderRadius: z.number().min(0).max(50).optional(),
  // border
  borderStyle: borderStyleEnum,
  borderWidth: z.number().min(0).max(50).optional(),
  borderColorHex: hexColor,
  borderColorPalette: colorPalette,
  borderColorOpacity: opacity,
  // position on the slide
  anchor: z.enum(ANCHORS).optional(),
  offsetX: z.number().min(0).max(100).optional(),
  offsetY: z.number().min(0).max(100).optional()
});

export type ShapeProps = z.infer<typeof shapePropsSchema>;

// Every property description below is part of the indexed embedding, not just
// LLM guidance — keep the wording concrete and retrieval-friendly.
const shapePropertyDefinitions = {
  width: {
    type: "number",
    description:
      "Shape width as a percentage of the slide (5-100). 50 = half the slide wide. Bigger/smaller = raise/lower this. The % unit is set automatically; do not send widthSuffix.",
    minimum: 5,
    maximum: 100
  },
  height: {
    type: "number",
    description:
      "Shape height as a percentage of its own WIDTH, i.e. an aspect ratio (5-300), not a share of the slide. 100 = a perfect square, 50 = twice as wide as tall, 200 = twice as tall as wide. Set height: 100 together with borderRadius: 50 to get a true circle. The unit is set automatically; do not send heightSuffix.",
    minimum: 5,
    maximum: 300
  },
  bgColorPalette: {
    type: "string",
    description:
      "REQUIRED for custom fill colors. Set to '' (empty string) when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  bgColorHex: {
    type: "string",
    description:
      "Fill color of the shape (hex) — the color of the box, panel or circle itself. MUST be paired with bgColorPalette: '' to work. Example: bgColorPalette: '', bgColorHex: '#FF0000' makes the shape red."
  },
  bgColorOpacity: {
    type: "number",
    description:
      "Fill opacity (0-1). Use 0.2-0.5 for a translucent panel behind text; 0 makes the shape invisible.",
    minimum: 0,
    maximum: 1
  },
  borderRadius: {
    type: "number",
    description:
      "Corner rounding as a percentage of the shape's size (0 = square corners, 10 = softly rounded, 50 = fully round). This is the ONLY way to make a circle, oval or pill — there is no shape-type parameter. borderRadius: 50 on its own gives an OVAL; a true circle is borderRadius: 50 AND height: 100. The % unit is set automatically; do not send borderRadiusSuffix.",
    minimum: 0,
    maximum: 50
  },
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description:
      "Outline style drawn around the shape. 'none' removes the outline."
  },
  borderWidth: {
    type: "number",
    description:
      "Outline thickness in pixels (0 = no outline). Set borderColorHex as well — the stored outline color is fully transparent by default, so a width on its own draws nothing.",
    minimum: 0,
    maximum: 50
  },
  borderColorPalette: {
    type: "string",
    description:
      "REQUIRED for custom outline colors. Set to '' (empty string) when using borderColorHex. For palette colors use 'color1'-'color8'."
  },
  borderColorHex: {
    type: "string",
    description:
      "Outline color hex. MUST be paired with borderColorPalette: '' to work. Example: borderColorPalette: '', borderColorHex: '#FFFFFF'"
  },
  borderColorOpacity: {
    type: "number",
    description: "Outline color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  anchor: {
    type: "string",
    enum: [...ANCHORS],
    description:
      "PREFERRED way to place the shape on the slide. Snaps it to a corner, edge or the middle: 'bottom-right', 'top-left', 'center', 'bottom-center', etc. Edges pin flush and centring is calculated from the shape's own size, so the shape always lands fully on the slide — use this for any request like 'move it to the bottom', 'put it in the top right corner' or 'centre it', instead of guessing offsetX/offsetY."
  },
  offsetX: {
    type: "number",
    description:
      "Fine horizontal nudge: position of the shape's LEFT edge as a percentage of the slide width (0-100). IGNORED when anchor is set — send one or the other, never both. Prefer `anchor` for corners and edges — this positions the shape's left edge, not its right, so offsetX: 100 pushes it off the slide. To pin it right, use anchor: 'top-right' or offsetX = 100 - width. The unit is set automatically; do not send offsetXSuffix or offsetXAlignment.",
    minimum: 0,
    maximum: 100
  },
  offsetY: {
    type: "number",
    description:
      "Fine vertical nudge: position of the shape's TOP edge as a percentage of the slide height (0-100). IGNORED when anchor is set — send one or the other, never both. Prefer `anchor` for corners and edges — this positions the shape's top edge, so offsetY: 100 pushes it off the bottom of the slide entirely. The unit is set automatically; do not send offsetYSuffix or offsetYAlignment.",
    minimum: 0,
    maximum: 100
  },
} as const;

export const addShapeDefinition: ToolDefinition = {
  name: "addShape",
  strict: true,
  description:
    "Add a Shape to a Story slide: a solid color-filled block used as a background panel, highlight bar, color block, rectangle or circle behind other elements. Shape has NO shape-type parameter — it is a filled box; make a circle, oval or pill with borderRadius. Story mode only — on a normal page use addLine for a divider or addImage for a graphic. containerId must be a StoryItem (slide) id from getPageStructure. Not for section shape dividers or image masks.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description:
          "ID of the StoryItem (slide) to add the shape to, from getPageStructure. Shapes cannot be added to Sections or Columns."
      },
      insertIndex: {
        type: "number",
        description: "Position in container (0-indexed). Omit to add at end.",
        minimum: 0
      },
      ...shapePropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateShapeDefinition: ToolDefinition = {
  name: "updateShape",
  strict: true,
  description:
    "Update a Shape on a Story slide — its fill color, size, corner rounding, outline and position on the slide. Use searchElements({type:'Shape'}) to find Shape IDs first. Shape has no shape-type parameter: make it a circle, oval or pill with borderRadius, not by changing a type.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Shape to update"
      },
      ...shapePropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

const shapeBeforeUpdate = (
  deps: HandlerDeps,
  elementId: string,
  changes: Record<string, unknown>
): Record<string, unknown> => {
  const needsStored =
    changes.anchor !== undefined ||
    Object.keys(changes).some((k) => k.endsWith("Hex"));

  if (!needsStored) {
    return changes;
  }

  const el = deps.pageRepository.getElementById(elementId);
  const stored =
    el.success && el.data
      ? (el.data.value as Record<string, unknown> | undefined)
      : undefined;

  // Anchor needs the shape's current size when the call only moves it.
  const result = applyAnchor(changes, stored);

  return stored ? restoreColorOpacity(stored, result) : result;
};

export const addShapeConfig: AddToolConfig = {
  kind: "add",
  definition: addShapeDefinition,
  // The plain "Shape" key does not exist in getSampleShortCodes — only
  // "StoryShape", which resolves to StoryWrapper > Shape. mergeInitialProperties
  // lands these props on the inner Shape and inserts the wrapper.
  elementType: ElementTypes.StoryShape,
  schema: shapePropsSchema,
  defaults: pipe(withColorDefaults, withShapeUnits, withVisibleBorder),
  transformProps: (parsed) => applyAnchor(parsed)
};

export const updateShapeConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateShapeDefinition,
  // What is stored in blocksData, and what searchElements({type:'Shape'}) returns.
  elementType: ElementTypes.Shape,
  schema: shapePropsSchema,
  defaults: pipe(withColorDefaults, withShapeUnits),
  validateType: {
    expectedType: ElementTypes.Shape,
    errorMessage:
      "Element is a ${type}, not a Shape. Use searchElements({type:'Shape'}) to find Shape IDs. Shapes only exist on Story slides."
  },
  beforeUpdate: shapeBeforeUpdate
};
