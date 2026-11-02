import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxAction } from "visual/redux/actions2";
import { getDefaultFontDetailsSelector } from "visual/redux/selectors";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import { createProjectRepository } from "../project.repository";

jest.mock("../../../utils/logger", () => ({
  log: { repository: jest.fn(), tools: jest.fn() }
}));

// Only the network call is mocked; the id derivation and the selector are real.
jest.mock("visual/utils/fonts/getGoogleFonts", () => ({
  getGoogleFonts: jest.fn(async () => [
    { family: "Roboto", category: "sans-serif", variants: ["400"] },
    { family: "Open Sans", category: "sans-serif", variants: ["400"] }
  ])
}));

const projectFonts = {
  google: {
    data: [
      { family: "Roboto", category: "sans-serif", variants: ["400"] },
      { family: "Open Sans", category: "sans-serif", variants: ["400"] }
    ]
  }
};

const makeRepository = () => {
  const state = { fonts: projectFonts, project: { data: { font: "roboto" } } };

  const dispatched: ReduxAction[] = [];
  // ThunkDispatch is overloaded, so a jest.fn cannot satisfy it structurally.
  const dispatch = jest.fn((action: ReduxAction) => {
    dispatched.push(action);
    return action;
  });

  const getState = () => state as unknown as ReduxState;

  return {
    repository: createProjectRepository(
      getState,
      dispatch as unknown as TypedDispatch,
      {} as ConfigCommon
    ),
    dispatched,
    // Resolve a dispatched default through the REAL selector.
    resolve: (font: string) =>
      getDefaultFontDetailsSelector({
        ...state,
        project: { data: { font } }
      } as unknown as ReduxState)
  };
};

const defaultFontPayload = (dispatched: ReduxAction[]): string | undefined =>
  dispatched.find((a) => a.type === "UPDATE_DEFAULT_FONT")?.payload;

describe("ProjectRepository default font", () => {
  // project.data.font is read as an id (tripId of the family), not a family.
  it.each([
    { case: "a single-word family", family: "Roboto", id: "roboto" },
    { case: "a multi-word family", family: "Open Sans", id: "open_sans" }
  ])(
    "addFont({ setAsDefault }) with $case resolves back to that family",
    async ({ family, id }) => {
      const { repository, dispatched, resolve } = makeRepository();

      const result = await repository.addFont({
        type: "google",
        family,
        setAsDefault: true
      });

      expect(result.success).toBe(true);
      expect(defaultFontPayload(dispatched)).toBe(id);
      expect(resolve(id)?.font.family).toBe(family);
    }
  );

  it.each([
    { case: "a single-word family", font: "Roboto", id: "roboto" },
    { case: "a multi-word family", font: "Open Sans", id: "open_sans" }
  ])("changeDefaultFont with $case writes the id form", ({ font, id }) => {
    const { repository, dispatched, resolve } = makeRepository();

    const result = repository.changeDefaultFont(font);

    expect(result.success).toBe(true);
    expect(defaultFontPayload(dispatched)).toBe(id);
    expect(resolve(id)?.font.family).toBe(font);
  });

  it("refuses a font that is not in the project instead of repointing the default", () => {
    const { repository, dispatched } = makeRepository();

    const result = repository.changeDefaultFont("Comic Sans MS");

    expect(result.success).toBe(false);
    expect(dispatched).toHaveLength(0);
  });
});
