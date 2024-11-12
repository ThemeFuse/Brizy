import { ElementProps } from "visual/component/Elements/Types";
import { Active } from "../../type";
import React from "react";
import { MValue } from "visual/utils/value";
import * as LinkTarget from "visual/component/Link/types/Target";
import { StoryAnchorAttribute } from "visual/component/Link/types/Slide";
import * as LinkType from "visual/component/Link/types/Type";

type CheckboxActive = (active: Record<string, boolean>) => React.JSX.Element;

interface Common extends ElementProps {
  value: string;
  isEditor: boolean;
  onRemove: VoidFunction;
}

export interface SelectItemProps extends Common {
  renderIconTrash: boolean;
  handleSelectInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CheckboxItemProps extends Common {
  required?: boolean;
  type?: string;
  active: Active;
  label?: string;
  handleInputChange: (e: string) => void;
  handleChangeActive: (index: Active) => void;
  renderCheckboxIconPreview: CheckboxActive;
  renderCheckboxIconEditor: CheckboxActive;
  typeCheckbox?: LinkType.Type;
  hrefCheckbox?: MValue<string>;
  targetCheckbox?: MValue<LinkTarget.Target>;
  relCheckbox?: MValue<string>;
  slideCheckbox?: MValue<StoryAnchorAttribute>;
}

export interface RadioItemProps extends Common {
  label?: string;
  placeholder: string;
  handleInputChange: (e: string) => void;
  handleRadioIconClick: VoidFunction;
}
