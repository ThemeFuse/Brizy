import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { Form2FieldOption } from "../migrations/type";
import { Value } from "./type";

class Form2FieldItems extends EditorArrayComponent {
  static get componentId(): ElementTypes.Form2FieldItems {
    return ElementTypes.Form2FieldItems;
  }

  getItemProps(itemData: Value, itemIndex: number, items: Value[]) {
    const props = super.getItemProps(itemData, itemIndex, items);
    const itemProps = this.props.itemProps;

    // @ts-expect-error EditorArrayComponent should be converted to .ts
    const { type, toolbarExtend, activeRadio, handleRadioChange, name } =
      itemProps;
    const { attr } = this.props;

    return {
      ...props,
      attr,
      type,
      name,
      onRemove: (e: MouseEvent): void => {
        e.stopPropagation();
        this.removeItem(itemIndex);
      },
      onChange: (v: Form2FieldOption): void => {
        this.updateItem(itemIndex, v);
      },
      toolbarExtend,
      activeRadioItem: activeRadio === itemIndex,
      onClickRadioIcon: () => handleRadioChange(itemIndex)
    };
  }
}

export default Form2FieldItems;
