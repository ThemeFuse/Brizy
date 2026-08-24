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

describe("updateMenu registration", () => {
  it("is exposed as a tool definition", () => {
    const names = getBrizyToolDefinitions(t).map((d) => d.name);
    expect(names).toContain("updateMenu");
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

    expect(typeof handlers.updateMenu).toBe("function");

    handlers.updateMenu({
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

    handlers.updateMenu({
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

    handlers.updateMenu({ elementId: "menu-1", menuBgColorHex: "#ff0000" });

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

    handlers.updateMenu({ elementId: "menu-1", menuBgColorHex: "#ff0000" });

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

    handlers.updateMenu({ elementId: "menu-1", fontSize: 20 });

    expect(updateElement).toHaveBeenCalledWith(
      expect.objectContaining({
        changes: expect.objectContaining({ fontSize: 20, fontStyle: "" })
      })
    );
  });
});
