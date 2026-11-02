import type {
  ElementModel,
  ElementProps
} from "visual/component/Elements/Types";
import type { StoryAnchorAttribute } from "visual/component/Link/types/Slide";
import type * as LinkTarget from "visual/component/Link/types/Target";
import type { Target } from "visual/component/Link/types/Target";
import type * as LinkType from "visual/component/Link/types/Type";
import type { Type } from "visual/component/Link/types/Type";
import type { DeviceMode } from "visual/types";
import type { Block } from "visual/types/Block";
import type { Link } from "visual/utils/models/link";
import type { FormInput } from "../../type";
import type { Active } from "../type";

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
