import { z } from "zod";
import type { ISharedStore } from "visual/plugins/SharedStore";
import type { IPageRepository } from "../../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../../application/interfaces/i-project-repository";
import {
  createBrizyToolHandlers,
  getBrizyToolDefinitions
} from "../tool-registry";

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

const t = (key: string): string => key;

/**
 * Every definition sets additionalProperties: false, so the advertised schema is
 * the model's whole contract. A parameter the handler implements but the schema
 * omits is unreachable; a constraint the handler enforces but the schema omits
 * produces a schema-valid call that always fails.
 */
const parametersOf = (tool: string) => {
  const definition = getBrizyToolDefinitions(t).find((d) => d.name === tool);
  if (!definition) throw new Error(`no definition for ${tool}`);

  return definition.parameters;
};

// A JSON Schema node, as far as this test needs to walk one.
const schemaNode = z
  .object({
    properties: z.record(z.unknown()).optional(),
    items: z.unknown().optional()
  })
  .passthrough();

/** Walk a property path, stepping through `items` for array schemas. */
const propertyOf = (tool: string, path: string[]) => {
  let node: unknown = parametersOf(tool);

  for (const key of path) {
    const parsed = schemaNode.parse(node);
    const container = parsed.properties
      ? parsed
      : schemaNode.parse(parsed.items);

    const next = container.properties?.[key];
    if (next === undefined) {
      throw new Error(`no ${path.join(".")} on ${tool}`);
    }

    node = next;
  }

  return schemaNode.parse(node);
};

/** The keys a schema node offers the model, stepping through `items`. */
const keysOffered = (tool: string, path: string[]): string[] => {
  const node = propertyOf(tool, path);
  const container = node.properties ? node : schemaNode.parse(node.items);

  return Object.keys(container.properties ?? {});
};

const run = async (tool: string, args: Record<string, unknown>) => {
  // Repositories are stubbed to succeed, so a failure can only come from the
  // tool's own zod validation.
  const stub = new Proxy(
    {},
    { get: () => () => ({ success: true, data: {} }) }
  );

  const handlers = createBrizyToolHandlers(
    stub as IPageRepository,
    stub as IProjectRepository,
    {} as ISharedStore
  );

  return handlers[tool](args);
};

const handlerRejects = async (
  tool: string,
  args: Record<string, unknown>
): Promise<boolean> => (await run(tool, args)).success === false;

/**
 * What a font style stores once per device, each with a value its constraint
 * refuses. A key the handler's schema did not declare would be stripped rather
 * than refused, so the rejection is what proves it is read.
 */
const measurements = [
  {
    name: "FontSize",
    constraint: "range",
    declares: { minimum: 1, maximum: 200 },
    refused: 900
  },
  {
    name: "FontWeight",
    constraint: "range",
    declares: { minimum: 100, maximum: 900 },
    refused: 5000
  },
  {
    name: "LineHeight",
    constraint: "range",
    declares: { minimum: 0.5, maximum: 5 },
    refused: 56
  },
  {
    name: "LetterSpacing",
    constraint: "type",
    declares: { type: "number" },
    refused: "wide"
  }
];

/** Desktop keys carry no prefix: `fontSize` beside `tabletFontSize`. */
const keysOf = (device: string) =>
  measurements.map((measurement) => ({
    ...measurement,
    key:
      device === "desktop"
        ? `${measurement.name[0].toLowerCase()}${measurement.name.slice(1)}`
        : `${device}${measurement.name}`
  }));

/**
 * The tools that write font styles, with the devices each one writes and the
 * tool that takes a device it does not. All take `fontStyles: [{ id, ... }]`,
 * so a case adds one key to an entry that is valid without it.
 */
const fontStyleTools = [
  { tool: "updateProjectStyle", devices: ["desktop", "tablet", "mobile"] },
  { tool: "updateFontStyle", devices: ["desktop"] },
  { tool: "updateFontStyleTablet", devices: ["tablet"] },
  { tool: "updateFontStyleMobile", devices: ["mobile"] }
];

const toolFor: Record<string, string> = {
  desktop: "updateFontStyle",
  tablet: "updateFontStyleTablet",
  mobile: "updateFontStyleMobile"
};

const fontStylesWith = (entry: Record<string, unknown>) => ({
  fontStyles: [{ id: "paragraph", ...entry }]
});

const fontStyleConstraintCases = fontStyleTools.flatMap(({ tool, devices }) =>
  devices.flatMap((device) =>
    keysOf(device).map(({ key, constraint, declares, refused }) => ({
      case: `the ${tool} ${key} ${constraint}`,
      tool,
      path: ["fontStyles", key],
      declares,
      rejected: fontStylesWith({ [key]: refused })
    }))
  )
);

const fontStylesListCases = fontStyleTools.map(({ tool }) => ({
  case: `the ${tool} fontStyles lower bound`,
  tool,
  path: ["fontStyles"],
  declares: { minItems: 1 },
  rejected: { fontStyles: [] }
}));

/**
 * A key that belongs to another device, sent to a tool that writes one. The
 * values are all in range, so only the key itself can be what is refused.
 */
const wrongDeviceCases = fontStyleTools
  .filter(({ devices }) => devices.length === 1)
  .flatMap(({ tool, devices }) =>
    Object.keys(toolFor)
      .filter((device) => !devices.includes(device))
      .flatMap((device) =>
        [
          ...keysOf(device).map(({ key }) => ({ key, value: 1.5 })),
          ...(device === "desktop"
            ? [{ key: "fontFamily", value: "lato" }]
            : [])
        ].map(({ key, value }) => ({
          case: `${key} sent to ${tool}`,
          tool,
          key,
          args: fontStylesWith({ [key]: value }),
          takenBy: toolFor[device]
        }))
      )
  );

