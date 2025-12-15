import { ElementModel, ElementProps } from "visual/component/Elements/Types";
import { StoryAnchorAttribute } from "visual/component/Link/types/Slide";
import { Target } from "visual/component/Link/types/Target";
import * as LinkTarget from "visual/component/Link/types/Target";
import { Type } from "visual/component/Link/types/Type";
import * as LinkType from "visual/component/Link/types/Type";
import { DeviceMode } from "visual/types";
import { Block } from "visual/types/Block";
import { Link } from "visual/utils/models/link";
import { FormInput } from "../../type";
import { Active } from "../type";

export interface Value extends ElementModel {
  label: string;
  value: string;

  linkPage: string;
  popups: Block[];
  linkPopup: string;
  linkLightBox: string;
  linkExternal: string;
  linkExternalBlank: Target;
  linkExternalRel: string;
  linkPopulation: string;
  linkAnchor: string;
  linkUpload: string;
  linkExternalType: "linkExternal" | "linkPopulation";
  linkType: Type;
  customID: string;
  linkToSlide: number;
}

export interface Props extends ElementProps {
  type:
    | FormInput.Select
    | FormInput.Radio
    | FormInput.Checkbox
    | FormInput.UserAgreementCheckbox;

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

export interface ConvertedLinkData {
  isCheckboxWithLink?: Link;
  typeCheckbox?: LinkType.Type;
  hrefCheckbox?: string;
  targetCheckbox?: LinkTarget.Target;
  relCheckbox?: string;
  slideCheckbox?: StoryAnchorAttribute;
}
