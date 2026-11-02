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

// The RichText is exposed as several small tools that all carry the alias
// "updateText"; findText belongs to the content one, which is the name a tool
// call actually arrives under.
const TOOL = "updateTextContent";

const t = (key: string): string => key;

const makeHandlers = () => {
  const updateRichText = jest.fn(() => ({ success: true, data: {} }));
  const pageRepository = { updateRichText } as unknown as IPageRepository;
  const projectRepository = {} as IProjectRepository;
  const store = {} as ISharedStore;

  return {
    handlers: createBrizyToolHandlers(pageRepository, projectRepository, store),
    updateRichText
  };
};

describe("updateText — findText", () => {
  // An empty findText compiles to an empty regex, which matches everywhere.
  it.each([
    {
      case: "an empty findText",
      args: { elementId: "rt-1", findText: "", replaceWith: "Hi" },
      reaches: false
    },
    {
      case: "a whitespace-only findText",
      args: { elementId: "rt-1", findText: " ", replaceWith: "Hi" },
      reaches: true
    },
    {
      case: "an omitted findText",
      args: { elementId: "rt-1", replaceWith: "Hi" },
      reaches: true
    },
    {
      case: "an ordinary findText",
      args: { elementId: "rt-1", findText: "cat", replaceWith: "dog" },
      reaches: true
    }
  ])("$case reaches the repository: $reaches", async ({ args, reaches }) => {
    const { handlers, updateRichText } = makeHandlers();

    const result = await handlers[TOOL](args);

    expect(updateRichText).toHaveBeenCalledTimes(reaches ? 1 : 0);
    expect(result).toEqual(
      reaches
        ? expect.objectContaining({ success: true })
        : expect.objectContaining({ success: false })
    );
  });

  it("tells the model how to replace all text when findText is empty", async () => {
    const { handlers } = makeHandlers();

    const result = await handlers[TOOL]({
      elementId: "rt-1",
      findText: "",
      replaceWith: "Hi"
    });

    expect(result.error).toContain("omit findText");
  });

  it("advertises the non-empty constraint to the model", () => {
    const definition = getBrizyToolDefinitions(t).find((d) => d.name === TOOL);

    expect(definition?.parameters.properties?.findText).toEqual(
      expect.objectContaining({ minLength: 1 })
    );
  });
});
