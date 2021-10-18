import { SortableBox, findClosestSortable } from "../findClosestSortable";
import { Point } from "../types";

const findClosestSortableTest = findClosestSortable({
  nearEdgeTest: 3,
  nearEdgeThreshold: 10
});

function box({
  x,
  y,
  w,
  h = w,
  d = 0,
  z = 0,
  t = "vertical"
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  d?: number;
  z?: number;
  t?: SortableBox["type"];
}): SortableBox {
  return {
    rect: {
      top: y,
      bottom: y + h,
      left: x,
      right: x + w
    },
    depth: d,
    zIndex: z,
    type: t
  };
}

describe("testing 'findClosestSortable'", () => {
  test.each<[Point]>([
    [{ x: 0, y: 0 }],
    [{ x: 100, y: 100 }],
    [{ x: 15, y: 17 }]
  ])("0 boxes", point => {
    expect(findClosestSortableTest([], point)).toBe(undefined);
  });

  test.each<[SortableBox[], Point, number | undefined]>([
    // ┌────┐.
    // │    │
    // └────┘
    [[box({ x: 0, y: 0, w: 100 })], { x: 0, y: 101 }, undefined],

    // .
    // ┌────┐
    // │    │
    // └────┘
    [[box({ x: 0, y: 10, w: 100 })], { x: 0, y: 0 }, undefined],

    //  ┌────┐
    // .│    │
    //  └────┘
    [[box({ x: 1, y: 0, w: 100 })], { x: 0, y: 50 }, undefined],

    // ┌────┐
    // │    │
    // └────┘
    //   .
    [[box({ x: 0, y: 0, w: 100 })], { x: 50, y: 101 }, undefined],

    // .────┐
    // │    │
    // └────┘
    [[box({ x: 0, y: 0, w: 100 })], { x: 0, y: 0 }, 0],

    // ┌────┐
    // │    │
    // └──.─┘
    [[box({ x: 0, y: 0, w: 100 })], { x: 60, y: 100 }, 0],

    // ┌────┐
    // .    │
    // └────┘
    [[box({ x: 0, y: 0, w: 100 })], { x: 0, y: 30 }, 0],

    // ┌────┐
    // |    .
    // └────┘
    [[box({ x: 0, y: 0, w: 100 })], { x: 100, y: 80 }, 0],

    // ┌────┐
    // |.   |
    // └────┘
    [[box({ x: 0, y: 0, w: 100 })], { x: 10, y: 60 }, 0],

    // ┌────┐
    // |  . |
    // └────┘
    [[box({ x: 0, y: 0, w: 100 })], { x: 70, y: 90 }, 0]
  ])("1 box", (boxes, point, winnerIndex) => {
    expect(findClosestSortableTest(boxes, point)).toStrictEqual(
      winnerIndex === undefined ? undefined : boxes[winnerIndex]
    );
  });

  test.each<[SortableBox[], Point, number | undefined]>([
    // .┌────┐ ┌────┐
    //  │    │ │    │
    //  └────┘ └────┘
    [
      [box({ x: 10, y: 0, w: 100 }), box({ x: 120, y: 0, w: 100 })],
      { x: 0, y: 0 },
      undefined
    ],

    //  ┌────┐ ┌────┐
    //  │    │.│    │
    //  └────┘ └────┘
    [
      [box({ x: 0, y: 0, w: 100 }), box({ x: 110, y: 0, w: 100 })],
      { x: 105, y: 50 },
      undefined
    ],

    //  ┌────┐ ┌────┐
    //  │    │ │    │
    //  └────┘ └────┘ .
    [
      [box({ x: 0, y: 0, w: 100 }), box({ x: 110, y: 0, w: 100 })],
      { x: 211, y: 90 },
      undefined
    ],

    //    .
    //  ┌────┐ ┌────┐
    //  │    │ │    │
    //  └────┘ └────┘
    [
      [box({ x: 0, y: 10, w: 100 }), box({ x: 110, y: 10, w: 100 })],
      { x: 40, y: 0 },
      undefined
    ],

    // ┌────┐
    // │    │
    // └────┘
    //     .
    // ┌────┐
    // │    │
    // └────┘
    [
      [box({ x: 0, y: 0, w: 100 }), box({ x: 0, y: 110, w: 100 })],
      { x: 90, y: 105 },
      undefined
    ],

    // ┌────┐ ┌────┐
    // │ .  │ │    │
    // └────┘ └────┘
    [
      [box({ x: 10, y: 0, w: 100 }), box({ x: 120, y: 0, w: 100 })],
      { x: 20, y: 20 },
      0
    ],

    // ┌────┐ ┌────┐
    // │    │ │   .│
    // └────┘ └────┘
    [
      [box({ x: 10, y: 0, w: 100 }), box({ x: 120, y: 0, w: 100 })],
      { x: 200, y: 80 },
      1
    ],

    // ┌────┐┌────┐
    // │    ││.   │
    // └────┘└────┘
    [
      [box({ x: 0, y: 0, w: 100 }), box({ x: 101, y: 0, w: 100 })],
      { x: 102, y: 70 },
      1
    ],

    // ┌────┐
    // │   .│
    // └────┘
    //
    // ┌────┐
    // │    │
    // └────┘
    [
      [box({ x: 0, y: 0, w: 100 }), box({ x: 0, y: 110, w: 100 })],
      { x: 90, y: 30 },
      0
    ],

    // ┌────┐
    // │    │
    // └────┘
    //
    // ┌────┐
    // │.   │
    // └────┘
    [
      [box({ x: 0, y: 0, w: 100 }), box({ x: 0, y: 110, w: 100 })],
      { x: 10, y: 160 },
      1
    ],

    // ┌────┐
    // │ .  │
    // └────┘
    // ┌────┐
    // │    │
    // └────┘
    [
      [box({ x: 0, y: 0, w: 100 }), box({ x: 0, y: 101, w: 100 })],
      { x: 30, y: 99 },
      0
    ]
  ])("2 boxes", (boxes, point, winnerIndex) => {
    expect(findClosestSortableTest(boxes, point)).toBe(
      winnerIndex === undefined ? undefined : boxes[winnerIndex]
    );
  });

  test.each<[SortableBox[], Point, number | undefined]>([
    // .────────────┐
    // │            │
    // │   ┌────┐   │
    // |   │    │   │
    // |   └────┘   |
    // │            │
    // └────────────┘
    [
      [box({ x: 0, y: 0, w: 180 }), box({ x: 40, y: 40, w: 100, d: 1 })],
      { x: 0, y: 0 },
      0
    ],

    // ┌────────────┐
    // │     .      │
    // │   ┌────┐   │
    // |   │    │   │
    // |   └────┘   |
    // │            │
    // └────────────┘
    [
      [box({ x: 0, y: 0, w: 180 }), box({ x: 40, y: 40, w: 100, d: 1 })],
      { x: 50, y: 30 },
      0
    ],

    // ┌────────────┐
    // │            │
    // │   ┌────┐   │
    // |   │    │   │
    // |   └────┘   |
    // │           .│
    // └────────────┘
    [
      [box({ x: 0, y: 0, w: 180 }), box({ x: 40, y: 40, w: 100, d: 1 })],
      { x: 170, y: 170 },
      0
    ],

    // ┌────────────┐
    // │            │
    // │   ┌────┐   │
    // |   │ .  │   │
    // |   └────┘   |
    // │            │
    // └────────────┘
    [
      [box({ x: 0, y: 0, w: 180 }), box({ x: 40, y: 40, w: 100, d: 1 })],
      { x: 70, y: 70 },
      1
    ]
  ])("2 boxes, nested", (boxes, point, winnerIndex) => {
    expect(findClosestSortableTest(boxes, point)).toBe(
      winnerIndex === undefined ? winnerIndex : boxes[winnerIndex]
    );
  });

  test.each<[SortableBox[], Point, number | undefined]>([
    // ┌────────────┐
    // │            │
    // │   ┌──.─┐   │
    // |   │    │   │
    // |   └────┘   |
    // │            │
    // └────────────┘
    [
      [box({ x: 0, y: 0, w: 180 }), box({ x: 40, y: 40, w: 100, d: 1 })],
      { x: 100, y: 40 },
      // because box[0].type is 'vertical', box[1] shrinks at top & bottom.
      // making it's rect equal to { top: 50, bottom: 130, left: 40, right: 140 },
      // this meaning that the point is no longer inside box[1]
      0
    ],

    // ┌────────────┐
    // │            │
    // │   ┌────┐   │
    // |   │    │   │
    // |   .────┘   |
    // │            │
    // └────────────┘
    [
      [box({ x: 0, y: 0, w: 180 }), box({ x: 40, y: 40, w: 100, d: 1 })],
      { x: 40, y: 140 },
      // because box[0].type is 'vertical', box[1] shrinks at top & bottom.
      // making it's rect equal to { top: 50, bottom: 130, left: 40, right: 140 },
      // this meaning that the point is no longer inside box[1]
      0
    ],

    // ┌────────────┐
    // │            │
    // │   ┌────┐   │
    // |   │    .   │
    // |   └────┘   |
    // │            │
    // └────────────┘
    [
      [box({ x: 0, y: 0, w: 180 }), box({ x: 40, y: 40, w: 100, d: 1 })],
      { x: 140, y: 90 },
      // because box[0].type is 'vertical', box[1] shrinks at top & bottom.
      // making it's rect equal to { top: 50, bottom: 130, left: 40, right: 140 },
      // this meaning that the point is still inside box[1]
      1
    ],

    // ┌────────────┐
    // │            │
    // │   ┌────┐   │
    // |   │   .|   │
    // |   └────┘   |
    // │            │
    // └────────────┘
    [
      [
        box({ x: 0, y: 0, w: 180, t: "horizontal" }),
        box({ x: 40, y: 40, w: 100, d: 1 })
      ],
      { x: 135, y: 90 },
      // because box[0].type is 'horizontal', box[1] shrinks at left & right.
      // making it's rect equal to { top: 40, bottom: 140, left: 50, right: 130 },
      // this meaning that that the point no longer box[1]
      0
    ]
  ])("2 boxes, nested, near edge", (boxes, point, winnerIndex) => {
    expect(findClosestSortableTest(boxes, point)).toBe(
      winnerIndex === undefined ? winnerIndex : boxes[winnerIndex]
    );
  });

  test.each<[SortableBox[], Point, number | undefined]>([
    // row > column column
    // ┌────────────┐
    // │┌────┐┌────┐|
    // |│ .  ││    │|
    // |└────┘└────┘|
    // └────────────┘
    [
      [
        box({ x: 0, y: 0, w: 203, t: "horizontal" }),
        box({ x: 1, y: 0, w: 100, d: 1 }),
        box({ x: 102, y: 40, w: 100, d: 1 })
      ],
      { x: 40, y: 60 },
      1
    ],

    // row > column column
    // ┌────────────┐
    // │┌────┐┌────┐|
    // |│    ││ .  │|
    // |└────┘└────┘|
    // └────────────┘
    [
      [
        box({ x: 0, y: 0, w: 203, t: "horizontal" }),
        box({ x: 1, y: 0, w: 100, d: 1 }),
        box({ x: 102, y: 40, w: 100, d: 1 })
      ],
      { x: 150, y: 60 },
      2
    ]
  ])("3 boxes, nested", (boxes, point, winnerIndex) => {
    expect(findClosestSortableTest(boxes, point)).toBe(
      winnerIndex === undefined ? winnerIndex : boxes[winnerIndex]
    );
  });

  test.each<[SortableBox[], Point, number | undefined]>([
    // row > column column
    // ┌────────────┐
    // │┌────┐┌────┐|
    // |│.   ││    │|
    // |└────┘└────┘|
    // └────────────┘
    [
      [
        box({ x: 0, y: 0, w: 203, t: "horizontal" }),
        box({ x: 1, y: 0, w: 100, d: 1 }),
        box({ x: 102, y: 40, w: 100, d: 1 })
      ],
      { x: 4, y: 60 },
      0
    ],

    // row > column column
    // ┌────────────┐
    // │┌────┐┌────┐|
    // |│   .││    │|
    // |└────┘└────┘|
    // └────────────┘
    [
      [
        box({ x: 0, y: 0, w: 203, t: "horizontal" }),
        box({ x: 1, y: 0, w: 100, d: 1 }),
        box({ x: 102, y: 40, w: 100, d: 1 })
      ],
      { x: 95, y: 60 },
      0
    ],

    // row > column column
    // ┌────────────┐
    // │┌────┐┌────┐|
    // |│    ││.   │|
    // |└────┘└────┘|
    // └────────────┘
    [
      [
        box({ x: 0, y: 0, w: 203, t: "horizontal" }),
        box({ x: 1, y: 0, w: 100, d: 1 }),
        box({ x: 102, y: 40, w: 100, d: 1 })
      ],
      { x: 105, y: 60 },
      0
    ],

    // row > column column
    // ┌────────────┐
    // │┌────┐┌────┐|
    // |│    ││   .│|
    // |└────┘└────┘|
    // └────────────┘
    [
      [
        box({ x: 0, y: 0, w: 203, t: "horizontal" }),
        box({ x: 1, y: 0, w: 100, d: 1 }),
        box({ x: 102, y: 40, w: 100, d: 1 })
      ],
      { x: 200, y: 60 },
      0
    ]
  ])(
    "3 boxes, nested, near edge, point inside",
    (boxes, point, winnerIndex) => {
      expect(findClosestSortableTest(boxes, point)).toBe(
        winnerIndex === undefined ? winnerIndex : boxes[winnerIndex]
      );
    }
  );
});
