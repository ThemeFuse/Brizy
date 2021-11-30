import { getIn } from "timm";
import { mapWithStructuralSharing } from "../mapWithStructuralSharing";

interface Point {
  x: number;
  y: number;
}

function notPoint() {
  return { a: "a", b: "b" };
}

function point(): Point {
  return { x: 4, y: 5 };
}

function isPoint(v: unknown): v is Point {
  return (
    typeof v === "object" &&
    v !== null &&
    "x" in v &&
    typeof (v as any).x === "number" &&
    "y" in v &&
    typeof (v as any).y === "number"
  );
}

function cb(obj: object): object | Point {
  return isPoint(obj) ? { x: obj.x ** 2, y: obj.y ** 2 } : obj;
}

function splitPath(s: string): string[] {
  return s === "" ? [] : s.split(".");
}

describe("Testing 'mapWithStructuralSharing' function", () => {
  it.each<[object, string[]]>([
    [{ a: 1 }, ["a"]],
    [{ b: { c: "test" } }, ["b", "b.c"]],
    [
      {
        a: 1,
        z: { b: { c: "test" } },
        arr: [1, "string", { l: "l", m: "m", n: "n" }]
      },
      ["", "a", "z", "z.b", "z.b.c", "arr.0", "arr.1", "arr.2"]
    ]
  ])(
    "Should return exactly the same object if cb didn't match anything",
    (obj, paths) => {
      const mapped = mapWithStructuralSharing(obj, cb);

      for (const path of paths) {
        const pathSplit = splitPath(path);
        const mappedItem = getIn(mapped, pathSplit);
        const objItem = getIn(obj, pathSplit);

        expect(mappedItem).toBeDefined();
        expect(objItem).toBeDefined();
        expect(mappedItem).toBe(objItem);
      }
    }
  );

  it.each<[object, string[], string[]]>([
    [
      { a: point(), b: notPoint(), c: point(), d: notPoint() },
      ["", "a", "c"],
      ["b", "d"]
    ],
    [
      [point(), notPoint(), point(), notPoint()],
      ["", "0", "2"],
      ["1", "3"]
    ],
    [
      {
        type: "section",
        value: {
          items: [
            notPoint(),
            point(),
            {
              type: "item",
              value: {
                itemsA: [notPoint(), notPoint()],
                itemsB: [point(), notPoint(), point()]
              }
            }
          ]
        }
      },
      [
        "",
        "value",
        "value.items",
        "value.items.1",
        "value.items.2",
        "value.items.2.value",
        "value.items.2.value.itemsB",
        "value.items.2.value.itemsB.0",
        "value.items.2.value.itemsB.2"
      ],
      [
        "type",
        "value.items.0",
        "value.items.2.type",
        "value.items.2.value.itemsA",
        "value.items.2.value.itemsB.1"
      ]
    ]
  ])(
    "Should change references only where cb matched",
    (obj, pathsChanged, pathsSame) => {
      const mapped = mapWithStructuralSharing(obj, cb);

      for (const path of pathsChanged) {
        const pathSplit = splitPath(path);
        const mappedItem = getIn(mapped, pathSplit);
        const objItem = getIn(obj, pathSplit);

        expect(mappedItem).toBeDefined();
        expect(objItem).toBeDefined();
        expect(mappedItem).not.toBe(objItem);
      }

      for (const path of pathsSame) {
        const pathSplit = splitPath(path);
        const mappedItem = getIn(mapped, pathSplit);
        const objItem = getIn(obj, pathSplit);

        expect(mappedItem).toBeDefined();
        expect(objItem).toBeDefined();
        expect(mappedItem).toBe(objItem);
      }
    }
  );
});
