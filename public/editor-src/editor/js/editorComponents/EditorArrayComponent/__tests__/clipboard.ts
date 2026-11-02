import { act } from "@testing-library/react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { updateCopiedElement, updateUI } from "visual/redux/actions2";
import type { DeviceMode } from "visual/types";
import {
  CLONEABLE,
  container,
  type Item,
  itemA,
  itemB,
  maskNewIds,
  mountArrayComponent,
  NEW_ID,
  WRAPPER
} from "../../../../../jest-utils/arrayComponent";

// Copy keeps the page and the path of the item in the store; paste inserts the
// copied element after an item of the same kind; paste styles merges only its
// styles into an item of the same kind.

const a1 = itemA("a1", {
  text: "one",
  color: "blue",
  hoverColor: "navy",
  tabletColor: "teal"
});
const a2 = itemA("a2", { text: "two" });
const b1 = itemB("b1", { label: "three" });
const flat = [a1, a2, b1];

const w1 = container(WRAPPER, "w1", { showToolbar: "on" }, [
  itemA("wa1", { text: "one", color: "blue" })
]);
const c1 = container(CLONEABLE, "c1", {}, [itemA("ca1", { text: "two" })]);
const w2 = container(WRAPPER, "w2", {}, [itemA("wa2", { text: "three" })]);
const w3 = container(WRAPPER, "w3", {}, [itemB("wb1", { label: "four" })]);
const nested = [w1, c1, w2, w3];

const known = [
  "a1",
  "a2",
  "b1",
  "w1",
  "c1",
  "w2",
  "w3",
  "wa1",
  "ca1",
  "wa2",
  "wb1"
];

const renewed = (item: Item, value: Item["value"]): Item => ({
  type: item.type,
  value: { ...item.value, ...value, _id: NEW_ID }
});

const mount = (items: Item[]) =>
  mountArrayComponent({
    items,
    defaultValue: undefined,
    props: {},
    Component: EditorArrayComponent
  });

beforeAll(() => {
  Object.assign(performance, { mark: jest.fn(), measure: jest.fn() });
});

describe("EditorArrayComponent clipboard", () => {
  it("has no copied element before a copy", () => {
    expect(mount(flat).instance.getCurrentCopiedElement()).toBeNull();
  });

  it("has no copied element when the copied path does not lead to an item", () => {
    const { instance, store } = mount(flat);

    instance.copy(0);
    act(() => {
      store.dispatch(
        updateCopiedElement({
          value: store.getState().copiedElement.value,
          path: ["items", "0", "value", "items"]
        })
      );
    });

    expect(instance.getCurrentCopiedElement()).toBeNull();
  });

  it.each<{ case: string; index: number; out: Item }>([
    { case: "the first item", index: 0, out: a1 },
    { case: "an item in the middle", index: 1, out: a2 },
    { case: "the last item", index: 2, out: b1 }
  ])("copy keeps $case", ({ index, out }) => {
    const { instance, store } = mount(flat);

    instance.copy(index);

    expect(store.getState().copiedElement.path).toEqual([
      "items",
      "0",
      "value",
      "items",
      String(index)
    ]);
    expect(instance.getCurrentCopiedElement()).toEqual(out);
  });

  it.each<{
    case: string;
    items: Item[];
    copy: number | undefined;
    target: number;
    out: Item[] | undefined;
  }>([
    {
      case: "inserts the copy after an item of the same type",
      items: flat,
      copy: 0,
      target: 1,
      out: [a1, a2, renewed(a1, {}), b1]
    },
    {
      case: "does nothing on an item of another type",
      items: flat,
      copy: 0,
      target: 2,
      out: undefined
    },
    {
      case: "does nothing when nothing was copied",
      items: flat,
      copy: undefined,
      target: 1,
      out: undefined
    },
    {
      case: "inserts a copied Wrapper after a Cloneable",
      items: nested,
      copy: 0,
      target: 1,
      out: [
        w1,
        c1,
        container(WRAPPER, NEW_ID, { showToolbar: "on" }, [
          itemA(NEW_ID, { text: "one", color: "blue" })
        ]),
        w2,
        w3
      ]
    },
    {
      case: "inserts a copied Cloneable after a Wrapper",
      items: nested,
      copy: 1,
      target: 0,
      out: [
        w1,
        container(CLONEABLE, NEW_ID, {}, [itemA(NEW_ID, { text: "two" })]),
        c1,
        w2,
        w3
      ]
    }
  ])("paste $case", ({ items, copy, target, out }) => {
    const { instance, onChange } = mount(items);

    if (copy !== undefined) {
      instance.copy(copy);
    }

    instance.paste(target);

    expect(maskNewIds(onChange.mock.calls, known)).toEqual(
      out ? [[out, { arrayOperation: "insert" }]] : []
    );
  });

  it("paste inserts what the callback returns for the copied element", () => {
    const { instance, onChange } = mount(flat);

    instance.copy(0);
    instance.paste(1, (item: Item) => ({
      ...item,
      value: { ...item.value, text: "from callback" }
    }));

    expect(maskNewIds(onChange.mock.calls, known)).toEqual([
      [
        [a1, a2, renewed(a1, { text: "from callback" }), b1],
        { arrayOperation: "insert" }
      ]
    ]);
  });

  it.each<{
    case: string;
    items: Item[];
    copy: number | undefined;
    target: number;
    device: DeviceMode;
    out: Item[] | undefined;
  }>([
    {
      case: "merges the desktop styles into an item of the same type",
      items: flat,
      copy: 0,
      target: 1,
      device: "desktop",
      out: [
        a1,
        itemA("a2", {
          text: "two",
          color: "blue",
          hoverColor: "navy",
          horizontalAlign: "center",
          verticalAlign: "center"
        }),
        b1
      ]
    },
    {
      case: "merges only the tablet styles in tablet mode",
      items: flat,
      copy: 0,
      target: 1,
      device: "tablet",
      out: [
        a1,
        itemA("a2", {
          text: "two",
          tabletColor: "teal",
          tabletHorizontalAlign: "center"
        }),
        b1
      ]
    },
    {
      case: "does nothing on an item of another type",
      items: flat,
      copy: 0,
      target: 2,
      device: "desktop",
      out: undefined
    },
    {
      case: "does nothing when nothing was copied",
      items: flat,
      copy: undefined,
      target: 1,
      device: "desktop",
      out: undefined
    },
    {
      case: "reaches the element inside a Wrapper of the same content",
      items: nested,
      copy: 0,
      target: 2,
      device: "desktop",
      out: [
        w1,
        c1,
        container(WRAPPER, "w2", { showToolbar: "on" }, [
          itemA("wa2", {
            text: "three",
            color: "blue",
            hoverColor: "pink",
            horizontalAlign: "center",
            verticalAlign: "center"
          })
        ]),
        w3
      ]
    },
    {
      case: "does nothing on a Wrapper of another content",
      items: nested,
      copy: 0,
      target: 3,
      device: "desktop",
      out: undefined
    }
  ])("paste styles $case", ({ items, copy, target, device, out }) => {
    const { instance, onChange, store } = mount(items);

    if (copy !== undefined) {
      instance.copy(copy);
    }

    act(() => {
      store.dispatch(updateUI("deviceMode", device));
    });
    instance.pasteStyles(target);

    expect(onChange.mock.calls).toEqual(
      out ? [[out, { arrayOperation: "itemChange" }]] : []
    );
  });
});
