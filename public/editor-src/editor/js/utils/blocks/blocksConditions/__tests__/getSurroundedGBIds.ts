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
  uid: "block1",
  status: "publish",
  rules: [],
  position: null,
  data: data,
  dataVersion: 0,
  meta: normalMeta,
  dependencies: []
};

const globalBlock2: GlobalBlock = {
  uid: "block2",
  status: "publish",
  rules: [],
  position: {
    align: "bottom",
    top: 0,
    bottom: 0
  },
  data: data,
  dataVersion: 0,
  meta: normalMeta,
  dependencies: []
};

const globalBlock3: GlobalBlock = {
  uid: "block3",
  status: "publish",
  rules: [],
  position: {
    align: "top",
    top: 0,
    bottom: 0
  },
  data: data,
  dataVersion: 0,
  meta: normalMeta,
  dependencies: []
};

const globalBlock4: GlobalBlock = {
  uid: "block4",
  status: "publish",
  rules: [],
  position: {
    align: "top",
    top: 0,
    bottom: 0
  },
  data: data,
  dataVersion: 0,
  meta: normalMeta,
  dependencies: []
};

const globalBlock6: GlobalBlock = {
  uid: "block6",
  status: "publish",
  rules: [],
  position: {
    align: "bottom",
    top: 0,
    bottom: 0
  },
  data: data,
  dataVersion: 0,
  meta: popupMeta,
  dependencies: []
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
    ],
    [
      ["block6"],
      {
        block2: globalBlock2,
        block3: globalBlock3,
        block4: globalBlock4,
        block5: globalBlock1,
        block6: globalBlock6
      },
      { top: [], bottom: [] }
    ]
  ])("getSurroundedGBIds nr %#", (pageBlockIds, globalBlocks, resolve) => {
    expect(getSurroundedGBIds(pageBlockIds, globalBlocks)).toStrictEqual(
      resolve
    );
  });
});
