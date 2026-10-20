import { createBrizyToolHandlers } from "visual/ai/adapters/tool-registry";
import type { IPageRepository } from "visual/ai/application/interfaces/i-page-repository";
import type { IProjectRepository } from "visual/ai/application/interfaces/i-project-repository";
import { SharedStore } from "visual/plugins/SharedStore";

jest.mock("visual/ai/utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

/**
 * Tablet and mobile values, driven through the tools that carry them.
 *
 * A device tool shares its element's handler, so everything stateful that
 * handler does for a desktop value has to hold for the device one too: the
 * render flag beside it, the palette slot a hex clears, the parent a Menu's
 * alignment really lives on. Each of those is silent when it is missing — the
 * call succeeds and the page does not change on that device.
 */
class FakePageRepository implements IPageRepository {
  constructor(stored: Record<string, unknown>) {
    this.getElementById.mockReturnValue({
      success: true,
      data: {
        id: "el-1",
        type: "Menu",
        path: [],
        value: stored,
        parentId: "wrapper-1",
        parentType: "Wrapper"
      }
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
  addElement = jest.fn();
  removeElement = jest.fn();
  updateElement = jest.fn().mockReturnValue({ success: true, data: {} });
  updateColumn = jest.fn().mockReturnValue({ success: true, data: {} });
  duplicateElement = jest.fn();
  moveElement = jest.fn();
  updateRichText = jest.fn().mockReturnValue({ success: true, data: {} });
  getAvailableIcons = jest.fn();
  getAvailableMenus = jest.fn();
  isPro = jest.fn();
  setPageStatus = jest.fn();
  undo = jest.fn();
}

class FakeProjectRepository implements IProjectRepository {
  getProjectStyles = jest.fn();
  changeStyle = jest.fn();
  updateStyle = jest.fn();
  updateColorPalette = jest.fn();
  duplicateStyle = jest.fn();
  getProjectFonts = jest.fn();
  getGoogleFonts = jest.fn();
  addFont = jest.fn();
  deleteFont = jest.fn();
  changeDefaultFont = jest.fn();
  fontExists = jest.fn().mockReturnValue(true);
}

const setup = (stored: Record<string, unknown>) => {
  const repo = new FakePageRepository(stored);
  const handlers = createBrizyToolHandlers(
    repo,
    new FakeProjectRepository(),
    new SharedStore()
  );
  return { handlers, repo };
};

describe("a device value is written with what it needs to paint", () => {
  it.each([
    {
      case: "a tablet padding side, through the shared flow",
      tool: "updateRowPaddingTablet",
      method: "updateElement" as const,
      args: { tabletPaddingTop: 20 },
      out: { tabletPaddingTop: 20, tabletPaddingType: "ungrouped" }
    },
    {
      case: "a mobile background hex, clearing that device's palette slot",
      tool: "updateRowBackgroundMobile",
      method: "updateElement" as const,
      args: { mobileBgColorHex: "#101010" },
      out: { mobileBgColorHex: "#101010", mobileBgColorPalette: "" }
    },
    {
      case: "a button's tablet padding, through its own handler",
      tool: "updateButtonPaddingTablet",
      method: "updateElement" as const,
      args: { tabletPaddingTB: 18 },
      out: { tabletPaddingTB: 18, tabletSize: "custom" }
    },
    {
      case: "a button's mobile font size, leaving the mobile preset",
      tool: "updateButtonTypographyMobile",
      method: "updateElement" as const,
      args: { mobileFontSize: 14 },
      out: { mobileFontSize: 14, mobileFontStyle: "" }
    },
    {
      case: "a column's tablet shadow, through its own handler",
      tool: "updateColumnShadowTablet",
      method: "updateColumn" as const,
      args: { tabletBoxShadowBlur: 6 },
      out: { tabletBoxShadowBlur: 6, tabletBoxShadow: "on" }
    },
    {
      case: "a column's mobile width, alone",
      tool: "updateColumnWidthMobile",
      method: "updateColumn" as const,
      args: { mobileWidth: 100 },
      out: { mobileWidth: 100 }
    },
    {
      case: "a row's reversed column order on mobile",
      tool: "updateRowColumnOrderMobile",
      method: "updateElement" as const,
      args: { mobileReverseColumns: "on" },
      out: { mobileReverseColumns: "on" }
    },
    {
      case: "an active-state colour under its state-first key",
      tool: "updateSwitcherActiveTablet",
      method: "updateElement" as const,
      args: { activeTabletColorHex: "#ff0000" },
      out: { activeTabletColorHex: "#ff0000", activeTabletColorPalette: "" }
    }
  ])("writes $case", async ({ tool, method, args, out }) => {
    const { handlers, repo } = setup({});

    const result = await handlers[tool]({ elementId: "el-1", ...args });

    expect(result).toMatchObject({ success: true });
    expect(repo[method]).toHaveBeenCalledWith(
      expect.objectContaining({ elementId: "el-1", changes: out })
    );
  });

  it("drops a device key the element does not make responsive", async () => {
    // A link has one value for every screen; the toolbar hides it off desktop.
    const { handlers, repo } = setup({});

    await handlers.updateButtonLink({
      elementId: "el-1",
      linkExternal: "https://example.com",
      tabletLinkExternal: "https://tablet.example.com"
    });

    expect(repo.updateElement).toHaveBeenCalledWith(
      expect.objectContaining({
        changes: expect.not.objectContaining({
          tabletLinkExternal: expect.anything()
        })
      })
    );
  });

  it("hands a text block's device typography to the markup rewrite", async () => {
    const { handlers, repo } = setup({});

    await handlers.updateTextTypographyTablet({
      elementId: "el-1",
      tabletFontSize: 18
    });

    expect(repo.updateRichText).toHaveBeenCalledWith(
      expect.objectContaining({ elementId: "el-1", tabletFontSize: 18 })
    );
  });
});

describe("a Menu's device values follow which menu that device shows", () => {
  // A device paints the bar of links or the hamburger drawer, never both, and
  // the Menu ships as a drawer on tablet and mobile.
  it.each([
    {
      case: "a bar colour on tablet while tablet is a drawer by default",
      tool: "updateMenuColorTablet",
      stored: {},
      args: { tabletColorHex: "#111111" },
      refusedOver: "tabletMMenu"
    },
    {
      case: "a bar colour on tablet once tablet shows the bar",
      tool: "updateMenuColorTablet",
      stored: { tabletMMenu: "off" },
      args: { tabletColorHex: "#111111" },
      refusedOver: undefined
    },
    {
      case: "a bar colour sent together with the switch to the bar",
      tool: "updateMenuColorTablet",
      stored: {},
      args: { tabletMMenu: "off", tabletColorHex: "#111111" },
      refusedOver: undefined
    },
    {
      case: "a drawer colour on mobile while mobile is a drawer",
      tool: "updateMenuDrawerColorMobile",
      stored: {},
      args: { mobileMMenuColorHex: "#111111" },
      refusedOver: undefined
    },
    {
      case: "a drawer colour on mobile while mobile shows the bar",
      tool: "updateMenuDrawerColorMobile",
      stored: { mobileMMenu: "off" },
      args: { mobileMMenuColorHex: "#111111" },
      refusedOver: "mobileMMenu"
    },
    {
      case: "a tablet value while only mobile shows the bar",
      tool: "updateMenuColorTablet",
      stored: { mobileMMenu: "off" },
      args: { tabletColorHex: "#111111" },
      refusedOver: "tabletMMenu"
    },
    {
      case: "a desktop colour, whatever the devices show",
      tool: "updateMenuColor",
      stored: {},
      args: { colorHex: "#111111" },
      refusedOver: undefined
    },
    {
      case: "the hamburger switch itself",
      tool: "updateMenuSettingsTablet",
      stored: {},
      args: { tabletMMenu: "off" },
      refusedOver: undefined
    }
  ])("$case", async ({ tool, stored, args, refusedOver }) => {
    const { handlers, repo } = setup(stored);

    const result = await handlers[tool]({ elementId: "el-1", ...args });

    if (refusedOver === undefined) {
      expect(result).toMatchObject({ success: true });
      expect(repo.updateElement).toHaveBeenCalledWith(
        expect.objectContaining({
          elementId: "el-1",
          changes: expect.objectContaining(args)
        })
      );
    } else {
      expect(result).toMatchObject({ success: false });
      expect(result.error).toContain(refusedOver);
      expect(repo.updateElement).not.toHaveBeenCalled();
    }
  });

  it("sends a device alignment to the parent Wrapper, under its device key", async () => {
    const { handlers, repo } = setup({});

    await handlers.updateMenuLayoutTablet({
      elementId: "el-1",
      tabletHorizontalAlign: "center",
      tabletVerticalMode: "vertical"
    });

    expect(repo.updateElement).toHaveBeenCalledWith({
      elementId: "wrapper-1",
      elementType: "Wrapper",
      changes: { tabletHorizontalAlign: "center" }
    });
    expect(repo.updateElement).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: "el-1",
        changes: { tabletVerticalMode: "vertical" }
      })
    );
  });

  it.each([
    {
      case: "leaves a translucent colour alone when the device follows desktop",
      stored: { tabletMMenu: "off", menuBgColorOpacity: 0.5 },
      opacity: undefined
    },
    {
      case: "restores desktop's remembered opacity when desktop is transparent",
      stored: {
        tabletMMenu: "off",
        menuBgColorOpacity: 0,
        tempMenuBgColorOpacity: 0.8
      },
      opacity: 0.8
    },
    {
      case: "prefers the device's own opacity over desktop's",
      stored: {
        tabletMMenu: "off",
        menuBgColorOpacity: 0,
        tabletMenuBgColorOpacity: 0.4
      },
      opacity: undefined
    },
    {
      case: "makes it solid when nothing was ever remembered",
      stored: { tabletMMenu: "off", menuBgColorOpacity: 0 },
      opacity: 1
    }
  ])("a tablet hex $case", async ({ stored, opacity }) => {
    const { handlers, repo } = setup(stored);

    await handlers.updateMenuBackgroundTablet({
      elementId: "el-1",
      tabletMenuBgColorHex: "#ff0000"
    });

    const expected =
      opacity === undefined
        ? expect.not.objectContaining({
            tabletMenuBgColorOpacity: expect.anything()
          })
        : expect.objectContaining({ tabletMenuBgColorOpacity: opacity });
    expect(repo.updateElement).toHaveBeenCalledWith(
      expect.objectContaining({ changes: expected })
    );
  });
});
