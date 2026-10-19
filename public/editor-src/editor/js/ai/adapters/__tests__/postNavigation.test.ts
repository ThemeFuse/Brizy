import {
  createBrizyToolHandlers,
  getBrizyToolDefinitions
} from "visual/ai/adapters/tool-registry";
import type { IPageRepository } from "visual/ai/application/interfaces/i-page-repository";
import type { IProjectRepository } from "visual/ai/application/interfaces/i-project-repository";

const t = (key: string): string => key;

jest.mock("visual/ai/utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

class FakePageRepository implements IPageRepository {
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
  constructor(private readonly fonts: boolean) {}
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
  fontExists = jest.fn(() => this.fonts);
}

const setup = (fontExists: boolean) => {
  const page = new FakePageRepository();
  const handlers = createBrizyToolHandlers(
    page,
    new FakeProjectRepository(fontExists),
    { get: jest.fn(), set: jest.fn(), delete: jest.fn(), clear: jest.fn() }
  );
  return { handlers, page };
};

describe("addPostNavigation", () => {
  it("creates a PostNavigation in the container with its labels", () => {
    const { handlers, page } = setup(true);

    const result = handlers.addPostNavigation({
      containerId: "col-1",
      insertIndex: 0,
      prevLabel: "Older",
      nextLabel: "Newer"
    });

    expect(result).toMatchObject({ success: true });
    expect(page.addElement).toHaveBeenCalledWith({
      containerId: "col-1",
      elementType: "PostNavigation",
      insertIndex: 0,
      initialProperties: { prevLabel: "Older", nextLabel: "Newer" }
    });
  });
});

describe("updatePostNavigation", () => {
  it("is exposed as several tools that share one handler", () => {
    const tools = getBrizyToolDefinitions(t).filter(
      (d) => d.alias === "updatePostNavigation"
    );

    expect(tools.length).toBeGreaterThan(1);
  });

  // Each row drives a different split tool, so together they also prove the
  // alias fan-out reaches the one handler.
  it.each([
    {
      case: "rewords the labels",
      tool: "updatePostNavigationContent",
      args: { prevLabel: "Back" },
      expected: { prevLabel: "Back" }
    },
    {
      case: "stores the separator colour under bgColor, clearing its palette",
      tool: "updatePostNavigationSeparator",
      args: { bgColorHex: "#112233", height: 60 },
      expected: { bgColorHex: "#112233", bgColorPalette: "", height: 60 }
    },
    {
      case: "stores the hover separator colour",
      tool: "updatePostNavigationSeparator",
      args: { hoverBgColorHex: "#445566" },
      expected: { hoverBgColorHex: "#445566", hoverBgColorPalette: "" }
    },
    {
      case: "stores the label colour and its hover state under title*",
      tool: "updatePostNavigationLabelColor",
      args: { titleColorHex: "#000000", hoverTitleColorHex: "#ff0000" },
      expected: {
        titleColorHex: "#000000",
        titleColorPalette: "",
        hoverTitleColorHex: "#ff0000",
        hoverTitleColorPalette: ""
      }
    },
    {
      case: "stores the post-title colour under post*",
      tool: "updatePostNavigationPostColor",
      args: { postColorHex: "#222222" },
      expected: { postColorHex: "#222222", postColorPalette: "" }
    },
    {
      // A type preset wins over a custom size until it is cleared.
      case: "clears the label type preset when a custom size is sent",
      tool: "updatePostNavigationLabelTypography",
      args: { titleTypographyFontSize: 12 },
      expected: { titleTypographyFontSize: 12, titleTypographyFontStyle: "" }
    },
    {
      case: "clears the post-title type preset independently",
      tool: "updatePostNavigationPostTypography",
      args: { postTypographyFontWeight: 700 },
      expected: { postTypographyFontWeight: 700, postTypographyFontStyle: "" }
    },
    {
      case: "stores the post-title letter case",
      tool: "updatePostNavigationPostTextStyle",
      args: { postTypographyUppercase: true },
      expected: { postTypographyUppercase: true }
    }
  ])("$case", ({ tool, args, expected }) => {
    const { handlers, page } = setup(true);

    handlers[tool]({ elementId: "pn-1", ...args });

    expect(page.updateElement).toHaveBeenCalledWith({
      elementId: "pn-1",
      elementType: "PostNavigation",
      changes: expect.objectContaining(expected)
    });
  });

  it("rejects a font that is not in the project", () => {
    const { handlers, page } = setup(false);

    const result = handlers.updatePostNavigationLabelTypography({
      elementId: "pn-1",
      titleTypographyFontFamily: "comic_sans"
    });

    expect(result).toMatchObject({ success: false });
    expect(page.updateElement).not.toHaveBeenCalled();
  });
});
