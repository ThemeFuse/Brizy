import { constraintOf } from "@brizy/ai-tools";
import { z } from "zod";
import { componentConfigs } from "../tool-configs";
import { getBrizyToolDefinitions } from "../tool-registry";

const t = (key: string): string => key;

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

/**
 * Every argument a tool offers takes exactly the values its element accepts.
 *
 * The JSON schema is what the LLM is shown; the zod schema is what the handler
 * validates the call against. When they disagree the failure is the worst
 * kind: the model sends a value the tool told it was valid, and either the
 * whole call is rejected (a switch offered as a boolean, stored as "on"/"off")
 * or the value is accepted and the element ignores it (`"left"` sent to an
 * alignment that only knows "start"/"end").
 *
 * Tools built from the concern factories take their type, closed set and range
 * straight from zod, so they cannot drift. This guards the hand-written ones,
 * and the factories' own derivation.
 *
 * zod itself is checked against the toolbar — the editor's own record of what
 * each option can hold — by `tool-registry.toolbar-values.test.ts`.
 */
/** The part of a JSON-Schema property this guard compares. */
const offeredSchema = z.object({
  type: z.unknown(),
  enum: z.array(z.unknown()).optional(),
  minimum: z.unknown(),
  maximum: z.unknown()
});

const byAlias = new Map(componentConfigs.map((c) => [c.alias, c]));

const shapeOf = (schema: z.ZodTypeAny): z.ZodRawShape | undefined =>
  schema instanceof z.ZodObject ? schema.shape : undefined;

const sorted = (values: readonly unknown[] | undefined): string | undefined =>
  values === undefined ? undefined : [...values].map(String).sort().join("|");

const cases = getBrizyToolDefinitions(t)
  .filter((tool) => byAlias.has(tool.alias))
  .map((tool) => ({ name: tool.name, tool }));

describe("every argument a tool offers takes the values its element accepts", () => {
  it.each(cases)("$name", ({ tool }) => {
    const config = byAlias.get(tool.alias);
    const shape =
      config !== undefined && "schema" in config
        ? shapeOf(config.schema)
        : undefined;
    if (shape === undefined) return;

    const mismatches: string[] = [];
    for (const [key, raw] of Object.entries(tool.parameters.properties)) {
      const field = shape[key];
      if (field === undefined) continue;

      const accepted = constraintOf(field);
      if (accepted.type === undefined) continue;

      const parsed = offeredSchema.safeParse(raw);
      if (!parsed.success) continue;
      const offered = parsed.data;
      if (offered.type !== accepted.type)
        mismatches.push(
          `${key}: type ${String(offered.type)} vs ${accepted.type}`
        );
      if (sorted(offered.enum) !== sorted(accepted.enum))
        mismatches.push(
          `${key}: enum [${sorted(offered.enum) ?? "none"}] vs [${sorted(accepted.enum) ?? "none"}]`
        );
      if (offered.minimum !== accepted.minimum)
        mismatches.push(
          `${key}: minimum ${String(offered.minimum)} vs ${String(accepted.minimum)}`
        );
      if (offered.maximum !== accepted.maximum)
        mismatches.push(
          `${key}: maximum ${String(offered.maximum)} vs ${String(accepted.maximum)}`
        );
    }

    expect(mismatches).toEqual([]);
  });
});
