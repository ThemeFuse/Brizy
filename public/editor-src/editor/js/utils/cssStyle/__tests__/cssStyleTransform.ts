import { Value as TransformValue } from "visual/component/Controls/Transform/types/Value";
import { getTransformOrigin, getTransformProperties } from "../index";

describe("getTransformOrigin function", () => {
  test.each([
    [
      {
        rotate: { rotate: 45 },
        scale: { scaleX: 2, scaleY: 1.5 },
        flip: { flipHorizontal: true, flipVertical: false },
        anchorPoint: { x: 0.5, y: 0.5 }
      },
      "transform-origin: var(--transform-anchor-pointY) var(--transform-anchor-pointX);"
    ],
    [
      {
        rotate: { rotate: 90 }
      },
      ""
    ],
    [
      {
        scale: { scaleX: 2, scaleY: 1.5 }
      },
      ""
    ],
    [
      {
        flip: { flipHorizontal: true, flipVertical: false }
      },
      ""
    ],
    [
      {
        anchorPoint: { x: 0.5, y: 0.5 }
      },
      ""
    ],
    [
      {
        rotate: { rotate: 45 },
        scale: { scaleX: 2, scaleY: 1.5 },
        flip: { flipHorizontal: true, flipVertical: false },
        anchorPoint: { x: 0.5, y: 0.5 }
      },
      "transform-origin: var(--transform-anchor-pointY) var(--transform-anchor-pointX);"
    ],
    [
      {
        rotate: { rotate: 45 },
        offset: { offsetX: 10, offsetY: 20 },
        skew: { skewX: 10, skewY: 20 },
        scale: {
          scaleX: 2,
          scaleY: 1.5,
          scaleXY: 1.5,
          scalePreserveSize: true
        },
        flip: { flipHorizontal: true, flipVertical: false },
        anchorPoint: { x: 0.5, y: 0.5 }
      },
      "transform-origin: var(--transform-anchor-pointY) var(--transform-anchor-pointX);"
    ],
    [
      {
        rotate: { rotate: 90 },
        offset: { offsetX: 10, offsetY: 20 },
        skew: { skewX: 10, skewY: 20 },
        scale: {
          scaleX: 2,
          scaleY: 1.5,
          scaleXY: 1.5,
          scalePreserveSize: true
        },
        flip: { flipHorizontal: true, flipVertical: false }
      },
      ""
    ],
    [
      {
        rotate: { rotate: 90 },
        offset: { offsetX: 10, offsetY: 20 },
        skew: { skewX: 10, skewY: 20 },
        flip: { flipHorizontal: true, flipVertical: false },
        anchorPoint: { x: 0.5, y: 0.5 }
      },
      "transform-origin: var(--transform-anchor-pointY) var(--transform-anchor-pointX);"
    ],
    [
      {
        offset: { offsetX: 10, offsetY: 20 },
        skew: { skewX: 10, skewY: 20 },
        scale: {
          scaleX: 2,
          scaleY: 1.5,
          scaleXY: 1.5,
          scalePreserveSize: true
        },
        flip: { flipHorizontal: true, flipVertical: false },
        anchorPoint: { x: 0.5, y: 0.5 }
      },
      "transform-origin: var(--transform-anchor-pointY) var(--transform-anchor-pointX);"
    ],
    [{}, ""]
  ])("%o is not equal with %s", (input, output) => {
    expect(getTransformOrigin(input as Partial<TransformValue>)).toStrictEqual(
      output
    );
  });
});

