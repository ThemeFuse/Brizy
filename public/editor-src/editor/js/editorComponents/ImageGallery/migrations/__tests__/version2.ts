import { ElementModel } from "visual/component/Elements/Types";
import { m2 } from "../version2";

describe("Testing ImageGallery migration", () => {
  test.each<[ElementModel, ElementModel]>([
    [{}, {}],
    [
      {
        imagesMaskShape: "none",
        imagesMaskSize: "cover",
        items: [{ type: "Image", value: {} }]
      },
      {
        imagesMaskShape: "none",
        imagesMaskSize: "cover",
        items: [{ type: "Image", value: {} }]
      }
    ],
    [
      {
        imagesMaskShape: "shape-11",
        imagesMaskSize: "cover",
        imagesMaskPosition: "center center",
        imagesMaskCustomUploadImageSrc: "mask.png",
        items: [{ type: "Image", value: { imageSrc: "1.jpg" } }]
      },
      {
        imagesMaskShape: "shape-11",
        imagesMaskSize: "cover",
        imagesMaskPosition: "center center",
        imagesMaskCustomUploadImageSrc: "mask.png",
        items: [
          {
            type: "Image",
            value: {
              imageSrc: "1.jpg",
              maskShape: "shape-11",
              maskSize: "cover",
              maskPosition: "center center",
              maskCustomUploadImageSrc: "mask.png"
            }
          }
        ]
      }
    ],
    [
      {
        imagesMaskShape: "shape-11",
        imagesMaskRepeat: "repeat",
        items: [
          { type: "Image", value: { imageSrc: "1.jpg" } },
          { type: "Spacer", value: { height: 10 } }
        ]
      },
      {
        imagesMaskShape: "shape-11",
        imagesMaskRepeat: "repeat",
        items: [
          {
            type: "Image",
            value: {
              imageSrc: "1.jpg",
              maskShape: "shape-11",
              maskRepeat: "repeat"
            }
          },
          { type: "Spacer", value: { height: 10 } }
        ]
      }
    ],
    [
      {
        imagesMaskShape: "shape-11",
        imagesMaskScale: 50,
        items: [{ type: "Image", value: { imageSrc: "1.jpg", maskShape: "x" } }]
      },
      {
        imagesMaskShape: "shape-11",
        imagesMaskScale: 50,
        items: [{ type: "Image", value: { imageSrc: "1.jpg", maskShape: "x" } }]
      }
    ],
    [
      {
        imagesMaskShape: "shape-11",
        imagesMaskPosition: "center center",
        imagesMaskScale: 50,
        items: [{ type: "Image", value: { maskPosition: "left top" } }]
      },
      {
        imagesMaskShape: "shape-11",
        imagesMaskPosition: "center center",
        imagesMaskScale: 50,
        items: [
          {
            type: "Image",
            value: {
              maskShape: "shape-11",
              maskPosition: "left top",
              maskScale: 50
            }
          }
        ]
      }
    ]
  ])("no. %#", (v, expected) => {
    expect(m2.cb({ v, vs: v, vd: v, renderContext: "editor" })).toStrictEqual(
      expected
    );
  });
});
