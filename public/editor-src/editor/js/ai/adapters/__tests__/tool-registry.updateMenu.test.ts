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

interface UpdateArg {
  elementId: string;
  elementType?: string;
  changes: Record<string, unknown>;
}

const mockUpdateElement = () =>
  jest.fn((_arg: UpdateArg) => ({ success: true, data: {} }));

/**
 * The Menu is exposed as several small tools that all carry the alias
 * "updateMenu", so the handler is registered under every one of their names —
 * "updateMenu" itself is no longer something the LLM can call. These tests
 * drive it through the derived name that owns the property under test, which
 * is exactly how a tool call arrives.
 */
describe("updateMenu registration", () => {
  it("exposes the Menu through tools that all resolve to one handler", () => {
    const menuTools = getBrizyToolDefinitions(t).filter(
      (d) => d.alias === "updateMenu"
    );

    expect(menuTools.length).toBeGreaterThan(1);
    expect(menuTools.map((d) => d.name)).toContain("updateMenuLayout");
    // The bare alias is a handler key, not a tool the model can call.
    expect(menuTools.map((d) => d.name)).not.toContain("updateMenu");
  });

  it("has a handler that routes to updateElement with the Menu changes", () => {
    const updateElement = mockUpdateElement();
    const getElementById = jest.fn(() => ({
      success: true,
      data: { value: {} }
    }));
    const pageRepository = {
      updateElement,
      getElementById
    } as unknown as IPageRepository;
    const projectRepository = {} as IProjectRepository;
    const store = {} as ISharedStore;

    const handlers = createBrizyToolHandlers(
      pageRepository,
      projectRepository,
      store
    );

    expect(typeof handlers.updateMenuLayout).toBe("function");
    expect(handlers.updateMenuColor).toBe(handlers.updateMenuLayout);

    handlers.updateMenuLayout({
      elementId: "menu-1",
      verticalMode: "vertical",
      colorHex: "#222222"
    });

    expect(updateElement).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: "menu-1",
        elementType: "Menu",
        changes: expect.objectContaining({
          verticalMode: "vertical",
          colorHex: "#222222",
          colorPalette: "" // withColorDefaults auto-clears palette for hex
        })
      })
    );
  });

  it("routes horizontalAlign to the parent Wrapper, not the Menu", () => {
    const updateElement = mockUpdateElement();
    const getElementById = jest.fn(() => ({
      success: true,
      data: { parentId: "wrapper-9", parentType: "Wrapper" }
    }));
    const pageRepository = {
      updateElement,
      getElementById
    } as unknown as IPageRepository;

    const handlers = createBrizyToolHandlers(
      pageRepository,
      {} as IProjectRepository,
      {} as ISharedStore
    );

    handlers.updateMenuLayout({
      elementId: "menu-1",
      horizontalAlign: "left",
      colorHex: "#222222"
    });

    // The Wrapper receives the alignment.
    expect(updateElement).toHaveBeenCalledWith({
      elementId: "wrapper-9",
      elementType: "Wrapper",
      changes: { horizontalAlign: "left" }
    });

    // The Menu update keeps its own props but NOT horizontalAlign.
    const menuCall = updateElement.mock.calls.find(
      ([p]) => p.elementId === "menu-1"
    );
    expect(menuCall).toBeDefined();
    const menuChanges = menuCall![0].changes;
    expect(menuChanges).toMatchObject({ colorHex: "#222222" });
    expect(menuChanges).not.toHaveProperty("horizontalAlign");
  });

  it("restores stored temp opacity when a bg hex lands on a transparent color", () => {
    const updateElement = mockUpdateElement();
    const getElementById = jest.fn(() => ({
      success: true,
      data: {
        value: { menuBgColorOpacity: 0, tempMenuBgColorOpacity: 1 }
      }
    }));
    const pageRepository = {
      updateElement,
      getElementById
    } as unknown as IPageRepository;

    const handlers = createBrizyToolHandlers(
      pageRepository,
      {} as IProjectRepository,
      {} as ISharedStore
    );

    handlers.updateMenuBackground({
      elementId: "menu-1",
      menuBgColorHex: "#ff0000"
    });

    expect(updateElement).toHaveBeenCalledWith(
      expect.objectContaining({
        changes: expect.objectContaining({
          menuBgColorHex: "#ff0000",
          menuBgColorPalette: "", // withColorDefaults
          menuBgColorOpacity: 1 // restored from tempMenuBgColorOpacity
        })
      })
    );
  });

  it("does not clobber a stored non-zero opacity on a hex-only edit", () => {
    const updateElement = mockUpdateElement();
    const getElementById = jest.fn(() => ({
      success: true,
      data: { value: { menuBgColorOpacity: 0.5, tempMenuBgColorOpacity: 1 } }
    }));
    const pageRepository = {
      updateElement,
      getElementById
    } as unknown as IPageRepository;

    const handlers = createBrizyToolHandlers(
      pageRepository,
      {} as IProjectRepository,
      {} as ISharedStore
    );

    handlers.updateMenuBackground({
      elementId: "menu-1",
      menuBgColorHex: "#ff0000"
    });

    const changes = updateElement.mock.calls[0]![0].changes;
    expect(changes).not.toHaveProperty("menuBgColorOpacity");
  });

  it("auto-clears fontStyle to '' when custom typography is set", () => {
    const updateElement = mockUpdateElement();
    const pageRepository = { updateElement } as unknown as IPageRepository;
    const handlers = createBrizyToolHandlers(
      pageRepository,
      {} as IProjectRepository,
      {} as ISharedStore
    );

    handlers.updateMenuTypography({ elementId: "menu-1", fontSize: 20 });

    expect(updateElement).toHaveBeenCalledWith(
      expect.objectContaining({
        changes: expect.objectContaining({ fontSize: 20, fontStyle: "" })
      })
    );
  });
});

