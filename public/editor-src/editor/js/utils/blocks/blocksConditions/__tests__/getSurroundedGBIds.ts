import { GlobalBlock } from "visual/types";
import { getSurroundedGBIds } from "../index";
import { GB, PB, SurroundedConditionsIds } from "../types";

const normalMeta: GlobalBlock["meta"] = {
  type: "normal",
  extraFontStyles: [],
  _thumbnailSrc: "",
  _thumbnailTime: 111,
  _thumbnailWidth: 200
};

const popupMeta: GlobalBlock["meta"] = {
  type: "popup",
  extraFontStyles: [],
  _thumbnailSrc: "",
  _thumbnailTime: 111,
  _thumbnailWidth: 200
};

const data: GlobalBlock["data"] = {
  type: "Section",
  blockId: "some id",
  value: {}
};

const globalBlock1: GlobalBlock = {
  status: "publish",
  rules: [],
  position: null,
  data: data,
  meta: normalMeta
};

const globalBlock2: GlobalBlock = {
  status: "publish",
  rules: [],
  position: {
    align: "bottom",
    top: 0,
    bottom: 0
  },
  data: data,
  meta: normalMeta
};

const globalBlock3: GlobalBlock = {
  status: "publish",
  rules: [],
  position: {
    align: "top",
    top: 0,
    bottom: 0
  },
  data: data,
  meta: normalMeta
};

const globalBlock4: GlobalBlock = {
  status: "publish",
  rules: [],
  position: {
    align: "top",
    top: 0,
    bottom: 0
  },
  data: data,
  meta: normalMeta
};

const globalBlock6: GlobalBlock = {
  status: "publish",
  rules: [],
  position: {
    align: "bottom",
    top: 0,
    bottom: 0
  },
  data: data,
  meta: popupMeta
};

describe("testing blocksConditions", () => {
  test.each<[PB, GB, SurroundedConditionsIds]>([
    [["block1"], { block1: globalBlock1 }, { top: [], bottom: [] }],
    [
      ["block1", "simpleBlock1"],
      { block1: globalBlock1 },
      { top: ["block1"], bottom: [] }
    ],
    [
      ["block2", "block3"],
      { block2: globalBlock2, block3: globalBlock3 },
      { top: ["block3"], bottom: ["block2"] }
    ],
    [
      ["block2", "block3", "simpleBlock1", "simpleBlock2", "block4"],
      { block2: globalBlock2, block3: globalBlock3, block4: globalBlock4 },
      { top: ["block2", "block3"], bottom: ["block4"] }
    ],
    [
      ["block2", "block3", "simpleBlock1", "block4", "simpleBlock2", "block5"],
      {
        block2: globalBlock2,
        block3: globalBlock3,
        block4: globalBlock4,
        block5: globalBlock1
      },
      { top: ["block2", "block3"], bottom: ["block5"] }
    ],
    [
      [
        "block2",
        "block3",
        "simpleBlock1",
        "simpleBlock2",
        "block4",
        "block5",
        "block6"
      ],
      {
        block2: globalBlock2,
        block3: globalBlock3,
        block4: globalBlock4,
        block5: globalBlock1,
        block6: globalBlock6
      },
      { top: ["block2", "block3"], bottom: ["block6", "block5", "block4"] }
    ]
  ])("getSurroundedGBIds nr %#", (pageBlockIds, globalBlocks, resolve) => {
    expect(getSurroundedGBIds(pageBlockIds, globalBlocks)).toStrictEqual(
      resolve
    );
  });
});
