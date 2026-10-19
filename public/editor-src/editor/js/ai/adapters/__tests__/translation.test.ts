import { createBrizyToolHandlers } from "visual/ai/adapters/tool-registry";
import type { IPageRepository } from "visual/ai/application/interfaces/i-page-repository";
import type { IProjectRepository } from "visual/ai/application/interfaces/i-project-repository";
import { SharedStore } from "visual/plugins/SharedStore";

jest.mock("visual/ai/utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

class FakePageRepository implements IPageRepository {
  constructor(stored: Record<string, unknown>) {
    this.getElementById.mockReturnValue({
      success: true,
      data: { id: "tr-1", type: "Translation", path: [], value: stored }
    });
  }
  getPageStructure = jest.fn();
  addBlock = jest.fn();
  removeBlock = jest.fn();
  moveBlock = jest.fn();
  duplicateBlock = jest.fn();
  clearPage = jest.fn();
  insertTemplate = jest.fn();
  getElementById = jest.fn();
  searchElements = jest.fn();
  addElement = jest.fn().mockReturnValue({ success: true, data: {} });
  removeElement = jest.fn();
  updateElement = jest.fn().mockReturnValue({ success: true, data: {} });
  updateColumn = jest.fn();
  duplicateElement = jest.fn();
  moveElement = jest.fn();
  updateRichText = jest.fn();
  getAvailableIcons = jest.fn();
  getAvailableMenus = jest.fn();
  isPro = jest.fn();
  setPageStatus = jest.fn();
  undo = jest.fn();
}

class FakeProjectRepository implements IProjectRepository {
  getProjectStyles = jest.fn();
  changeStyle = jest.fn();
  addStyle = jest.fn();
  updateStyle = jest.fn();
  duplicateStyle = jest.fn();
  getProjectFonts = jest.fn();
  getGoogleFonts = jest.fn();
  addFont = jest.fn();
  deleteFont = jest.fn();
  changeDefaultFont = jest.fn();
  fontExists = jest.fn().mockReturnValue(true);
}

/** The switcher's stored defaults that the hooks below react to. */
const SHIPPED = {
  borderStyle: "",
  tempBorderStyle: "solid",
  borderColorOpacity: 0,
  tempBorderColorOpacity: 1,
  boxShadow: "none",
  selectBorderStyle: "solid",
  fontStyle: "button"
};

const setup = (stored: Record<string, unknown>) => {
  const repo = new FakePageRepository(stored);
  const handlers = createBrizyToolHandlers(
    repo,
    new FakeProjectRepository(),
    new SharedStore()
  );
  return { handlers, repo };
};

describe("addTranslation", () => {
  it("adds a bare Translation to the container", () => {
    const { handlers, repo } = setup({});

    const result = handlers.addTranslation({
      containerId: "col-1",
      insertIndex: 1
    });

    expect(result).toMatchObject({ success: true });
    expect(repo.addElement).toHaveBeenCalledWith(
      expect.objectContaining({
        containerId: "col-1",
        elementType: "Translation",
        insertIndex: 1
      })
    );
  });
});

describe("updateTranslation", () => {
  it.each([
    {
      case: "switches names to country codes",
      tool: "updateTranslationSettings",
      stored: SHIPPED,
      args: { nameDisplay: "code", flagSize: "custom", flagCustomSize: 30 },
      expected: { nameDisplay: "code", flagSize: "custom", flagCustomSize: 30 },
      absent: []
    },
    {
      case: "turns the border on when only its colour is sent",
      tool: "updateTranslationBorder",
      stored: SHIPPED,
      args: { borderColorHex: "#ff0000" },
      expected: {
        borderColorHex: "#ff0000",
        borderColorPalette: "",
        borderStyle: "solid",
        borderColorOpacity: 1
      },
      absent: []
    },
    {
      case: "keeps a dashed border dashed when its colour changes",
      tool: "updateTranslationBorder",
      stored: { ...SHIPPED, borderStyle: "dashed", borderColorOpacity: 1 },
      args: { borderColorHex: "#ff0000" },
      expected: { borderColorHex: "#ff0000" },
      absent: ["borderStyle"]
    },
    {
      case: "turns the closed control's shadow on",
      tool: "updateTranslationShadow",
      stored: SHIPPED,
      args: { boxShadowBlur: 8 },
      expected: { boxShadowBlur: 8, boxShadow: "on" },
      absent: []
    },
    {
      case: "turns the list's shadow on",
      tool: "updateTranslationDropdownShadow",
      stored: { ...SHIPPED, selectBoxShadow: "none" },
      args: { selectBoxShadowBlur: 8 },
      expected: { selectBoxShadowBlur: 8, selectBoxShadow: "on" },
      absent: []
    },
    {
      case: "writes the list's hover background under hoverSelect",
      tool: "updateTranslationDropdownHoverBackground",
      stored: SHIPPED,
      args: { hoverSelectBgColorHex: "#eeeeee" },
      expected: {
        hoverSelectBgColorHex: "#eeeeee",
        hoverSelectBgColorPalette: ""
      },
      absent: []
    },
    {
      case: "aligns the list items",
      tool: "updateTranslationAlign",
      stored: SHIPPED,
      args: { selectHorizontalAlign: "left" },
      expected: { selectHorizontalAlign: "left" },
      absent: []
    },
    {
      case: "clears the button type preset when a size is sent",
      tool: "updateTranslationTypography",
      stored: SHIPPED,
      args: { fontSize: 16 },
      expected: { fontSize: 16, fontStyle: "" },
      absent: []
    }
  ])("$case", ({ tool, stored, args, expected, absent }) => {
    const { handlers, repo } = setup(stored);

    const result = handlers[tool]({ elementId: "tr-1", ...args });

    expect(result).toMatchObject({ success: true });
    expect(repo.updateElement).toHaveBeenCalledWith(
      expect.objectContaining({
        elementType: "Translation",
        changes: expect.objectContaining(expected)
      })
    );
    const { changes } = repo.updateElement.mock.calls[0][0];
    for (const key of absent) {
      expect(changes).not.toHaveProperty(key);
    }
  });
});
