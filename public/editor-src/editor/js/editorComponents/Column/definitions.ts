import { z } from "zod";
import {
  inferBgColorType,
  inferBorderRadiusType,
  withAnimatedGradientDefaults,
  withColorDefaults
} from "visual/ai/adapters/prop-defaults";
import {
  activeStopIndexSchema,
  bgColorTypeContainer,
  colorPalette,
  containerOverlayAndBorderPropertyDefinitions,
  gradientLinearDegree,
  gradientPointer,
  gradientRadialDegree,
  gradientSpeed,
  gradientStopsSchema,
  gradientType,
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
import { log } from "visual/ai/utils/logger";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";

export const withColumnDefaults = pipe(
  withColorDefaults,
  inferBgColorType,
  withAnimatedGradientDefaults,
  inferBorderRadiusType
);

export const columnPropsSchema = z.object({
  // layout
  width: z.number().min(5).max(95).optional(),
  // style - background
  bgColorPalette: colorPalette,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  bgColorType: bgColorTypeContainer,
  // gradient
  gradientType: gradientType,
  gradientColorPalette: colorPalette,
  gradientColorHex: hexColor,
  gradientColorOpacity: opacity,
  gradientLinearDegree: gradientLinearDegree,
  gradientRadialDegree: gradientRadialDegree,
  gradientStartPointer: gradientPointer,
  gradientFinishPointer: gradientPointer,
  gradientSpeed: gradientSpeed,
  gradientStops: gradientStopsSchema,
  activeStopIndex: activeStopIndexSchema,
  // style - border
  borderColorPalette: colorPalette,
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderWidth: z.number().min(0).optional(),
  borderRadiusType: z.enum(["grouped", "ungrouped"]).optional(),
  borderRadius: z.number().min(0).optional(),
  borderTopLeftRadius: z.number().min(0).optional(),
  borderTopRightRadius: z.number().min(0).optional(),
  borderBottomRightRadius: z.number().min(0).optional(),
  borderBottomLeftRadius: z.number().min(0).optional(),
  // hover - overlay
  hoverBgColorPalette: colorPalette,
  hoverBgColorHex: hexColor,
  hoverBgColorOpacity: opacity,
  hoverBgColorType: bgColorTypeContainer,
  hoverGradientType: gradientType,
  hoverGradientColorPalette: colorPalette,
  hoverGradientColorHex: hexColor,
  hoverGradientColorOpacity: opacity,
  hoverGradientLinearDegree: gradientLinearDegree,
  hoverGradientRadialDegree: gradientRadialDegree,
  hoverGradientStartPointer: gradientPointer,
  hoverGradientFinishPointer: gradientPointer,
  hoverGradientSpeed: gradientSpeed,
  hoverGradientStops: gradientStopsSchema,
  hoverActiveStopIndex: activeStopIndexSchema,
  // hover - border
  hoverBorderColorPalette: colorPalette,
  hoverBorderColorHex: hexColor,
  hoverBorderColorOpacity: opacity,
  hoverBorderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  hoverBorderWidth: z.number().min(0).optional(),
  // hover - box shadow
  hoverBoxShadow: z.enum(["none", "inset", "outset"]).optional(),
  hoverBoxShadowColorHex: hexColor,
  hoverBoxShadowColorOpacity: opacity,
  hoverBoxShadowColorPalette: colorPalette,
  hoverBoxShadowBlur: z.number().min(0).optional(),
  hoverBoxShadowSpread: z.number().optional(),
  hoverBoxShadowVertical: z.number().optional(),
  hoverBoxShadowHorizontal: z.number().optional(),
  // style - padding
  paddingTop: z.number().min(0).optional(),
  paddingBottom: z.number().min(0).optional(),
  paddingLeft: z.number().min(0).optional(),
  paddingRight: z.number().min(0).optional()
});

export type ColumnProps = z.infer<typeof columnPropsSchema>;

const columnPropertyDefinitions = {
  width: {
    type: "number",
    description:
      "Column width in percentage (%), not pixels. Sibling columns auto-adjust to fill remaining space. Min 5%, max depends on number of siblings.",
    minimum: 5,
    maximum: 95
  },
  bgColorPalette: {
    type: "string",
    description:
      "REQUIRED for custom background colors. Set to '' (empty string) when using bgColorHex."
  },
  bgColorHex: {
    type: "string",
    description:
      "Background color hex. MUST be paired with bgColorPalette: '' to work."
  },
  bgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  borderColorPalette: {
    type: "string",
    description:
      "REQUIRED for custom border colors. Set to '' (empty string) when using borderColorHex."
  },
  borderColorHex: {
    type: "string",
    description:
      "Border color hex. MUST be paired with borderColorPalette: '' to work."
  },
  borderColorOpacity: {
    type: "number",
    description: "Border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description: "Border line style"
  },
  borderWidth: {
    type: "number",
    description: "Border width in pixels",
    minimum: 0
  },
  borderRadiusType: {
    type: "string",
    enum: ["grouped", "ungrouped"],
    description:
      "Corner radius mode. 'grouped' = same radius on all corners via borderRadius, 'ungrouped' = per-corner values."
  },
  borderRadius: {
    type: "number",
    description:
      "Border radius in pixels for all corners. Auto-sets borderRadiusType to 'grouped' if not specified.",
    minimum: 0
  },
  borderTopLeftRadius: {
    type: "number",
    description:
      "Top-left corner radius in pixels. Auto-sets borderRadiusType to 'ungrouped'.",
    minimum: 0
  },
  borderTopRightRadius: {
    type: "number",
    description:
      "Top-right corner radius in pixels. Auto-sets borderRadiusType to 'ungrouped'.",
    minimum: 0
  },
  borderBottomRightRadius: {
    type: "number",
    description:
      "Bottom-right corner radius in pixels. Auto-sets borderRadiusType to 'ungrouped'.",
    minimum: 0
  },
  borderBottomLeftRadius: {
    type: "number",
    description:
      "Bottom-left corner radius in pixels. Auto-sets borderRadiusType to 'ungrouped'.",
    minimum: 0
  },
  paddingTop: {
    type: "number",
    description: "Top padding in pixels",
    minimum: 0
  },
  paddingBottom: {
    type: "number",
    description: "Bottom padding in pixels",
    minimum: 0
  },
  paddingLeft: {
    type: "number",
    description: "Left padding in pixels",
    minimum: 0
  },
  paddingRight: {
    type: "number",
    description: "Right padding in pixels",
    minimum: 0
  },
  ...containerOverlayAndBorderPropertyDefinitions,
  // hover - box shadow
  hoverBoxShadow: {
    type: "string",
    enum: ["none", "inset", "outset"],
    description: "Box shadow type on hover. 'outset' = outer shadow, 'inset' = inner shadow, 'none' = disabled."
  },
  hoverBoxShadowColorHex: {
    type: "string",
    description: "Hover box shadow color hex. Palette is auto-cleared."
  },
  hoverBoxShadowColorOpacity: {
    type: "number",
    description: "Hover box shadow color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  hoverBoxShadowColorPalette: {
    type: "string",
    description: "Set to '' when using hoverBoxShadowColorHex. For palette colors use 'color1'-'color8'."
  },
  hoverBoxShadowBlur: {
    type: "number",
    description: "Hover box shadow blur radius in pixels",
    minimum: 0
  },
  hoverBoxShadowSpread: {
    type: "number",
    description: "Hover box shadow spread in pixels (positive = expand, negative = shrink)"
  },
  hoverBoxShadowVertical: {
    type: "number",
    description: "Hover box shadow vertical offset in pixels"
  },
  hoverBoxShadowHorizontal: {
    type: "number",
    description: "Hover box shadow horizontal offset in pixels"
  }
} as const;

export const addColumnDefinition: ToolDefinition = {
  name: "addColumn",
  strict: true,
  description:
    "Add a Column to an existing Row. Supports gradient, animated-gradient, hover background/border, hover box shadow, and border radius. Only for multi-column layouts in existing sections. For new sections use generateBlock.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description: "ID of the Row container"
      },
      insertIndex: {
        type: "number",
        description: "Position in row (0-indexed). Omit to add at end.",
        minimum: 0
      },
      ...columnPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateColumnDefinition: ToolDefinition = {
  name: "updateColumn",
  strict: true,
  description:
    "Update a Column element's properties. Supports gradient, animated-gradient, hover background, hover border, hover box shadow, and border radius. Width must be in percentage (%), not pixels. When width is changed, sibling columns in the same Row are automatically recalculated so all columns total 100%. Minimum width per column is 5%.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the column to update"
      },
      ...columnPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addColumnConfig: AddToolConfig = {
  kind: "add",
  definition: addColumnDefinition,
  elementType: ElementTypes.Column,
  schema: columnPropsSchema,
  defaults: withColumnDefaults
};

export const updateColumnConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateColumnDefinition,
  elementType: ElementTypes.Column,
  schema: columnPropsSchema,
  defaults: withColumnDefaults,
  updateMethod: "updateColumn",
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateColumn input %o", args);
    const { elementId, ...props } = args;

    const propsWithDefaults = withColumnDefaults(props);
    const parsed = columnPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const result = deps.pageRepository.updateColumn({
      elementId: elementId as string,
      elementType: ElementTypes.Column,
      changes: parsed.data
    });
    log.tools("updateColumn output %o", result);
    return result;
  }
};
