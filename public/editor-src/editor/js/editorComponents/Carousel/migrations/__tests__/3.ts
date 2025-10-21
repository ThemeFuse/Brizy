import { m3 } from "../3";

describe("testing m3 migration", () => {
  test.each([
    // When sliderArrows is "none" and arrowStyle is not set
    [{ sliderArrows: "none" }, { sliderArrows: "none", arrowStyle: "style-3" }],
    // When sliderArrows is "none" and arrowStyle is already "style-3"
    [
      { sliderArrows: "none", arrowStyle: "style-3" },
      { sliderArrows: "none", arrowStyle: "style-3" }
    ],
    // When sliderArrows is "none" and arrowStyle is something else
    [
      { sliderArrows: "none", arrowStyle: "style-1" },
      { sliderArrows: "none", arrowStyle: "style-3" }
    ],
    // When sliderArrows is not "none", arrowStyle should not change
    [
      { sliderArrows: "thin", arrowStyle: "style-1" },
      { sliderArrows: "thin", arrowStyle: "style-1" }
    ],
    // When sliderArrows is not "none" and arrowStyle is not set
    [{ sliderArrows: "thick" }, { sliderArrows: "thick" }],
    // When sliderArrows is not "none" and arrowStyle is "style-3"
    [
      { sliderArrows: "custom", arrowStyle: "style-3" },
      { sliderArrows: "custom", arrowStyle: "style-3" }
    ],
    // Empty object should not change
    [{}, {}],
    // Object with other properties should preserve them
    [
      { sliderArrows: "none", someOtherProp: "value" },
      { sliderArrows: "none", arrowStyle: "style-3", someOtherProp: "value" }
    ]
  ])("migration cases", (input, expected) => {
    const migrated = m3.cb(input);
    expect(migrated).toStrictEqual(expected);
  });
});
