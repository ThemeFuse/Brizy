import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import {
  ITEM_A,
  type Item,
  itemA,
  itemB,
  maskNewIds,
  mountArrayComponent,
  NEW_ID
} from "../../../../../jest-utils/arrayComponent";

// Every list operation reports the whole new list and what happened to it
// through `onChange`; nothing is stored in the component itself.

const a1 = itemA("a1", { text: "one" });
const a2 = itemA("a2", { text: "two" });
const b1 = itemB("b1", { label: "three" });
const list = [a1, a2, b1];
const known = ["a1", "a2", "b1"];

const incoming = (text: string): Item => ({
  type: ITEM_A,
  value: { _id: "incoming", text }
});
const added = (text: string): Item => itemA(NEW_ID, { text });

const mount = (items: Item[] | undefined) =>
  mountArrayComponent({
    items,
    defaultValue: undefined,
    props: {},
    Component: EditorArrayComponent
  });

describe("EditorArrayComponent list operations", () => {
  it.each<{
    case: string;
    items: Item[] | undefined;
    run: (component: EditorArrayComponent) => void;
    out: Item[];
    meta: Record<string, unknown>;
    // [index before, index after] of the items that must stay the same object
    kept: Array<[number, number]>;
  }>([
    {
      case: "insertItem puts a copy with a new id at the index",
      items: list,
      run: (c) => c.insertItem(1, incoming("new")),
      out: [a1, added("new"), a2, b1],
      meta: { arrayOperation: "insert" },
      kept: [
        [0, 0],
        [1, 2],
        [2, 3]
      ]
    },
    {
      case: "insertItem starts a list when nothing is stored",
      items: undefined,
      run: (c) => c.insertItem(0, incoming("new")),
      out: [added("new")],
      meta: { arrayOperation: "insert" },
      kept: []
    },
    {
      case: "insertItemsBatch puts the items in order from the index",
      items: list,
      run: (c) => c.insertItemsBatch(1, [incoming("x"), incoming("y")]),
      out: [a1, added("x"), added("y"), a2, b1],
      meta: { arrayOperation: "insert_bulk" },
      kept: [
        [0, 0],
        [1, 3],
        [2, 4]
      ]
    },
    {
      case: "updateItem replaces the value of one item",
      items: list,
      run: (c) => c.updateItem(1, { _id: "a2", text: "changed" }),
      out: [a1, itemA("a2", { text: "changed" }), b1],
      meta: { arrayOperation: "itemChange" },
      kept: [
        [0, 0],
        [2, 2]
      ]
    },
    {
      case: "updateItem passes the meta of the change along",
      items: list,
      run: (c) =>
        c.updateItem(
          2,
          { _id: "b1", label: "changed" },
          { patch: { label: "changed" } }
        ),
      out: [a1, a2, itemB("b1", { label: "changed" })],
      meta: { patch: { label: "changed" }, arrayOperation: "itemChange" },
      kept: [
        [0, 0],
        [1, 1]
      ]
    },
    {
      case: "removeItem drops the item at the index",
      items: list,
      run: (c) => c.removeItem(0),
      out: [a2, b1],
      meta: { arrayOperation: "remove" },
      kept: [
        [1, 0],
        [2, 1]
      ]
    },
    {
      case: "replaceItem swaps the item and gives it a new id",
      items: list,
      run: (c) => c.replaceItem(1, itemA("a2", { text: "replaced" }), {}),
      out: [a1, added("replaced"), b1],
      meta: { arrayOperation: "replace", itemIndex: 1, oldValue: list },
      kept: [
        [0, 0],
        [2, 2]
      ]
    },
    {
      case: "replaceItem keeps the id when asked to",
      items: list,
      run: (c) =>
        c.replaceItem(1, itemA("a2", { text: "replaced" }), {
          idOptions: { keepExistingIds: true }
        }),
      out: [a1, itemA("a2", { text: "replaced" }), b1],
      meta: { arrayOperation: "replace", itemIndex: 1, oldValue: list },
      kept: [
        [0, 0],
        [2, 2]
      ]
    },
    {
      case: "cloneItem inserts a copy right after the item",
      items: list,
      run: (c) => c.cloneItem(0),
      out: [a1, added("one"), a2, b1],
      meta: { arrayOperation: "insert" },
      kept: [
        [0, 0],
        [1, 2],
        [2, 3]
      ]
    },
    {
      case: "cloneItem inserts the copy at the given index",
      items: list,
      run: (c) => c.cloneItem(0, 3),
      out: [a1, a2, b1, added("one")],
      meta: { arrayOperation: "insert" },
      kept: [
        [0, 0],
        [1, 1],
        [2, 2]
      ]
    },
    {
      case: "reorderItem moves the item to the new index",
      items: list,
      run: (c) => c.reorderItem(0, 2),
      out: [a2, b1, a1],
      meta: { arrayOperation: "moveItem" },
      kept: [
        [0, 2],
        [1, 0],
        [2, 1]
      ]
    }
  ])("$case", ({ items, run, out, meta, kept }) => {
    const before = JSON.stringify(items);
    const { instance, onChange } = mount(items);

    run(instance);

    expect(onChange).toHaveBeenCalledTimes(1);

    const [value, calledMeta] = onChange.mock.calls[0];

    expect(maskNewIds(value, known)).toEqual(out);
    expect(calledMeta).toEqual(meta);
    expect(kept.map(([from, to]) => value[to] === items?.[from])).toEqual(
      kept.map(() => true)
    );
    expect(JSON.stringify(items)).toBe(before);
  });

  it("cloneItem refuses an index that holds no item", () => {
    const { instance, onChange } = mount(list);

    expect(() => instance.cloneItem(9)).toThrow(
      "Can't clone invalid item at index 9"
    );
    expect(onChange).not.toHaveBeenCalled();
  });
});
