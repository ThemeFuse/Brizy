import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxAction } from "visual/redux/actions2";
import { extraStyles } from "visual/redux/reducers/extraStyles";
import { styles } from "visual/redux/reducers/styles";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type { Palette, Style } from "visual/types/Style";
import { createProjectRepository } from "../project.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

const themePalette: Palette[] = [
  { id: "color1", hex: "#111111" },
  { id: "color2", hex: "#222222" },
  { id: "color3", hex: "#333333" },
  { id: "color4", hex: "#444444" },
  { id: "color5", hex: "#555555" },
  { id: "color6", hex: "#666666" },
  { id: "color7", hex: "#777777" },
  { id: "color8", hex: "#888888" }
];

const themeStyle: Style = {
  id: "theme-1",
  title: "Theme One",
  colorPalette: themePalette,
  fontStyles: [
    {
      id: "paragraph",
      title: "Paragraph",
      fontSize: 16,
      tabletFontSize: 15,
      mobileFontSize: 14
    },
    {
      id: "heading1",
      title: "Heading 1",
      fontSize: 32,
      tabletFontSize: 28,
      mobileFontSize: 24
    }
  ]
} as unknown as Style;

/**
 * Drives the real `styles` and `extraStyles` reducers so the slice a new style
 * lands in is decided by the store, not by the test.
 */
const makeRepository = (activeStyle: Style) => {
  const state: Pick<
    ReduxState,
    "styles" | "extraStyles" | "currentStyleId" | "currentStyle"
  > = {
    styles: [activeStyle],
    extraStyles: [],
    currentStyleId: activeStyle.id,
    currentStyle: activeStyle
  };

  const getState = () => state as ReduxState;

  const dispatched: ReduxAction[] = [];
  // ThunkDispatch is overloaded, so a jest.fn cannot satisfy it structurally.
  const dispatch = jest.fn((action: ReduxAction) => {
    dispatched.push(action);
    state.styles = styles(state.styles, action, getState());
    state.extraStyles = extraStyles(state.extraStyles, action, getState());
    return action;
  });

  return {
    repository: createProjectRepository(
      getState,
      dispatch as unknown as TypedDispatch,
      {} as ConfigCommon
    ),
    state,
    dispatched
  };
};

describe("ProjectRepository.changeStyle", () => {
  it("can select the style duplicateStyle just created", () => {
    const { repository, state, dispatched } = makeRepository(themeStyle);

    const duplicated = repository.duplicateStyle("Copy of Theme One");
    expect(duplicated.success).toBe(true);

    const styleId = duplicated.data?.newStyleId ?? "";

    // The store, not the test, decides which slice it lands in.
    expect(state.styles.map((s) => s.id)).not.toContain(styleId);
    expect(state.extraStyles.map((s) => s.id)).toContain(styleId);

    const changed = repository.changeStyle(styleId);

    expect(changed).toEqual({ success: true, data: { styleId } });
    expect(dispatched).toContainEqual(
      expect.objectContaining({ type: "UPDATE_CURRENT_STYLE_ID" })
    );
  });

  it.each([
    { case: "a style from the styles slice", styleId: "theme-1", ok: true },
    { case: "an unknown id", styleId: "nope-1", ok: false }
  ])("$case is selectable: $ok", ({ styleId, ok }) => {
    const { repository } = makeRepository(themeStyle);

    expect(repository.changeStyle(styleId).success).toBe(ok);
  });
});

