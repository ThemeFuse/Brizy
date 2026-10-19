import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxAction } from "visual/redux/actions2";
import { extraStyles } from "visual/redux/reducers/extraStyles";
import { styles } from "visual/redux/reducers/styles";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type { Style } from "visual/types/Style";
import { createProjectRepository } from "../project.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

const themeStyle: Style = {
  id: "theme-1",
  title: "Theme One",
  colorPalette: [],
  fontStyles: [
    { id: "paragraph", title: "Paragraph", fontSize: 16 },
    { id: "heading1", title: "Heading 1", fontSize: 32 }
  ]
} as unknown as Style;

/**
 * Drives the real `styles` and `extraStyles` reducers so the slice a new style
 * lands in is decided by the store, not by the test.
 */
const makeRepository = () => {
  const state: Pick<
    ReduxState,
    "styles" | "extraStyles" | "currentStyleId" | "currentStyle"
  > = {
    styles: [themeStyle],
    extraStyles: [],
    currentStyleId: "theme-1",
    currentStyle: themeStyle
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
  it("can select the style addStyle just created", () => {
    const { repository, state, dispatched } = makeRepository();

    const added = repository.addStyle({ title: "Brand Blue" });
    expect(added.success).toBe(true);

    const styleId = added.data?.styleId ?? "";

    // The store, not the test, decides which slice it lands in.
    expect(state.styles.map((s) => s.id)).not.toContain(styleId);
    expect(state.extraStyles.map((s) => s.id)).toContain(styleId);

    const changed = repository.changeStyle(styleId);

    expect(changed).toEqual({ success: true, data: { styleId } });
    expect(dispatched).toContainEqual(
      expect.objectContaining({ type: "UPDATE_CURRENT_STYLE_ID" })
    );
  });

  it("can select the style duplicateStyle just created", () => {
    const { repository, state } = makeRepository();

    const duplicated = repository.duplicateStyle("Copy of Theme One");
    const styleId = duplicated.data?.newStyleId ?? "";

    expect(state.extraStyles.map((s) => s.id)).toContain(styleId);
    expect(repository.changeStyle(styleId).success).toBe(true);
  });

  it.each([
    { case: "a style from the styles slice", styleId: "theme-1", ok: true },
    { case: "an unknown id", styleId: "nope-1", ok: false }
  ])("$case is selectable: $ok", ({ styleId, ok }) => {
    const { repository } = makeRepository();

    expect(repository.changeStyle(styleId).success).toBe(ok);
  });
});

describe("ProjectRepository font-style ids", () => {
  // mergeStyleUpdate and buildNewStyle both `continue` past an unmatched id,
  // so requests are all-or-nothing.
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
    const { repository, dispatched } = makeRepository();

    const result = repository.updateStyle({ fontStyles });

    expect(result.success).toBe(ok);
    expect(dispatched.some((a) => a.type === "UPDATE_CURRENT_STYLE")).toBe(ok);
  });

  it("names the unknown id and the ids that are available", () => {
    const { repository } = makeRepository();

    const result = repository.updateStyle({
      fontStyles: [{ id: "heading9", fontSize: 40 }]
    });

    expect(result.error).toContain("heading9");
    expect(result.error).toContain("paragraph");
    expect(result.error).toContain("heading1");
  });

  it("actually applies the change when the ids are known", () => {
    const { repository, dispatched } = makeRepository();

    repository.updateStyle({ fontStyles: [{ id: "heading1", fontSize: 40 }] });

    const written = dispatched.find((a) => a.type === "UPDATE_CURRENT_STYLE");
    const heading1 = written?.payload?.fontStyles?.find(
      (fs: { id: string }) => fs.id === "heading1"
    );

    expect(heading1?.fontSize).toBe(40);
  });

  it("addStyle refuses an unknown font style id too", () => {
    const { repository, dispatched } = makeRepository();

    const result = repository.addStyle({
      title: "Brand",
      fontStyles: [{ id: "heading9", fontSize: 40 }]
    });

    expect(result.success).toBe(false);
    expect(dispatched).toHaveLength(0);
  });
});
