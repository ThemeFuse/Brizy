import { shapePropsSchema } from "@brizy/ai-tools";
import { DH, DW } from "visual/editorComponents/Story/utils";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import { restoreColorOpacity, withColorDefaults } from "../prop-defaults";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "../types";

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
      edge === "end"
        ? 100 - sizePct
        : edge === "center"
          ? (100 - sizePct) / 2
          : 0
    );

  return {
    offsetX: place(horizontal === "right" ? "end" : horizontal, width),
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
  alias: "addShape",
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
  alias: "updateShape",
  // What is stored in blocksData, and what searchElements({type:'Shape'}) returns.
  elementType: ElementTypes.Shape,
  schema: shapePropsSchema,
  defaults: pipe(withColorDefaults, withShapeUnits),
  validateType: {
    expectedType: ElementTypes.Shape,
    errorMessage:
      // biome-ignore lint/suspicious/noTemplateCurlyInString: the literal token handler-factory replaces with the real type at runtime, not an interpolation
      "Element is a ${type}, not a Shape. Use searchElements({type:'Shape'}) to find Shape IDs. Shapes only exist on Story slides."
  },
  beforeUpdate: shapeBeforeUpdate
};
