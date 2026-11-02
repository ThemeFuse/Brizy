import FlipboxItems from "visual/editorComponents/Flipbox/Items";
import {
  itemA,
  mountArrayComponent
} from "../../../../../jest-utils/arrayComponent";
import defaultValue from "../defaultValue.json";

// Each side of a flipbox gets its own background, read from the flipbox value.

const v = {
  ...defaultValue.style,
  ...defaultValue.content,
  bgColorHex: "#111111",
  backBgColorHex: "#333333"
};

const mount = () =>
  mountArrayComponent({
    items: [itemA("front", {}), itemA("back", {}), itemA("third", {})],
    defaultValue: undefined,
    props: { itemProps: { v, animationClassName: "flip" } },
    Component: FlipboxItems
  });

describe("FlipboxItems", () => {
  it.each([
    { index: 0, type: "front", bgColorHex: "#111111" },
    { index: 1, type: "back", bgColorHex: "#333333" },
    { index: 2, type: "front", bgColorHex: "#111111" }
  ])("item $index is the $type side", ({ index, type, bgColorHex }) => {
    const { props } = mount().rendered()[index];
    const backgroundValue = Object(props.backgroundValue);

    expect({
      type: props.type,
      animationClassName: props.animationClassName,
      bgColorHex: backgroundValue.bgColorHex
    }).toEqual({ type, animationClassName: "flip", bgColorHex });
  });
});
