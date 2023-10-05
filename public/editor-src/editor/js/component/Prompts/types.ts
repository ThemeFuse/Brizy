import { FormField } from "visual/component/Prompts/common/GlobalApps/type";

export type PromptIconProps = {
  name: string;
  type: string;
  onChange: () => {
    name: string;
    type: string;
  };
  onClose?: () => void;
};

export type PromptAppsProps = {
  service: string;
  group: string;
  onClose?: () => void;
};

export type PromptFormProps = {
  formId: string;
  formFields: FormField[];
  onClose?: () => void;
};

type PromptConditionsOption = {
  id: string;
  type: string;
  icon: string;
  label: string;
  title: string;
};

export type PromptConditionsProps = {
  context: "block" | "popup";
  options: PromptConditionsOption[];
  onClose?: () => void;
};

export type PromptFontsProps = {
  onClose?: () => void;
};

export type PromptKeyHelperProps = {
  onClose?: () => void;
};
