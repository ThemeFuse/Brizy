import { getBackgroundGradient } from "../BackgroundGradient";
import { getBackgroundImage } from "../BackgroundImage";
import DCBlock from "../DCBlock";
import Population from "../Population";
import { getTextBackgroundGradient } from "../TextBackgroundGradient";

// The blots built by a factory only read the config inside setValue, and the
// values below take setValue's early-return path, so a bare stub is enough.
const getConfig = () => ({});

// Parchment's ShadowBlot.create reads `this.tagName` and `this.className` to
// build the node. A static `create` that calls its parent by name instead of
// `super` rebinds `this` to that parent, so the blot's own marker class (and
// tag) are never applied. Parchment then matches the element by exact
// registered class on reparse, finds nothing, and unwraps it — the format is
// silently dropped the next time Quill reads the saved HTML.
describe("blot marker classes", () => {
  it.each([
    {
      case: "Population",
      blot: Population,
      value: "x",
      marker: "text-population"
    },
    { case: "DCBlock", blot: DCBlock, value: "x", marker: "brz-tp__dc-block" },
    {
      case: "BackgroundImage",
      blot: getBackgroundImage(getConfig),
      value: {},
      marker: "text-mask"
    },
    {
      case: "BackgroundGradient",
      blot: getBackgroundGradient(getConfig),
      value: undefined,
      marker: "text-gradient"
    },
    {
      // inherits BackgroundGradient.create — proves the marker follows the
      // calling class, not the parent
      case: "TextBackgroundGradient",
      blot: getTextBackgroundGradient(getConfig),
      value: undefined,
      marker: "text-gradient-bg"
    }
  ])(
    "$case.create stamps its registered marker class",
    ({ blot, value, marker }) => {
      expect(blot.create(value).classList.contains(marker)).toBe(true);
    }
  );

  it("DCBlock.create emits its own tag, not the parent's", () => {
    expect(DCBlock.create("x").tagName).toBe("DIV");
  });
});
