import {
  createBrizyToolHandlers,
  getBrizyToolDefinitions
} from "visual/ai/adapters/tool-registry";
import type { IPageRepository } from "visual/ai/application/interfaces/i-page-repository";
import type { IProjectRepository } from "visual/ai/application/interfaces/i-project-repository";
import type { ISharedStore } from "visual/plugins/SharedStore";

const t = (key: string): string => key;

jest.mock("visual/ai/utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

interface UpdateArg {
  elementId: string;
  elementType?: string;
  changes: Record<string, unknown>;
}

const mockUpdateElement = () =>
  jest.fn((_arg: UpdateArg) => ({ success: true, data: {} }));

/** Handlers wired to a ProtectedPage whose stored value is `stored`. */
const setup = (stored: Record<string, unknown> = {}, fontExists = true) => {
  const updateElement = mockUpdateElement();
  const pageRepository = {
    updateElement,
    getElementById: jest.fn(() => ({ success: true, data: { value: stored } }))
  } as unknown as IPageRepository;

  const handlers = createBrizyToolHandlers(
    pageRepository,
    { fontExists: () => fontExists } as unknown as IProjectRepository,
    {} as ISharedStore
  );

  return { handlers, updateElement };
};

describe("addProtectedForm", () => {
  it("creates a ProtectedPage in the container with its content props", () => {
    const addElement = jest.fn(() => ({ success: true, data: {} }));
    const handlers = createBrizyToolHandlers(
      { addElement } as unknown as IPageRepository,
      { fontExists: () => true } as unknown as IProjectRepository,
      {} as ISharedStore
    );

    const result = handlers.addProtectedForm({
      containerId: "col-1",
      insertIndex: 2,
      label: "Enter code"
    });

    expect(result).toMatchObject({ success: true });
    expect(addElement).toHaveBeenCalledWith({
      containerId: "col-1",
      elementType: "ProtectedPage",
      insertIndex: 2,
      initialProperties: { label: "Enter code" }
    });
  });
});

describe("updateProtectedForm", () => {
  it("is exposed as several tools that share one handler", () => {
    const tools = getBrizyToolDefinitions(t).filter(
      (d) => d.alias === "updateProtectedForm"
    );

    expect(tools.length).toBeGreaterThan(1);
    for (const tool of tools) {
      expect(Object.keys(tool.parameters.properties)).toContain("elementId");
    }
  });

  // defaultValue.json ships bgColorOpacity 0 — the toolbar's "no background"
  // state. Without this a hex-only edit reports success but changes nothing
  // on screen.
  it("restores opacity when a bg hex lands on a transparent color", () => {
    const { handlers, updateElement } = setup({ bgColorOpacity: 0 });

    handlers.updateProtectedFormBackground({
      elementId: "pp-1",
      bgColorHex: "#ff0000"
    });

    expect(updateElement).toHaveBeenCalledWith(
      expect.objectContaining({
        elementType: "ProtectedPage",
        changes: expect.objectContaining({
          bgColorHex: "#ff0000",
          bgColorPalette: "", // withColorDefaults
          bgColorOpacity: 1 // restored
        })
      })
    );
  });

  it("does not clobber a stored non-zero opacity on a hex-only edit", () => {
    const { handlers, updateElement } = setup({ bgColorOpacity: 0.5 });

    handlers.updateProtectedFormBackground({
      elementId: "pp-1",
      bgColorHex: "#ff0000"
    });

    expect(updateElement.mock.calls[0]![0].changes).not.toHaveProperty(
      "bgColorOpacity"
    );
  });

  it("respects an explicitly sent opacity", () => {
    const { handlers, updateElement } = setup({ bgColorOpacity: 0 });

    handlers.updateProtectedFormBackground({
      elementId: "pp-1",
      bgColorHex: "#ff0000",
      bgColorOpacity: 0.2
    });

    expect(updateElement.mock.calls[0]![0].changes).toMatchObject({
      bgColorOpacity: 0.2
    });
  });

  // typographyFontStyle defaults to "paragraph"; the global preset wins over
  // the element's own size/weight until it is cleared.
  it("clears typographyFontStyle when custom typography is set", () => {
    const { handlers, updateElement } = setup();

    handlers.updateProtectedFormTypography({
      elementId: "pp-1",
      typographyFontSize: 20
    });

    expect(updateElement.mock.calls[0]![0].changes).toMatchObject({
      typographyFontSize: 20,
      typographyFontStyle: ""
    });
  });

  it("forces grouped types so borderWidth/borderRadius render", () => {
    const { handlers, updateElement } = setup();

    handlers.updateProtectedFormBorder({
      elementId: "pp-1",
      borderWidth: 3,
      borderRadius: 8
    });

    expect(updateElement.mock.calls[0]![0].changes).toMatchObject({
      borderWidth: 3,
      borderWidthType: "grouped",
      borderRadius: 8,
      borderRadiusType: "grouped"
    });
  });

  it("rejects a font that is not in the project", () => {
    const { handlers, updateElement } = setup({}, false);

    const result = handlers.updateProtectedFormTypography({
      elementId: "pp-1",
      typographyFontFamily: "comic_sans"
    });

    expect(result).toMatchObject({ success: false });
    expect((result as { error: string }).error).toContain("getProjectFonts");
    expect(updateElement).not.toHaveBeenCalled();
  });
});
