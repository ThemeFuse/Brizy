import type { ISharedStore } from "visual/plugins/SharedStore";
import type { IPageRepository } from "../../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../../application/interfaces/i-project-repository";
import { createBrizyToolHandlers } from "../tool-registry";

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

/**
 * A stored colour is a pair — `<name>ColorHex` and `<name>ColorPalette` — and
 * the palette slot wins while it holds a slot id. An LLM sends the hex on its
 * own, so unless the palette is cleared alongside it the value is written and
 * never painted: the call succeeds and the colour does not change.
 *
 * The pairing used to be a hand-maintained list of hex/palette names applied by
 * whichever configs remembered to opt in, which is a silent failure every time
 * an element gains a colour. It is now derived from the key and applied in
 * `handler-factory` for every element, so these cases are the prefixed colours
 * that list never had.
 */
const makeHandlers = () => {
  const updateElement = jest.fn(() => ({ success: true, data: {} }));
  const updateColumn = jest.fn(() => ({ success: true, data: {} }));
  const getElementById = jest.fn(() => ({
    success: true,
    data: { id: "el-1", type: "Menu", value: {} }
  }));

  const pageRepository = {
    updateElement,
    updateColumn,
    getElementById
  } as unknown as IPageRepository;

  const projectRepository = {
    fontExists: jest.fn().mockReturnValue(true)
  } as unknown as IProjectRepository;

  return {
    handlers: createBrizyToolHandlers(
      pageRepository,
      projectRepository,
      {} as ISharedStore
    ),
    changes: (): Record<string, unknown> => {
      const call =
        updateElement.mock.calls[0] ?? updateColumn.mock.calls[0] ?? undefined;
      const [arg] = (call ?? []) as [{ changes: Record<string, unknown> }?];
      return arg?.changes ?? {};
    }
  };
};

describe("a hex sent without its palette slot clears that slot", () => {
  it.each([
    {
      case: "a bare colour",
      tool: "updateCounterColor",
      args: { colorHex: "#FF0000" },
      cleared: "colorPalette"
    },
    {
      case: "a hover colour",
      tool: "updateCounterHoverColor",
      args: { hoverColorHex: "#FF0000" },
      cleared: "hoverColorPalette"
    },
    {
      case: "a hamburger drawer's links",
      tool: "updateMenuDrawerColor",
      args: { mMenuColorHex: "#FFFFFF" },
      cleared: "mMenuColorPalette"
    },
    {
      case: "a dropdown submenu's background",
      tool: "updateMenuDropdownBackground",
      args: { subMenuBgColorHex: "#101010" },
      cleared: "subMenuBgColorPalette"
    },
    {
      case: "a star rating's filled stars",
      tool: "updateStarRatingActive",
      args: { ratingColorHex: "#FFD700" },
      cleared: "ratingColorPalette"
    },
    {
      case: "a progress bar's empty track",
      tool: "updateProgressBarBackground",
      args: { bg2ColorHex: "#EEEEEE" },
      cleared: "bg2ColorPalette"
    },
    {
      case: "a countdown's digits",
      tool: "updateCountdownDataColor",
      args: { numberColorHex: "#222222" },
      cleared: "numberColorPalette"
    },
    {
      case: "a carousel's dots",
      tool: "updateCarouselMarker",
      args: { sliderDotsColorHex: "#333333" },
      cleared: "sliderDotsColorPalette"
    },
    {
      case: "a timeline's connector line",
      tool: "updateTimelineConnector",
      args: { lineBorderColorHex: "#888888" },
      cleared: "lineBorderColorPalette"
    }
  ])("clears the slot for $case", async ({ tool, args, cleared }) => {
    const { handlers, changes } = makeHandlers();

    await handlers[tool]({ elementId: "el-1", ...args });

    expect(changes()).toMatchObject({ ...args, [cleared]: "" });
  });

  it("leaves a palette slot the caller chose on purpose", async () => {
    const { handlers, changes } = makeHandlers();

    await handlers.updateCounterColor({
      elementId: "el-1",
      colorHex: "#FF0000",
      colorPalette: "color3"
    });

    expect(changes()).toMatchObject({ colorPalette: "color3" });
  });
});
