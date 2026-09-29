import type { ISharedStore } from "visual/plugins/SharedStore";
import type { IPageRepository } from "../../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../../application/interfaces/i-project-repository";
import {
  createBrizyToolHandlers,
  getBrizyToolDefinitions
} from "../tool-registry";

const t = (key: string): string => key;

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

/**
 * The catalog now lives in `@brizy/ai-tools`, which imports nothing from
 * `visual/*` and so cannot see the handlers it is describing. Nothing inside
 * that package can tell whether a tool it advertises is actually executable
 * here, and the schema-drift check in `tool-registry.shape.test.ts` skips an
 * alias with no config at all rather than failing on it — so a tool split off
 * under a misspelled alias would be offered to the model and then answer
 * "Unknown tool" at run time.
 *
 * This is the join: every name the editor's half of the catalog advertises has
 * to resolve to a handler, through its alias or its own name.
 */
describe("the editor executes everything its catalog advertises", () => {
  it("resolves every tool to a handler", () => {
    const handlers = createBrizyToolHandlers(
      {} as IPageRepository,
      {} as IProjectRepository,
      {} as ISharedStore
    );
    const runnable = new Set(Object.keys(handlers));

    const unrunnable = getBrizyToolDefinitions(t)
      .filter((tool) => !runnable.has(tool.alias) && !runnable.has(tool.name))
      .map((tool) => `${tool.name} (alias ${tool.alias})`);

    expect(unrunnable).toEqual([]);
  });
});
