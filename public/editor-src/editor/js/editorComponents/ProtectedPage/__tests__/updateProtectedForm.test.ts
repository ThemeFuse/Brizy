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

describe("updateProtectedForm", () => {
  it("is exposed as a tool definition", () => {
    const names = getBrizyToolDefinitions(t).map((d) => d.name);
    expect(names).toContain("updateProtectedForm");
  });

  it("stays within the 20-property budget ai-db-api splits on", () => {
    const def = getBrizyToolDefinitions(t).find(
      (d) => d.name === "updateProtectedForm"
    );
    const props = Object.keys(def!.parameters.properties ?? {});

    expect(props).toContain("elementId");
    expect(props.length).toBeLessThanOrEqual(20);
  });

  // defaultValue.json ships bgColorOpacity 0 — the toolbar's "no background"
  // state. Without this a hex-only edit reports success but changes nothing
  // on screen.
  it("restores opacity when a bg hex lands on a transparent color", () => {
    const { handlers, updateElement } = setup({ bgColorOpacity: 0 });

    handlers.updateProtectedForm({
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

    handlers.updateProtectedForm({ elementId: "pp-1", bgColorHex: "#ff0000" });

    expect(updateElement.mock.calls[0]![0].changes).not.toHaveProperty(
      "bgColorOpacity"
    );
  });

  it("respects an explicitly sent opacity", () => {
    const { handlers, updateElement } = setup({ bgColorOpacity: 0 });

    handlers.updateProtectedForm({
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

    handlers.updateProtectedForm({
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

    handlers.updateProtectedForm({
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

    const result = handlers.updateProtectedForm({
      elementId: "pp-1",
      typographyFontFamily: "comic_sans"
    });

    expect(result).toMatchObject({ success: false });
    expect((result as { error: string }).error).toContain("getProjectFonts");
    expect(updateElement).not.toHaveBeenCalled();
  });
});
