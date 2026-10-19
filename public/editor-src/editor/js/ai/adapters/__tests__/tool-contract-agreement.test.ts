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
const propertyOf = (tool: string, path: string[]): Record<string, unknown> => {
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

const handlerRejects = async (
  tool: string,
  args: Record<string, unknown>
): Promise<boolean> => {
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

  return (await handlers[tool](args)).success === false;
};

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
      case: "the palette length",
      tool: "updateProjectStyle",
      path: ["colorPalette"],
      declares: { minItems: 8, maxItems: 8 },
      rejected: { colorPalette: [{ id: "color1", hex: "#FF0000" }] }
    },
    {
      case: "the lineHeight range",
      tool: "updateProjectStyle",
      path: ["fontStyles", "lineHeight"],
      declares: { minimum: 0.5, maximum: 5 },
      rejected: { fontStyles: [{ id: "paragraph", lineHeight: 56 }] }
    },
    {
      case: "the fontWeight range",
      tool: "updateProjectStyle",
      path: ["fontStyles", "fontWeight"],
      declares: { minimum: 100, maximum: 900 },
      rejected: { fontStyles: [{ id: "paragraph", fontWeight: 5000 }] }
    },
    {
      case: "the fontSize range",
      tool: "updateProjectStyle",
      path: ["fontStyles", "fontSize"],
      declares: { minimum: 1, maximum: 200 },
      rejected: { fontStyles: [{ id: "paragraph", fontSize: 900 }] }
    }
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
      args: { fontStyles: [{ id: "paragraph", fontSize: 18, lineHeight: 1.5 }] }
    }
  ])("still accepts $case", async ({ tool, args }) => {
    expect(await handlerRejects(tool, args)).toBe(false);
  });
});
