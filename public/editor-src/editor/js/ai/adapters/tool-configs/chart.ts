import {
  chartPropsSchema,
  containerIdSchema,
  elementIdSchema,
  inferDeviceStoredFlags,
  insertIndexSchema
} from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import { log } from "../../utils/logger";
import {
  validateFonts,
  withColorDefaults,
  withFontFamilyNormalize
} from "../prop-defaults";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "../types";

type Props = Record<string, unknown>;
const TITLE_CUSTOM_TYPOGRAPHY_KEYS = [
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing"
];
const DATA_LABEL_CUSTOM_TYPOGRAPHY_KEYS = [
  "dataLabelTypographyFontSize",
  "dataLabelTypographyFontWeight",
  "dataLabelTypographyLineHeight",
  "dataLabelTypographyLetterSpacing"
];
const inferCustomTypographyPresets = <T extends Props>(props: T): T => {
  const next = { ...props } as Record<string, unknown>;

  if (
    !("fontStyle" in next) &&
    TITLE_CUSTOM_TYPOGRAPHY_KEYS.some((k) => k in next && next[k] !== undefined)
  ) {
    next.fontStyle = "";
  }

  if (
    !("dataLabelTypographyFontStyle" in next) &&
    DATA_LABEL_CUSTOM_TYPOGRAPHY_KEYS.some(
      (k) => k in next && next[k] !== undefined
    )
  ) {
    next.dataLabelTypographyFontStyle = "";
  }

  return next as T;
};
/** Slider option reads both borderSize and borderSizeSuffix; ensure suffix is set when borderSize is provided. */
const inferBorderSizeSuffix = <T extends Props>(props: T): T =>
  "borderSize" in props &&
  props.borderSize !== undefined &&
  !("borderSizeSuffix" in props)
    ? { ...props, borderSizeSuffix: "px" }
    : props;
export const withChartDefaults = pipe(
  withColorDefaults,
  withFontFamilyNormalize,
  (p) => withFontFamilyNormalize(p, "dataLabelTypography"),
  inferCustomTypographyPresets,
  inferBorderSizeSuffix
);
type ChartType = "pie" | "bar" | "line";
function resolveAxisLabelChanges(
  chartType: ChartType | undefined,
  labelValue: unknown
): Record<string, unknown> {
  if (typeof labelValue !== "string") return {};

  if (chartType === "bar") return { barLabel: labelValue };
  if (chartType === "line") return { lineLabel: labelValue };

  // If chartType is unknown or pie, keep both labels in sync so switching type later still has labels.
  return { barLabel: labelValue, lineLabel: labelValue };
}
function resolveFamiliesChanges(parsed: Record<string, unknown>): {
  families?: Record<string, unknown>;
} {
  const nextFamilies: Record<string, unknown> = {};

  if (typeof parsed.fontFamily === "string") {
    nextFamilies.fontFamily = parsed.fontFamily;
  }

  if (typeof parsed.dataLabelTypographyFontFamily === "string") {
    nextFamilies.dataLabelTypographyFontFamily =
      parsed.dataLabelTypographyFontFamily;
  }

  return Object.keys(nextFamilies).length > 0 ? { families: nextFamilies } : {};
}
function inferChartTypeForUpdate(
  deps: HandlerDeps,
  elementId: string,
  explicitChartType?: unknown
): ChartType | undefined {
  if (
    explicitChartType === "pie" ||
    explicitChartType === "bar" ||
    explicitChartType === "line"
  ) {
    return explicitChartType;
  }

  const details = deps.pageRepository.getElementById(elementId);
  if (!details.success) return undefined;

  const value = details.data?.value ?? {};
  const t = (value as Record<string, unknown>).chartType;
  return t === "pie" || t === "bar" || t === "line" ? t : undefined;
}
export const addChartConfig: AddToolConfig = {
  kind: "add",
  alias: "addChart",
  elementType: ElementTypes.Chart,
  schema: chartPropsSchema,
  defaults: withChartDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addChart input %o", args);
    const { containerId, insertIndex, ...rawProps } = args;

    const containerIdParsed = containerIdSchema.safeParse(containerId);
    if (!containerIdParsed.success) {
      return { success: false, error: containerIdParsed.error.message };
    }

    const insertIndexParsed = insertIndexSchema.safeParse(insertIndex);
    if (!insertIndexParsed.success) {
      return { success: false, error: insertIndexParsed.error.message };
    }

    const propsWithDefaults = withChartDefaults(rawProps);
    const parsed = chartPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const labelValue = parsed.data.label ?? parsed.data.labels;
    const labelChanges = resolveAxisLabelChanges(
      parsed.data.chartType as ChartType | undefined,
      labelValue
    );

    const familiesChanges = resolveFamiliesChanges(parsed.data);

    const initialProperties = {
      ...parsed.data,
      ...labelChanges,
      ...familiesChanges
    };

    // Avoid storing the alias keys (label/labels) on the element.
    delete (initialProperties as Record<string, unknown>).label;
    delete (initialProperties as Record<string, unknown>).labels;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.Chart,
      insertIndex: insertIndexParsed.data,
      initialProperties
    });

    log.tools("addChart output %o", result);
    return result;
  }
};
export const updateChartConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateChart",
  elementType: ElementTypes.Chart,
  schema: chartPropsSchema,
  defaults: withChartDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateChart input %o", args);
    const { elementId, ...rawProps } = args;

    const elementIdParsed = elementIdSchema.safeParse(elementId);
    if (!elementIdParsed.success) {
      return { success: false, error: elementIdParsed.error.message };
    }

    // This handler keeps its own desktop inference, so the shared flag pass
    // never runs here; the tablet and mobile half of it still has to.
    const propsWithDefaults = withChartDefaults(
      inferDeviceStoredFlags(chartPropsSchema, rawProps)
    );
    const parsed = chartPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const chartType = inferChartTypeForUpdate(
      deps,
      elementIdParsed.data,
      parsed.data.chartType
    );
    const labelValue = parsed.data.label ?? parsed.data.labels;
    const labelChanges = resolveAxisLabelChanges(chartType, labelValue);

    const familiesChanges = resolveFamiliesChanges(parsed.data);

    const changes = {
      ...parsed.data,
      ...labelChanges,
      ...familiesChanges
    };

    delete (changes as Record<string, unknown>).label;
    delete (changes as Record<string, unknown>).labels;

    const result = deps.pageRepository.updateElement({
      elementId: elementIdParsed.data,
      elementType: ElementTypes.Chart,
      changes
    });

    log.tools("updateChart output %o", result);
    return result;
  }
};
