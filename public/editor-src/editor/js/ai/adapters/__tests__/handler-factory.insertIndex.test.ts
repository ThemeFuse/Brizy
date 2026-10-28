import type { ISharedStore } from "visual/plugins/SharedStore";
import type { IPageRepository } from "../../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../../application/interfaces/i-project-repository";
import { createBrizyToolHandlers } from "../tool-registry";

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

const makeHandlers = () => {
  const addElement = jest.fn(() => ({
    success: true,
    data: { elementId: "new-1", containerId: "col-a", insertedAt: 0 }
  }));
  const pageRepository = { addElement } as unknown as IPageRepository;

  return {
    handlers: createBrizyToolHandlers(
      pageRepository,
      {} as IProjectRepository,
      {} as ISharedStore
    ),
    addElement
  };
};

// insertIndex bypasses every config schema, so an unchecked non-numeric value
// becomes NaN in addElement's clamp and nothing is inserted.
describe.each([
  // routed through createAddHandler
  { tool: "addAccordion", extra: {} },
  // routed through createAddNoPropsHandler
  { tool: "addForm", extra: {} },
  // custom handler that bypasses the factory entirely
  { tool: "addButton", extra: { text: "Click" } }
])("$tool insertIndex validation", ({ tool, extra }) => {
  it.each([
    { case: "a word", insertIndex: "first" },
    { case: "an object", insertIndex: {} },
    { case: "a fraction", insertIndex: 1.5 },
    { case: "a negative index", insertIndex: -1 },
    { case: "a numeric string", insertIndex: "2" },
    { case: "null", insertIndex: null }
  ])("rejects $case without touching the page", async ({ insertIndex }) => {
    const { handlers, addElement } = makeHandlers();

    const result = await handlers[tool]({
      containerId: "col-a",
      insertIndex,
      ...extra
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("insertIndex");
    expect(addElement).not.toHaveBeenCalled();
  });

  it.each([
    { case: "the first position", insertIndex: 0 },
    { case: "a middle position", insertIndex: 2 },
    { case: "a position past the end", insertIndex: 99 }
  ])("forwards $case to the repository", async ({ insertIndex }) => {
    const { handlers, addElement } = makeHandlers();

    const result = await handlers[tool]({
      containerId: "col-a",
      insertIndex,
      ...extra
    });

    expect(result.success).toBe(true);
    expect(addElement).toHaveBeenCalledWith(
      expect.objectContaining({ insertIndex })
    );
  });

  it("forwards undefined when insertIndex is omitted", async () => {
    const { handlers, addElement } = makeHandlers();

    const result = await handlers[tool]({ containerId: "col-a", ...extra });

    expect(result.success).toBe(true);
    expect(addElement).toHaveBeenCalledWith(
      expect.objectContaining({ insertIndex: undefined })
    );
  });
});
