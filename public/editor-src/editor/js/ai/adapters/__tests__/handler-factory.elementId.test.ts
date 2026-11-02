import type { ISharedStore } from "visual/plugins/SharedStore";
import type { IPageRepository } from "../../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../../application/interfaces/i-project-repository";
import {
  createBrizyToolHandlers,
  getBrizyToolDefinitions
} from "../tool-registry";

const t = (key: string): string => key;

/**
 * An element is exposed as several small tools that all carry one alias, and
 * the bare alias is a handler key rather than a name the model can call. These
 * tests are about the alias's handler, so they resolve the catalog name that
 * actually carries the arguments under test — which is how a tool call arrives.
 */
const toolNameFor = (alias: string, args: Record<string, unknown>): string => {
  const named = getBrizyToolDefinitions(t).filter((d) => d.alias === alias);
  const match = named.find((d) =>
    Object.keys(args).every((key) => key in d.parameters.properties)
  );

  if (!match) {
    throw new Error(
      `no tool aliased ${alias} carries ${Object.keys(args).join(", ")}`
    );
  }

  return match.name;
};

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

const makeHandlers = () => {
  const updateElement = jest.fn(() => ({ success: true, data: {} }));
  const updateColumn = jest.fn(() => ({ success: true, data: {} }));
  const updateRichText = jest.fn(() => ({ success: true, data: {} }));
  const getElementById = jest.fn(() => ({
    success: true,
    data: { id: "el-1", type: "Menu", value: {} }
  }));

  const pageRepository = {
    updateElement,
    updateColumn,
    updateRichText,
    getElementById
  } as unknown as IPageRepository;

  return {
    handlers: createBrizyToolHandlers(
      pageRepository,
      {} as IProjectRepository,
      {} as ISharedStore
    ),
    calls: () =>
      updateElement.mock.calls.length +
      updateColumn.mock.calls.length +
      updateRichText.mock.calls.length +
      getElementById.mock.calls.length
  };
};

// A missing elementId reaches getElementById as `undefined` and matches the
// blocksData root, so every downstream error describes the wrong problem.
describe.each([
  // routed through createUpdateHandler
  { alias: "updateSectionItem", extra: { paddingTop: 10 } },
  { alias: "updateMenu", extra: { colorHex: "#222222" } },
  // custom handlers that bypass the factory
  { alias: "updateButton", extra: { text: "Hi" } },
  { alias: "updateText", extra: { replaceWith: "Hi" } },
  { alias: "updateColumn", extra: { width: 50 } },
  { alias: "updateChart", extra: {} },
  { alias: "updateLogin", extra: {} },
  { alias: "updateSwitcher", extra: {} },
  { alias: "updateAnimatedHeadline", extra: {} },
  { alias: "updatePaypal", extra: {} },
  { alias: "updateProtectedForm", extra: {} }
])("$alias elementId validation", ({ alias, extra }) => {
  const tool = toolNameFor(alias, extra);

  it.each([
    { case: "omitted", args: {} },
    { case: "empty", args: { elementId: "" } },
    { case: "null", args: { elementId: null } },
    { case: "a number", args: { elementId: 42 } }
  ])("rejects an $case elementId, naming it", async ({ args }) => {
    const { handlers, calls } = makeHandlers();

    const result = await handlers[tool]({ ...args, ...extra });

    expect(result.success).toBe(false);
    expect(result.error).toContain("elementId");
    expect(calls()).toBe(0);
  });

  it("still reaches the repository with a real elementId", async () => {
    const { handlers, calls } = makeHandlers();

    await handlers[tool]({ elementId: "el-1", ...extra });

    expect(calls()).toBeGreaterThan(0);
  });
});
