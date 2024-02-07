import { MValue } from "visual/utils/value";
import { Asset, AssetLibsMap } from "../../transforms/assets";
import { getLibAsset } from "../utils";

const asset: Asset = {
  name: "group-1",
  score: 1,
  pro: false,
  content: {
    type: "file",
    url: "/static/main.css"
  }
};

const libsMap: Array<AssetLibsMap> = [
  {
    name: "group-jq",
    selectors: [".brz__group__jquery"],
    score: 20,
    content: {
      type: "file",
      url: "/static/editor/css/group-jq.css",
      attr: {
        class: "brz-link brz-link-preview-lib",
        "data-group": "group-jq",
        rel: "stylesheet"
      }
    },
    pro: false
  },
  {
    name: "group-1",
    selectors: [
      ".brz__group__jquery",
      ".brz-forms",
      ".brz-forms2",
      ".brz-filters__main",
      ".brz-translation"
    ],
    score: 20,
    content: {
      type: "file",
      url: "/static/editor/css/group-1.css",
      attr: {
        class: "brz-link brz-link-preview-lib",
        "data-group": "group-1",
        rel: "stylesheet"
      }
    },
    pro: false
  },
  {
    name: "group-2",
    selectors: [
      ".brz__group__jquery",
      ".brz-slick-slider",
      ".brz-carousel",
      ".brz-countdown",
      ".brz-countdown2"
    ],
    score: 20,
    content: {
      type: "file",
      url: "/static/editor/css/group-2.css",
      attr: {
        class: "brz-link brz-link-preview-lib",
        "data-group": "group-2",
        rel: "stylesheet"
      }
    },
    pro: false
  },
  {
    name: "group-3",
    selectors: [
      ".brz__group__jquery",
      ".brz-animated",
      ".brz-image__lightbox",
      ".brz-image__gallery-lightbox",
      ".brz-motion--effects"
    ],
    score: 20,
    content: {
      type: "file",
      url: "/static/editor/css/group-3.css",
      attr: {
        class: "brz-link brz-link-preview-lib",
        "data-group": "group-3",
        rel: "stylesheet"
      }
    },
    pro: false
  },
  {
    name: "group-1_2",
    selectors: [
      ".brz__group__jquery",
      ".brz-forms",
      ".brz-forms2",
      ".brz-filters__main",
      ".brz-translation",
      ".brz-slick-slider",
      ".brz-carousel",
      ".brz-countdown",
      ".brz-countdown2"
    ],
    score: 20,
    content: {
      type: "file",
      url: "/static/editor/css/group-1_2.css",
      attr: {
        class: "brz-link brz-link-preview-lib",
        "data-group": "group-1_2",
        rel: "stylesheet"
      }
    },
    pro: false
  },
  {
    name: "group-1_3",
    selectors: [
      ".brz__group__jquery",
      ".brz-forms",
      ".brz-forms2",
      ".brz-filters__main",
      ".brz-translation",
      ".brz-animated",
      ".brz-image__lightbox",
      ".brz-image__gallery-lightbox",
      ".brz-motion--effects"
    ],
    score: 20,
    content: {
      type: "file",
      url: "/static/editor/css/group-1_3.css",
      attr: {
        class: "brz-link brz-link-preview-lib",
        "data-group": "group-1_3",
        rel: "stylesheet"
      }
    },
    pro: false
  },
  {
    name: "group-2_3",
    selectors: [
      ".brz__group__jquery",
      ".brz-slick-slider",
      ".brz-carousel",
      ".brz-countdown",
      ".brz-countdown2",
      ".brz-animated",
      ".brz-image__lightbox",
      ".brz-image__gallery-lightbox",
      ".brz-motion--effects"
    ],
    score: 20,
    content: {
      type: "file",
      url: "/static/editor/css/group-2_3.css",
      attr: {
        class: "brz-link brz-link-preview-lib",
        "data-group": "group-2_3",
        rel: "stylesheet"
      }
    },
    pro: false
  },
  {
    name: "group-all",
    selectors: [
      ".brz__group__jquery",
      ".brz-forms",
      ".brz-forms2",
      ".brz-filters__main",
      ".brz-translation",
      ".brz-slick-slider",
      ".brz-carousel",
      ".brz-countdown",
      ".brz-countdown2",
      ".brz-animated",
      ".brz-image__lightbox",
      ".brz-image__gallery-lightbox",
      ".brz-motion--effects"
    ],
    score: 20,
    content: {
      type: "file",
      url: "/static/editor/css/group-all.css",
      attr: {
        class: "brz-link brz-link-preview-lib",
        "data-group": "group-all",
        rel: "stylesheet"
      }
    },
    pro: false
  }
];

const groupJQ = libsMap[0];
const group1 = libsMap[1];
const group2 = libsMap[2];
const group3 = libsMap[3];
const group1_2 = libsMap[4];
const group1_3 = libsMap[5];
const group2_3 = libsMap[6];
const groupAll = libsMap[7];

describe("assetManager utils", () => {
  test.each<[Array<AssetLibsMap>, Array<string>, MValue<AssetLibsMap>]>([
    [[{ ...asset, selectors: [] }], [], undefined],

    [[{ ...asset, selectors: [] }], [".brz-forms"], undefined],

    [[{ ...asset, selectors: [".brz-forms"] }], [".brz-forms1"], undefined],

    [libsMap, [".brz__group__jquery"], groupJQ],

    [libsMap, [group1.selectors[1]], group1],

    [libsMap, group1.selectors, group1],

    [libsMap, group2.selectors, group2],

    [libsMap, group3.selectors, group3],

    [libsMap, [group1.selectors[1], group2.selectors[2]], group1_2],

    [libsMap, [group1.selectors[2], group2.selectors[3]], group1_2],

    [libsMap, [group1.selectors[1], group3.selectors[3]], group1_3],

    [libsMap, [...group2.selectors, ...group3.selectors], group2_3],

    [
      libsMap,
      [group1.selectors[1], group2.selectors[1], group3.selectors[1]],
      groupAll
    ],

    [
      libsMap,
      [...group1.selectors, ...group2.selectors, ...group3.selectors],
      groupAll
    ]
  ])("getLibAsset %#", (assetLib, selectors, asset) => {
    const r = getLibAsset(assetLib, selectors);
    expect(r).toStrictEqual(asset);
  });
});
