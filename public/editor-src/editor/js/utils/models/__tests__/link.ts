import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Link, Value, getLinkData } from "../link";

describe("Testing 'getLinkData' function", () => {
  const defaultExpected: Link = {
    type: "external",
    href: undefined,
    rel: undefined,
    slide: undefined,
    target: undefined
  };

  test.each<[Value, Link]>([
    [{}, defaultExpected],
    [
      {
        linkType: "page"
      },
      {
        ...defaultExpected,
        type: "page"
      }
    ],
    [
      {
        linkType: "page",
        linkPage: "http://localhost"
      },
      {
        ...defaultExpected,
        type: "page",
        href: "http://localhost"
      }
    ],

    // Lightbox on
    [
      {
        linkType: "page",
        linkPage: "http://localhost",

        linkLightBox: "on",
        imagePopulation: "{{ featured_image }}",
        imageExtension: "img",
        imageSrc: "asdasdasd",
        imageFileName: "picture"
      },
      {
        ...defaultExpected,
        type: "lightBox",
        href: makePlaceholder({
          content: "{{ featured_image }}",
          attr: { cW: "5000", cH: "0" }
        })
      }
    ],

    // Story
    [
      {
        linkType: "story",
        linkToSlide: 1,
        imagePopulation: "{{ featured_image }}",
        imageExtension: "img",
        imageSrc: "asdasdasd",
        imageFileName: "picture"
      },
      {
        ...defaultExpected,
        type: "story",
        href: "slide-1",
        slide: {
          "data-brz-link-story": "1"
        }
      }
    ],

    // Target
    [
      {
        linkExternalBlank: "on",
        linkExternalRel: "rel"
      },
      {
        ...defaultExpected,
        target: "on",
        rel: "rel"
      }
    ]
  ])("no. %#", (v, expected) => {
    expect(getLinkData(v, {} as ConfigCommon)).toStrictEqual(expected);
  });
});
