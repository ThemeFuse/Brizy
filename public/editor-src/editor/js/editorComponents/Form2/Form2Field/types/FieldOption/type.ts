import { ElementModel, ElementProps } from "visual/component/Elements/Types";
import { DeviceMode } from "visual/types";
import { Active } from "../type";
import { FormInput } from "../../type";

export interface Value extends ElementModel {
  label: string;
  value: string;
}

export interface Props extends ElementProps {
  type: FormInput.Select | FormInput.Radio | FormInput.Checkbox;

  label?: string;
  placeholder: string;
  required: boolean;

  deviceMode: DeviceMode;

  itemIndex: number;
  activeRadio: number;
  active: Active;
  renderItemAdder: boolean;

  onRemove: VoidFunction;
  onAdd: (value: string) => void;
  handleChangeActive: (index: Active) => void;
  onClickRadioIcon: VoidFunction;
}
