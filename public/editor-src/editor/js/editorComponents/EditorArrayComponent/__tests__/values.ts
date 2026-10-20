import type { ElementModel } from "visual/component/Elements/Types";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { rulesSelector } from "visual/redux/selectors";
import {
  container,
  type Item,
  itemA,
  itemB,
  mountArrayComponent,
  WRAPPER
} from "../../../../../jest-utils/arrayComponent";

// The value of the list is the stored list, or the default one; the value of
// one item is its component's defaults, then its style rules, then what is stored.

const a1 = itemA("a1", { text: "one" });
const b1 = itemB("b1", { label: "two" });
const RULE = "wrapper--iconText";

const mount = (items: Item[] | undefined, defaultValue: Item[] | undefined) =>
  mountArrayComponent({
    items,
    defaultValue,
    props: {},
    Component: EditorArrayComponent
  });

describe("EditorArrayComponent values", () => {
  it.each<{
    case: string;
    items: Item[] | undefined;
    defaultValue: Item[] | undefined;
    out: Item[];
    defaultOut: Item[];
  }>([
    {
      case: "the stored list",
      items: [a1, b1],
      defaultValue: [b1],
      out: [a1, b1],
      defaultOut: [b1]
    },
    {
      case: "the default list when nothing is stored",
      items: undefined,
      defaultValue: [b1],
      out: [b1],
      defaultOut: [b1]
    },
    {
      case: "an empty list when there is neither",
      items: undefined,
      defaultValue: undefined,
      out: [],
      defaultOut: []
    }
  ])("the value is $case", ({ items, defaultValue, out, defaultOut }) => {
    const { instance } = mount(items, defaultValue);

    expect(instance.getValue()).toEqual(out);
    expect(instance.getValue2()).toEqual({ v: out });
    expect(instance.getDefaultValue()).toEqual(defaultOut);
  });

  it("the value is the very list that is stored", () => {
    const items = [a1, b1];
    const { instance } = mount(items, undefined);

    expect(instance.getValue()).toBe(items);
    expect(instance.getValue2().v).toBe(items);
  });

  it.each<{
    case: string;
    item: Item;
    out: (rule: ElementModel) => ElementModel;
  }>([
    {
      case: "defaults under the stored keys",
      item: itemA("a1", { text: "one", color: "blue" }),
      out: () => ({
        color: "blue",
        hoverColor: "pink",
        tabletColor: "orange",
        horizontalAlign: "center",
        tabletHorizontalAlign: "center",
        verticalAlign: "center",
        text: "one",
        _id: "a1"
      })
    },
    {
      case: "a style rule over the defaults",
      item: container(WRAPPER, "w1", { _styles: [RULE] }, []),
      out: (rule) => ({
        showToolbar: "off",
        ...rule,
        _id: "w1",
        _styles: [RULE],
        items: []
      })
    },
    {
      case: "the stored keys over a style rule",
      item: container(
        WRAPPER,
        "w1",
        { _styles: [RULE], showToolbar: "stored" },
        []
      ),
      out: (rule) => ({
        ...rule,
        showToolbar: "stored",
        _id: "w1",
        _styles: [RULE],
        items: []
      })
    },
    {
      case: "nothing for a style rule that does not exist",
      item: container(WRAPPER, "w1", { _styles: ["test-no-such-rule"] }, []),
      out: () => ({
        showToolbar: "off",
        _id: "w1",
        _styles: ["test-no-such-rule"],
        items: []
      })
    }
  ])("the value of an item has $case", ({ item, out }) => {
    const { instance, store } = mount([b1, item], undefined);
    const rule = Reflect.get(rulesSelector(store.getState()), RULE);

    expect(Object.keys(rule)).not.toEqual([]);
    expect(instance.getItemValue(1)).toEqual(out(rule));
  });
});
