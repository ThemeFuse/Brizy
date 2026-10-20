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

/** Handlers wired to a ResetPassword whose stored value is `stored`. */
const setup = (stored: Record<string, unknown> = {}, fontExists = true) => {
  const updateElement = jest.fn((_arg: UpdateArg) => ({
    success: true,
    data: {}
  }));
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

describe("addResetPassword", () => {
  it("creates a ResetPassword in the container with its message props", () => {
    const addElement = jest.fn(() => ({ success: true, data: {} }));
    const handlers = createBrizyToolHandlers(
      { addElement } as unknown as IPageRepository,
      { fontExists: () => true } as unknown as IProjectRepository,
      {} as ISharedStore
    );

    const result = handlers.addResetPassword({
      containerId: "col-1",
      insertIndex: 2,
      passMatchError: "Those do not match"
    });

    expect(result).toMatchObject({ success: true });
    expect(addElement).toHaveBeenCalledWith({
      containerId: "col-1",
      elementType: "ResetPassword",
      insertIndex: 2,
      initialProperties: { passMatchError: "Those do not match" }
    });
  });
});

describe("updateResetPassword", () => {
  it("is exposed as several tools that share one handler", () => {
    const tools = getBrizyToolDefinitions(t).filter(
      (d) => d.alias === "updateResetPassword"
    );

    expect(tools.length).toBeGreaterThan(1);
    for (const tool of tools) {
      expect(Object.keys(tool.parameters.properties)).toContain("elementId");
    }
  });

  // Each row drives a different split tool name, which incidentally proves the
  // alias fan-out reaches one handler.
  const inferenceCases: ReadonlyArray<{
    case: string;
    tool: string;
    args: Record<string, unknown>;
    expected: Record<string, unknown>;
  }> = [
    {
      case: "sets the shadow flag so a drop shadow renders",
      tool: "updateResetPasswordShadow",
      args: { boxShadowBlur: 12 },
      expected: { boxShadowBlur: 12, boxShadow: "on" }
    },
    {
      case: "groups the border width so it renders",
      tool: "updateResetPasswordBorder",
      args: { borderWidth: 3 },
      expected: { borderWidth: 3, borderWidthType: "grouped" }
    },
    {
      case: "groups a single corner radius",
      tool: "updateResetPasswordBorderRadius",
      args: { borderRadius: 8 },
      expected: { borderRadius: 8, borderRadiusType: "grouped" }
    },
    {
      case: "ungroups a per-corner radius",
      tool: "updateResetPasswordBorderRadius",
      args: { borderTopLeftRadius: 8 },
      expected: { borderTopLeftRadius: 8, borderRadiusType: "ungrouped" }
    },
    {
      case: "ungroups padding when one side is sent",
      tool: "updateResetPasswordPadding",
      args: { paddingTop: 20 },
      expected: { paddingTop: 20, paddingType: "ungrouped" }
    },
    {
      // fontStyle defaults to a global preset, which wins over the element's
      // own size and weight until it is cleared.
      case: "clears the input type preset when a custom size is sent",
      tool: "updateResetPasswordTypography",
      args: { fontSize: 20 },
      expected: { fontSize: 20, fontStyle: "" }
    },
    {
      case: "clears the label type preset independently of the input one",
      tool: "updateResetPasswordLabel",
      args: { labelFontSize: 18 },
      expected: { labelFontSize: 18, labelFontStyle: "" }
    },
    {
      case: "clears the palette slot when a label colour hex is sent",
      tool: "updateResetPasswordLabel",
      args: { labelColorHex: "#112233" },
      expected: { labelColorHex: "#112233", labelColorPalette: "" }
    }
  ];

  it.each(inferenceCases)("$case", ({ tool, args, expected }) => {
    const { handlers, updateElement } = setup();

    handlers[tool]({ elementId: "rp-1", ...args });

    expect(updateElement.mock.calls[0]![0]).toMatchObject({
      elementType: "ResetPassword",
      changes: expect.objectContaining(expected)
    });
  });

  // The password boxes ship with bgColorOpacity 0 — the toolbar's "no
  // background" state. Without restoring it a hex-only edit reports success
  // and changes nothing on screen.
  it("restores opacity when a bg hex lands on a transparent colour", () => {
    const { handlers, updateElement } = setup({ bgColorOpacity: 0 });

    handlers.updateResetPasswordBackground({
      elementId: "rp-1",
      bgColorHex: "#ff0000"
    });

    expect(updateElement.mock.calls[0]![0].changes).toMatchObject({
      bgColorHex: "#ff0000",
      bgColorPalette: "",
      bgColorOpacity: 1
    });
  });

  it("does not clobber a stored non-zero opacity on a hex-only edit", () => {
    const { handlers, updateElement } = setup({ bgColorOpacity: 0.5 });

    handlers.updateResetPasswordBackground({
      elementId: "rp-1",
      bgColorHex: "#ff0000"
    });

    expect(updateElement.mock.calls[0]![0].changes).not.toHaveProperty(
      "bgColorOpacity"
    );
  });

  it("respects an explicitly sent opacity", () => {
    const { handlers, updateElement } = setup({ bgColorOpacity: 0 });

    handlers.updateResetPasswordBackground({
      elementId: "rp-1",
      bgColorHex: "#ff0000",
      bgColorOpacity: 0.2
    });

    expect(updateElement.mock.calls[0]![0].changes).toMatchObject({
      bgColorOpacity: 0.2
    });
  });

  it("rejects a font that is not in the project", () => {
    const { handlers, updateElement } = setup({}, false);

    const result = handlers.updateResetPasswordTypography({
      elementId: "rp-1",
      fontFamily: "comic_sans"
    });

    expect(result).toMatchObject({ success: false });
    expect((result as { error: string }).error).toContain("getProjectFonts");
    expect(updateElement).not.toHaveBeenCalled();
  });
});