describe("getTransformProperties function", () => {
  test.each([
    [
      {
        rotate: {
          rotate: 45,
          rotate3D: true,
          rotateX: 30,
          rotateY: 60,
          rotatePerspective: 100
        },
        offset: { offsetX: 10, offsetY: 20 },
        flip: { flipHorizontal: true, flipVertical: false },
        scale: {
          scaleX: 2,
          scaleY: 1.5,
          scaleXY: 1.5,
          scalePreserveSize: true
        },
        skew: { skewX: 10, skewY: 20 }
      },
      [
        " rotateZ(var(--transform-rotateZ))",
        " perspective(var(--transform-rotatePerspective))",
        " rotateX(var(--transform-rotateX))",
        " rotateY(var(--transform-rotateY))",
        " translateX(var(--transform-offsetX))",
        " translateY(var(--transform-offsetY))",
        " skewX(var(--transform-skewX))",
        " skewY(var(--transform-skewY))",
        " scaleX(calc(var(--transform-flipHorizontal) * var(--transform-scaleXY)))",
        " scaleY(calc(var(--transform-flipVertical) * var(--transform-scaleXY)))"
      ]
    ],
    [
      {
        rotate: { rotate: 90 }
      },
      [" rotateZ(var(--transform-rotateZ))"]
    ],
    [
      {
        offset: { offsetX: 10, offsetY: 20 }
      },
      [
        " translateX(var(--transform-offsetX))",
        " translateY(var(--transform-offsetY))"
      ]
    ],
    [
      {
        flip: { flipHorizontal: true, flipVertical: false }
      },
      [
        " scaleX(calc(var(--transform-flipHorizontal) * 1))",
        " scaleY(calc(var(--transform-flipVertical) * 1))"
      ]
    ],
    [
      {
        scale: { scaleX: 2, scaleY: 1.5, scaleXY: 1.5, scalePreserveSize: true }
      },
      [
        " scaleX(calc(var(--transform-flipHorizontal) * var(--transform-scaleXY)))",
        " scaleY(calc(var(--transform-flipVertical) * var(--transform-scaleXY)))"
      ]
    ],
    [
      {
        rotate: {
          rotate: 45,
          rotate3D: true,
          rotateX: 30,
          rotateY: 60,
          rotatePerspective: 100
        },
        skew: { skewX: 10, skewY: 20 }
      },
      [
        " rotateZ(var(--transform-rotateZ))",
        " perspective(var(--transform-rotatePerspective))",
        " rotateX(var(--transform-rotateX))",
        " rotateY(var(--transform-rotateY))",
        " skewX(var(--transform-skewX))",
        " skewY(var(--transform-skewY))"
      ]
    ],
    [
      {
        scale: {
          scaleX: 2,
          scaleY: 1.5,
          scaleXY: 1.5,
          scalePreserveSize: true
        },
        flip: { flipHorizontal: true, flipVertical: false }
      },
      [
        " scaleX(calc(var(--transform-flipHorizontal) * var(--transform-scaleXY)))",
        " scaleY(calc(var(--transform-flipVertical) * var(--transform-scaleXY)))"
      ]
    ],
    [
      {
        offset: { offsetX: 10, offsetY: 20 },
        anchorPoint: { x: 0.5, y: 0.5 }
      },
      [
        " translateX(var(--transform-offsetX))",
        " translateY(var(--transform-offsetY))"
      ]
    ],
    [
      {
        rotate: { rotate: 90 },
        flip: { flipHorizontal: true, flipVertical: false }
      },
      [
        " rotateZ(var(--transform-rotateZ))",
        " scaleX(calc(var(--transform-flipHorizontal) * 1))",
        " scaleY(calc(var(--transform-flipVertical) * 1))"
      ]
    ],
    [
      {
        skew: { skewX: 10, skewY: 20 },
        scale: { scaleX: 2, scaleY: 1.5, scaleXY: 1.5, scalePreserveSize: true }
      },
      [
        " skewX(var(--transform-skewX))",
        " skewY(var(--transform-skewY))",
        " scaleX(calc(var(--transform-flipHorizontal) * var(--transform-scaleXY)))",
        " scaleY(calc(var(--transform-flipVertical) * var(--transform-scaleXY)))"
      ]
    ]
  ])("%o is not equal with %o", (input, output) => {
    expect(
      getTransformProperties(input as Partial<TransformValue>)
    ).toStrictEqual(output);
  });
});
