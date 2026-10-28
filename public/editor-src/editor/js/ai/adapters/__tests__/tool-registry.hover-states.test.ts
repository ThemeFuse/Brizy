import { componentConfigs } from "../tool-configs";
import { getBrizyToolDefinitions } from "../tool-registry";

const t = (key: string): string => key;

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

/**
 * A hover argument may only belong to a concern that actually has a hover state.
 *
 * `defaultValue.json` is not the authority here. An element stores
 * `hoverBorderRadius` and `hoverBorderTopLeftRadius`, so the component-keys
 * guard waves them through — but no toolbar option offers a hover state for
 * corner radius, and `cssStyleBorderRadius` is called inside a `:hover`
 * selector in one component out of forty. Setting them is stored and never
 * painted: the call succeeds and the corners do not change.
 *
 * The editor's own option definitions say which concerns have a hover state —
 * each carries `states: [NORMAL, HOVER]`. Scanning every toolbar and sidebar
 * for that gives exactly six option types, and nothing else may be offered
 * under a hover prefix.
 */
const HOVER_CAPABLE = [
  // states: [NORMAL, HOVER] on a `backgroundColor` option — solid, gradient and
  // the animated gradient's stops
  /BgColor(Hex|Palette|Opacity|Type)$/i,
  /Gradient/i,
  /ActiveStopIndex$/i,
  // ...on a `border` option. Written out rather than as a bare "border" so that
  // `borderRadius`, which has no hover state, cannot slip through.
  /Border(Color(Hex|Palette|Opacity)|Style|Width|(Top|Right|Bottom|Left)Width)$/i,
  // ...on a `boxShadow` option
  /BoxShadow/i,
  // ...on a `textShadow` option
  /TextShadow/i,
  // ...on a `colorPicker` option
  /Color(Hex|Palette|Opacity)$/i,
  // ...on a `filters` option
  /^(brightness|contrast|saturation|hue|blendMode)$/i
];

/**
 * The hover animation is its own option type rather than a state of another
 * concern, so its keys are hover-prefixed without being a hover *state*. A
 * sub-part spells it mid-key — `closeHoverTransition` is the close button's
 * own fade — so the match is on the suffix rather than the whole key.
 */
const HOVER_ANIMATION =
  /(^|[a-z])(hover|Hover)(Name|Duration|Delay|InfiniteAnimation|Transition)$/;

/** Media the element swaps on hover rather than a restyled value. */
const HOVER_MEDIA = ["hoverImageSrc"];

/** The part of a key that names its concern, with the hover marker removed. */
const withoutHover = (key: string): string | undefined => {
  const leading = key.match(/^hover([A-Z].*)$/);
  if (leading) return `${leading[1][0].toLowerCase()}${leading[1].slice(1)}`;

  const mid = key.match(/^(.*[a-z])Hover([A-Z].*)$/);
  return mid ? `${mid[1]}${mid[2]}` : undefined;
};

const aliases = new Set(componentConfigs.map((config) => config.alias));

const cases = getBrizyToolDefinitions(t)
  .filter((tool) => aliases.has(tool.alias))
  .map((tool) => ({ name: tool.name, tool }));

describe("a hover argument belongs to a concern that has a hover state", () => {
  it("does not accept a concern the editor gives no hover state", () => {
    // The case that prompted this guard: an element stores hoverBorderRadius,
    // and no toolbar option offers a hover state for corner radius.
    const concern = withoutHover("hoverBorderRadius");

    expect(concern).toBe("borderRadius");
    expect(HOVER_CAPABLE.some((capable) => capable.test("borderRadius"))).toBe(
      false
    );
  });

  it.each(cases)("$name", ({ tool }) => {
    const offending = Object.keys(tool.parameters.properties).filter((key) => {
      if (HOVER_ANIMATION.test(key) || HOVER_MEDIA.includes(key)) return false;

      const concern = withoutHover(key);
      if (concern === undefined) return false;

      return !HOVER_CAPABLE.some((capable) => capable.test(concern));
    });

    expect(offending).toEqual([]);
  });
});