describe("advertised schema matches the handler", () => {
  it.each([
    { case: "moveBlock fromIndex", tool: "moveBlock", property: "fromIndex" },
    {
      case: "duplicateBlock blockIndex",
      tool: "duplicateBlock",
      property: "blockIndex"
    },
    {
      case: "searchElements typeRegex",
      tool: "searchElements",
      property: "typeRegex"
    }
  ])("advertises $case, which the handler implements", ({ tool, property }) => {
    expect(parametersOf(tool).properties).toHaveProperty(property);
  });

  it("does not require getAvailableIcons.iconType, which its own description calls optional", async () => {
    expect(parametersOf("getAvailableIcons").required ?? []).not.toContain(
      "iconType"
    );
    expect(await handlerRejects("getAvailableIcons", { search: "star" })).toBe(
      false
    );
  });

  it.each([
    {
      case: "the addBlankBlock hex pattern",
      tool: "addBlankBlock",
      path: ["bgColorHex"],
      declares: { pattern: "^#[0-9A-Fa-f]{6}$" },
      rejected: { bgColorHex: "#fff" }
    },
    {
      case: "the updateProjectStyle palette length",
      tool: "updateProjectStyle",
      path: ["colorPalette"],
      declares: { minItems: 8, maxItems: 8 },
      rejected: { colorPalette: [{ id: "color1", hex: "#FF0000" }] }
    },
    {
      case: "the updateColorPalette lower bound",
      tool: "updateColorPalette",
      path: ["colorPalette"],
      declares: { minItems: 1 },
      rejected: { colorPalette: [] }
    },
    {
      case: "the updateColorPalette upper bound",
      tool: "updateColorPalette",
      path: ["colorPalette"],
      declares: { maxItems: 8 },
      rejected: {
        colorPalette: Array.from({ length: 9 }, () => ({
          id: "color1",
          hex: "#FF0000"
        }))
      }
    },
    {
      case: "the updateColorPalette hex pattern",
      tool: "updateColorPalette",
      path: ["colorPalette", "hex"],
      declares: { pattern: "^#[0-9A-Fa-f]{6}$" },
      rejected: { colorPalette: [{ id: "color1", hex: "#fff" }] }
    },
    ...fontStylesListCases,
    ...fontStyleConstraintCases
  ])(
    "declares $case that the handler enforces",
    async ({ tool, path, declares, rejected }) => {
      expect(propertyOf(tool, path)).toMatchObject(declares);
      expect(await handlerRejects(tool, rejected)).toBe(true);
    }
  );

  it.each([
    {
      case: "a full 8-colour palette",
      tool: "updateProjectStyle",
      args: {
        colorPalette: Array.from({ length: 8 }, (_, i) => ({
          id: `color${i + 1}`,
          hex: "#FF0000"
        }))
      }
    },
    {
      case: "an in-range typography update",
      tool: "updateProjectStyle",
      args: fontStylesWith({ fontSize: 18, lineHeight: 1.5 })
    },
    {
      case: "updateProjectStyle with tablet and mobile keys",
      tool: "updateProjectStyle",
      args: fontStylesWith({ tabletFontSize: 16, mobileLineHeight: 1.4 })
    },
    {
      case: "a single palette slot",
      tool: "updateColorPalette",
      args: { colorPalette: [{ id: "color3", hex: "#1A237E" }] }
    },
    {
      case: "a desktop font style with its family",
      tool: "updateFontStyle",
      args: fontStylesWith({
        fontFamily: "lato",
        fontSize: 18,
        lineHeight: 1.5
      })
    },
    {
      case: "a tablet font style",
      tool: "updateFontStyleTablet",
      args: fontStylesWith({ tabletFontSize: 16, tabletLineHeight: 1.4 })
    },
    {
      case: "a mobile font style",
      tool: "updateFontStyleMobile",
      args: fontStylesWith({ mobileFontSize: 14, mobileLetterSpacing: 0.2 })
    }
  ])("still accepts $case", async ({ tool, args }) => {
    expect(await handlerRejects(tool, args)).toBe(false);
  });

  // The style is split across tools that take the same slots, so the wrong
  // tool is an easy call to make. Stripping the stray key would report a
  // change that never happened; the refusal says where the key goes instead.
  it.each(wrongDeviceCases)(
    "refuses $case and names the tool that takes it",
    async ({ tool, key, args, takenBy }) => {
      expect(keysOffered(tool, ["fontStyles"])).not.toContain(key);

      const result = await run(tool, args);

      expect(result.success).toBe(false);
      expect(result.error).toContain(takenBy);
    }
  );

  it.each([
    {
      case: "font styles sent to updateColorPalette",
      tool: "updateColorPalette",
      key: "fontStyles",
      args: {
        colorPalette: [{ id: "color3", hex: "#1A237E" }],
        ...fontStylesWith({ fontSize: 18 })
      }
    },
    ...Object.values(toolFor).map((tool) => ({
      case: `a palette sent to ${tool}`,
      tool,
      key: "colorPalette",
      args: {
        fontStyles: [{ id: "paragraph" }],
        colorPalette: [{ id: "color3", hex: "#1A237E" }]
      }
    }))
  ])("refuses $case", async ({ tool, key, args }) => {
    expect(keysOffered(tool, [])).not.toContain(key);
    expect(await handlerRejects(tool, args)).toBe(true);
  });
});
