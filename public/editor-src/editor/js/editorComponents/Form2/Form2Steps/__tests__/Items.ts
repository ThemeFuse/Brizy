import { noop } from "es-toolkit";
import Form2Steps from "visual/editorComponents/Form2/Form2Steps/Items";
import {
  type Item,
  itemA,
  maskNewIds,
  mountArrayComponent,
  NEW_ID
} from "../../../../../../jest-utils/arrayComponent";
import { type Props, ViewType } from "../types";

// the real toolbar pulls in the font prompts, which need browser APIs jsdom lacks
jest.mock("visual/component/Toolbar", () => ({
  __esModule: true,
  hideToolbar: () => undefined
}));

// Duplicating a step of a multistep form inserts a copy of it with new ids.

const s1 = itemA("s1", { name: "Step 1" });
const s2 = itemA("s2", { name: "Step 2" });
const list = [s1, s2];

const itemProps: Props = {
  viewType: ViewType.Icon,
  activeStep: 1,
  labelType: "outside",
  placeholder: true,
  multistep: "on",
  toolbarExtendFields: { id: "fields", type: "button", onClick: noop },
  onActiveChange: noop
};

const mount = () =>
  mountArrayComponent({
    items: list,
    defaultValue: undefined,
    props: { itemProps },
    Component: Form2Steps
  });

describe("Form2Steps", () => {
  it.each<{
    case: string;
    args: [number, number?];
    out: Item[];
  }>([
    {
      case: "right after the step",
      args: [0],
      out: [s1, itemA(NEW_ID, { name: "Step 1" }), s2]
    },
    {
      case: "at the given index",
      args: [0, 2],
      out: [s1, s2, itemA(NEW_ID, { name: "Step 1" })]
    }
  ])("cloneItem inserts the copy $case", ({ args, out }) => {
    const { instance, onChange } = mount();

    instance.cloneItem(...args);

    expect(onChange).toHaveBeenCalledTimes(1);

    const [value, meta] = onChange.mock.calls[0];

    expect(maskNewIds(value, ["s1", "s2"])).toEqual(out);
    expect(meta).toEqual({ arrayOperation: "insert" });
  });

  it("cloneItem refuses an index that holds no step", () => {
    const { instance, onChange } = mount();

    expect(() => instance.cloneItem(5)).toThrow(
      "Can't clone invalid item at index 5"
    );
    expect(onChange).not.toHaveBeenCalled();
  });
});
