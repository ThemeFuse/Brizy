import {
  createBrizyToolHandlers,
  getBrizyToolDefinitions
} from "visual/ai/adapters/tool-registry";
import type { IPageRepository } from "visual/ai/application/interfaces/i-page-repository";
import type { IProjectRepository } from "visual/ai/application/interfaces/i-project-repository";

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
  fontExists = jest.fn(() => true);
}

const setup = () => {
  const page = new FakePageRepository();
  const handlers = createBrizyToolHandlers(page, new FakeProjectRepository(), {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn()
  });
  return { handlers, page };
};

const POST = "https://www.instagram.com/p/C1a2B3c4D5e/";

describe("addInstagramFeed", () => {
  // Without a link the element keeps its default, which renders; requiring
  // one made the model invent post codes that do not exist.
  it("can be called without a link", () => {
    const add = getBrizyToolDefinitions((key: string) => key).find(
      (d) => d.name === "addInstagramFeed"
    );

    expect(add?.parameters.required).not.toContain("embedUrl");
  });

  it("creates an InstagramFeed in the container from its post link", () => {
    const { handlers, page } = setup();

    const result = handlers.addInstagramFeed({
      containerId: "col-1",
      insertIndex: 0,
      embedUrl: POST
    });

    expect(result).toMatchObject({ success: true });
    expect(page.addElement).toHaveBeenCalledWith({
      containerId: "col-1",
      elementType: "InstagramFeed",
      insertIndex: 0,
      initialProperties: { embedUrl: POST }
    });
  });
});

describe("updateInstagramFeed", () => {
  // One row per split tool, which also proves the alias fan-out.
  it.each([
    {
      case: "swaps the post and rewords the fallback link",
      tool: "updateInstagramFeedContent",
      args: { embedUrl: POST, linkText: "See it on Instagram" }
    },
    {
      case: "accepts a reel link",
      tool: "updateInstagramFeedContent",
      args: { embedUrl: "https://www.instagram.com/reel/C9xYz12AbCd/" }
    },
    {
      case: "accepts a post link copied with its author and query",
      tool: "updateInstagramFeedContent",
      args: { embedUrl: "https://instagram.com/brizy/p/C1a2B3c4D5e?igsh=abc" }
    },
    {
      case: "accepts a profile link",
      tool: "updateInstagramFeedContent",
      args: { embedUrl: "https://www.instagram.com/brizy.builder/" }
    },
    {
      case: "shows the caption and hides the placeholder",
      tool: "updateInstagramFeedSettings",
      args: { captioned: "on", placeholderDisabled: "on" }
    },
    {
      case: "widens the embed",
      tool: "updateInstagramFeedSize",
      args: { width: 540 }
    }
  ])("$case", ({ tool, args }) => {
    const { handlers, page } = setup();

    handlers[tool]({ elementId: "ig-1", ...args });

    expect(page.updateElement).toHaveBeenCalledWith({
      elementId: "ig-1",
      elementType: "InstagramFeed",
      changes: expect.objectContaining(args)
    });
  });

  it.each([
    {
      case: "a link that is not on instagram.com",
      tool: "updateInstagramFeedContent",
      args: { embedUrl: "https://example.com/p/C1a2B3c4D5e/" }
    },
    {
      case: "a bare handle instead of a link",
      tool: "updateInstagramFeedContent",
      args: { embedUrl: "@brizy" }
    },
    {
      case: "a link without a scheme",
      tool: "updateInstagramFeedContent",
      args: { embedUrl: "instagram.com/p/C1a2B3c4D5e/" }
    },
    {
      case: "a lookalike host ending in instagram.com",
      tool: "updateInstagramFeedContent",
      args: { embedUrl: "http://notinstagram.com/p/C1a2B3c4D5e/" }
    },
    {
      case: "a lookalike host starting with instagram.com",
      tool: "updateInstagramFeedContent",
      args: { embedUrl: "https://instagram.com.evil.com/p/C1a2B3c4D5e/" }
    },
    {
      case: "the bare instagram.com address",
      tool: "updateInstagramFeedContent",
      args: { embedUrl: "https://www.instagram.com/" }
    },
    {
      case: "the description's placeholder copied verbatim",
      tool: "updateInstagramFeedContent",
      args: { embedUrl: "https://www.instagram.com/p/<code>/" }
    },
    {
      case: "HTML in the fallback link text",
      tool: "updateInstagramFeedContent",
      args: { linkText: "<b>View</b>" }
    },
    {
      case: "HTML in the loading text",
      tool: "updateInstagramFeedContent",
      args: { placeholderSpinner: "<i>Loading</i>" }
    },
    {
      case: "a width the slider cannot hold",
      tool: "updateInstagramFeedSize",
      args: { width: 1500 }
    },
    {
      case: "a negative width",
      tool: "updateInstagramFeedSize",
      args: { width: -1 }
    }
  ])("rejects $case", ({ tool, args }) => {
    const { handlers, page } = setup();

    const result = handlers[tool]({ elementId: "ig-1", ...args });

    expect(result).toMatchObject({ success: false });
    expect(page.updateElement).not.toHaveBeenCalled();
  });

  it("names the expected link form when it rejects one", () => {
    const { handlers } = setup();

    const result = handlers.updateInstagramFeedContent({
      elementId: "ig-1",
      embedUrl: "@brizy"
    });

    expect(JSON.stringify(result)).toContain("https://www.instagram.com/p/");
  });
});