describe("ProjectRepository font-style ids", () => {
  // mergeStyleUpdate `continue`s past an unmatched id, so requests are
  // all-or-nothing.
  it.each([
    {
      case: "every id is known",
      fontStyles: [{ id: "heading1", fontSize: 40 }],
      ok: true
    },
    {
      case: "an id is unknown",
      fontStyles: [{ id: "heading9", fontSize: 40 }],
      ok: false
    },
    {
      case: "known and unknown ids are mixed",
      fontStyles: [
        { id: "heading1", fontSize: 40 },
        { id: "heading9", fontSize: 40 }
      ],
      ok: false
    }
  ])("updateStyle succeeds when $case: $ok", ({ fontStyles, ok }) => {
    const { repository, dispatched } = makeRepository(themeStyle);

    const result = repository.updateStyle({ fontStyles });

    expect(result.success).toBe(ok);
    expect(dispatched.some((a) => a.type === "UPDATE_CURRENT_STYLE")).toBe(ok);
  });

  it("names the unknown id and the ids that are available", () => {
    const { repository } = makeRepository(themeStyle);

    const result = repository.updateStyle({
      fontStyles: [{ id: "heading9", fontSize: 40 }]
    });

    expect(result.error).toContain("heading9");
    expect(result.error).toContain("paragraph");
    expect(result.error).toContain("heading1");
  });

  // Each device renders the value stored for it, so a key written for one
  // must neither be dropped nor spill onto the other two.
  it.each([
    {
      case: "a desktop key",
      update: { fontSize: 40 },
      out: { fontSize: 40, tabletFontSize: 28, mobileFontSize: 24 }
    },
    {
      case: "a tablet key",
      update: { tabletFontSize: 30 },
      out: { fontSize: 32, tabletFontSize: 30, mobileFontSize: 24 }
    },
    {
      case: "a mobile key",
      update: { mobileFontSize: 20 },
      out: { fontSize: 32, tabletFontSize: 28, mobileFontSize: 20 }
    },
    {
      case: "all three devices at once",
      update: { fontSize: 40, tabletFontSize: 30, mobileFontSize: 20 },
      out: { fontSize: 40, tabletFontSize: 30, mobileFontSize: 20 }
    }
  ])(
    "updateStyle applies $case and leaves the other devices alone",
    ({ update, out }) => {
      const { repository, state } = makeRepository(themeStyle);

      const styleId = repository.updateStyle({
        fontStyles: [{ id: "heading1", ...update }]
      }).data?.styleId;

      const heading1 = state.styles
        .find((style) => style.id === styleId)
        ?.fontStyles.find((fs) => fs.id === "heading1");

      expect(heading1).toMatchObject(out);
    }
  );

  it("reads back the tablet and mobile values updateStyle can write", () => {
    const { repository } = makeRepository(themeStyle);

    const heading1 = repository
      .getProjectStyles()
      .data?.currentStyle.fontStyles.find((fs) => fs.id === "heading1");

    expect(heading1).toMatchObject({
      fontSize: 32,
      tabletFontSize: 28,
      mobileFontSize: 24
    });
  });
});

describe("ProjectRepository.updateColorPalette", () => {
  // A palette colour is asked for one slot at a time, so the slots that were
  // not sent have to come through untouched.
  it.each([
    {
      case: "one slot",
      slots: [{ id: "color3", hex: "#1A237E" }],
      out: [
        "#111111",
        "#222222",
        "#1A237E",
        "#444444",
        "#555555",
        "#666666",
        "#777777",
        "#888888"
      ]
    },
    {
      case: "several slots",
      slots: [
        { id: "color8", hex: "#FFFFFF" },
        { id: "color1", hex: "#000000" }
      ],
      out: [
        "#000000",
        "#222222",
        "#333333",
        "#444444",
        "#555555",
        "#666666",
        "#777777",
        "#FFFFFF"
      ]
    },
    {
      case: "a slot sent twice, keeping the later colour",
      slots: [
        { id: "color2", hex: "#AAAAAA" },
        { id: "color2", hex: "#BBBBBB" }
      ],
      out: [
        "#111111",
        "#BBBBBB",
        "#333333",
        "#444444",
        "#555555",
        "#666666",
        "#777777",
        "#888888"
      ]
    }
  ] satisfies { case: string; slots: Palette[]; out: string[] }[])(
    "changes $case and leaves the other slots alone",
    ({ slots, out }) => {
      const { repository, state } = makeRepository(themeStyle);

      const styleId = repository.updateColorPalette({ colorPalette: slots })
        .data?.styleId;

      const written = state.styles.find((style) => style.id === styleId);

      expect(written?.colorPalette.map((color) => color.hex)).toEqual(out);
      expect(written?.colorPalette.map((color) => color.id)).toEqual(
        themePalette.map((color) => color.id)
      );
    }
  );

  it("refuses the whole request when the active style lacks a slot", () => {
    const { repository, dispatched } = makeRepository({
      ...themeStyle,
      colorPalette: themePalette.slice(0, 7)
    });

    const result = repository.updateColorPalette({
      colorPalette: [
        { id: "color1", hex: "#000000" },
        { id: "color8", hex: "#FFFFFF" }
      ]
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("color8");
    expect(dispatched).toHaveLength(0);
  });
});