describe("updateMenu side write atomicity", () => {
  // horizontalAlign lives on the parent Wrapper, so updateMenu writes to two
  // elements. Each write is its own dispatch, so one undo cannot restore both.
  // Mirrors the real repository: an update succeeds only when the declared
  // elementType matches that element's actual type (page.repository.ts:1024).
  const harness = (targetType: string) => {
    const types: Record<string, string> = {
      "menu-1": "Menu",
      "btn-1": "Button",
      "wrap-9": "Wrapper"
    };
    const writes: UpdateArg[] = [];
    const updateElement = jest.fn((arg: UpdateArg) => {
      writes.push(arg);
      const actual = types[arg.elementId] ?? targetType;

      return arg.elementType === actual
        ? { success: true, data: {} }
        : {
            success: false,
            error: `Element "${arg.elementId}" is of type "${actual}", not "${arg.elementType}".`
          };
    });
    const getElementById = jest.fn(() => ({
      success: true,
      data: { value: {}, parentId: "wrap-9", parentType: "Wrapper" }
    }));

    const handlers = createBrizyToolHandlers(
      { updateElement, getElementById } as unknown as IPageRepository,
      {} as IProjectRepository,
      {} as ISharedStore
    );

    return { handlers, writes };
  };

  it("does not touch the parent Wrapper when the Menu update is rejected", async () => {
    // the target is a Button, so the Menu update fails
    const { handlers, writes } = harness("Button");

    const result = await handlers.updateMenuLayout({
      elementId: "btn-1",
      horizontalAlign: "right"
    });

    expect(result.success).toBe(false);
    expect(writes.map((w) => w.elementId)).not.toContain("wrap-9");
  });

  it("writes the alignment to the parent after a successful Menu update", async () => {
    const { handlers, writes } = harness("Menu");

    const result = await handlers.updateMenuLayout({
      elementId: "menu-1",
      horizontalAlign: "right"
    });

    expect(result.success).toBe(true);
    expect(writes).toEqual([
      expect.objectContaining({ elementId: "menu-1", elementType: "Menu" }),
      expect.objectContaining({
        elementId: "wrap-9",
        elementType: "Wrapper",
        changes: { horizontalAlign: "right" }
      })
    ]);
  });

  it("does not write to the parent when no alignment was requested", () => {
    const { handlers, writes } = harness("Menu");

    handlers.updateMenuLayout({ elementId: "menu-1", itemPadding: 10 });

    expect(writes.map((w) => w.elementId)).toEqual(["menu-1"]);
  });

  it("reports a failure when the parent alignment write is rejected", async () => {
    // The Menu update lands but the Wrapper write does not.
    const writes: UpdateArg[] = [];
    const updateElement = jest.fn((arg: UpdateArg) => {
      writes.push(arg);
      return arg.elementType === "Menu"
        ? { success: true, data: {} }
        : { success: false, error: "Wrapper rejected" };
    });
    const getElementById = jest.fn(() => ({
      success: true,
      data: { value: {}, parentId: "wrap-9", parentType: "Wrapper" }
    }));

    const handlers = createBrizyToolHandlers(
      { updateElement, getElementById } as unknown as IPageRepository,
      {} as IProjectRepository,
      {} as ISharedStore
    );

    const result = await handlers.updateMenuLayout({
      elementId: "menu-1",
      horizontalAlign: "right"
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("page alignment");
  });

  it("reports a failure when the Menu has no parent to align", async () => {
    const updateElement = jest.fn(() => ({ success: true, data: {} }));
    const getElementById = jest.fn(() => ({
      success: true,
      data: { value: {} }
    }));

    const handlers = createBrizyToolHandlers(
      { updateElement, getElementById } as unknown as IPageRepository,
      {} as IProjectRepository,
      {} as ISharedStore
    );

    const result = await handlers.updateMenuLayout({
      elementId: "menu-1",
      horizontalAlign: "right"
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("no parent container");
  });
});

describe("alias resolution", () => {
  it("executes the alias as well as the names, but advertises only the names", () => {
    const updateElement = mockUpdateElement();
    const handlers = createBrizyToolHandlers(
      { updateElement } as unknown as IPageRepository,
      {} as IProjectRepository,
      {} as ISharedStore
    );

    // ai-chatbot-api resolves an incoming call to its alias before emitting
    // it, so its own references survive a concern rename. Both names must
    // therefore reach the same handler.
    expect(typeof handlers.updateMenuTypography).toBe("function");
    expect(handlers.updateMenu).toBe(handlers.updateMenuTypography);

    // The catalog still offers only the split names: the alias is a call the
    // editor accepts, not a tool the model is shown.
    expect(getBrizyToolDefinitions(t).map((d) => d.name)).not.toContain(
      "updateMenu"
    );
  });
});
