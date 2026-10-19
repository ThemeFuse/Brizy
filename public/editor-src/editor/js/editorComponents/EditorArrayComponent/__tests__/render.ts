import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import {
  ITEM_A,
  ITEM_B,
  type Item,
  itemA,
  itemB,
  type Mounted,
  mountArrayComponent,
  NOT_FOUND
} from "../../../../../jest-utils/arrayComponent";
import { config } from "../../../../../jest-utils/mocks";

// What the list renders: one registered component per item, in order, each
// wired to the store and to its own slot in the list.

const a1 = itemA("a1", { text: "one" });
const a2 = itemA("a2", { text: "two" });
const b1 = itemB("b1", { label: "three" });
const unknown: Item = { type: "TestUnregistered", value: { _id: "u1" } };
const list = [a1, a2, b1, unknown];

const mount = (
  items: Item[] | undefined,
  defaultValue: Item[] | undefined,
  props: Record<string, unknown>
): Mounted =>
  mountArrayComponent({
    items,
    defaultValue,
    props,
    Component: EditorArrayComponent
  });

const drawn = (m: Mounted): Array<[string, string]> =>
  Array.from(m.container.children).map((node) => [
    node.getAttribute("data-type") ?? "",
    node.getAttribute("data-id") ?? ""
  ]);

describe("EditorArrayComponent rendering", () => {
  it.each<{
    case: string;
    items: Item[] | undefined;
    defaultValue: Item[] | undefined;
    props: Record<string, unknown>;
    out: Array<[string, string]>;
  }>([
    {
      case: "every stored item with the component registered for its type",
      items: list,
      defaultValue: undefined,
      props: {},
      out: [
        [ITEM_A, "a1"],
        [ITEM_A, "a2"],
        [ITEM_B, "b1"],
        [NOT_FOUND, "u1"]
      ]
    },
    {
      case: "the default list when nothing is stored",
      items: undefined,
      defaultValue: [a2, b1],
      props: {},
      out: [
        [ITEM_A, "a2"],
        [ITEM_B, "b1"]
      ]
    },
    {
      case: "nothing when there is neither a stored nor a default list",
      items: undefined,
      defaultValue: undefined,
      props: {},
      out: []
    },
    {
      case: "the items from sliceStartIndex on",
      items: list,
      defaultValue: undefined,
      props: { sliceStartIndex: 2 },
      out: [
        [ITEM_B, "b1"],
        [NOT_FOUND, "u1"]
      ]
    },
    {
      case: "the items before sliceEndIndex",
      items: list,
      defaultValue: undefined,
      props: { sliceEndIndex: 2 },
      out: [
        [ITEM_A, "a1"],
        [ITEM_A, "a2"]
      ]
    },
    {
      case: "the items between the two slice indexes",
      items: list,
      defaultValue: undefined,
      props: { sliceStartIndex: 1, sliceEndIndex: 3 },
      out: [
        [ITEM_A, "a2"],
        [ITEM_B, "b1"]
      ]
    }
  ])("renders $case", ({ items, defaultValue, props, out }) => {
    expect(drawn(mount(items, defaultValue, props))).toEqual(out);
  });

  it("gives each item its value, its default value and the editor wiring", () => {
    const defaultValue = [itemA("d1", { text: "default" })];
    const m = mount(list, defaultValue, {});

    expect(
      m.rendered().map(({ props }) => ({
        dbValue: props.dbValue,
        defaultValue: props.defaultValue,
        componentId: props.componentId,
        reduxStore: props.reduxStore,
        reduxState: props.reduxState,
        reduxDispatch: props.reduxDispatch,
        renderContext: props.renderContext,
        editorMode: props.editorMode,
        config: Reflect.apply(Object(props.getGlobalConfig), undefined, [])
      }))
    ).toEqual(
      list.map((item, index) => ({
        dbValue: item.value,
        defaultValue: defaultValue[index]?.value,
        componentId: item === unknown ? unknown.type : undefined,
        reduxStore: m.store,
        reduxState: m.store.getState(),
        reduxDispatch: m.store.dispatch,
        renderContext: "editor",
        editorMode: Mode.page,
        config
      }))
    );
    expect(m.rendered().map(({ props }) => props.dbValue === a1.value)).toEqual(
      [true, false, false, false]
    );
  });

  it.each<{
    case: string;
    itemProps: (seen: unknown[][]) => unknown;
    out: unknown[];
    seen: unknown[][];
  }>([
    {
      case: "the same object for every item",
      itemProps: () => ({ extra: "shared" }),
      out: ["shared", "shared", "shared", "shared"],
      seen: []
    },
    {
      case: "what the function returns for the item, its index and the list",
      itemProps: (seen) => (item: Item, index: number, items: Item[]) => {
        seen.push([item, index, items]);

        return { extra: `${item.type}:${index}` };
      },
      out: [`${ITEM_A}:0`, `${ITEM_A}:1`, `${ITEM_B}:2`, `${unknown.type}:3`],
      seen: list.map((item, index) => [item, index, list])
    }
  ])("passes itemProps as $case", ({ itemProps, out, seen }) => {
    const calls: unknown[][] = [];
    const m = mount(list, undefined, { itemProps: itemProps(calls) });

    expect(m.rendered().map(({ props }) => props.extra)).toEqual(out);
    expect(calls).toEqual(seen);
  });

  it.each<{
    case: string;
    args: [unknown, Record<string, unknown>?];
    out: Item[];
    meta: Record<string, unknown>;
  }>([
    {
      case: "a new value updates the item",
      args: [{ _id: "a2", text: "changed" }],
      out: [a1, itemA("a2", { text: "changed" }), b1, unknown],
      meta: { arrayOperation: "itemChange" }
    },
    {
      case: "a new value keeps the meta of the change",
      args: [{ _id: "a2", text: "changed" }, { patch: { text: "changed" } }],
      out: [a1, itemA("a2", { text: "changed" }), b1, unknown],
      meta: { patch: { text: "changed" }, arrayOperation: "itemChange" }
    },
    {
      case: "the replace_all intent swaps the whole item",
      args: [
        itemB("a2", { label: "swapped" }),
        { intent: "replace_all", idOptions: { keepExistingIds: true } }
      ],
      out: [a1, itemB("a2", { label: "swapped" }), b1, unknown],
      meta: { arrayOperation: "replace", itemIndex: 1, oldValue: list }
    },
    {
      case: "the remove_all intent removes the item",
      args: [null, { intent: "remove_all" }],
      out: [a1, b1, unknown],
      meta: { arrayOperation: "remove" }
    }
  ])("an item's onChange: $case", ({ args, out, meta }) => {
    const m = mount(list, undefined, {});

    Reflect.apply(Object(m.child("a2").props.onChange), undefined, args);

    expect(m.onChange.mock.calls).toEqual([[out, meta]]);
  });

  it("an item's onChange: the replace_all intent ignores what is not an item", () => {
    const m = mount(list, undefined, {});

    Reflect.apply(Object(m.child("a2").props.onChange), undefined, [
      null,
      { intent: "replace_all" }
    ]);

    expect(m.onChange).not.toHaveBeenCalled();
  });
});
