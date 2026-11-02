import type { FormField } from "visual/component/Prompts/common/GlobalApps/type";
import type { ConfigTab as PromptFormTab } from "visual/component/Prompts/PromptForm/types";

export type PromptIconProps = {
  name: string;
  type: string;
  onChange: () => {
    name: string;
    type: string;
    uid?: string;
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
  tabs?: PromptFormTab[];
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

export type PromptsOpenProps<T> = Omit<
  T,
  Extract<keyof T, "config" | "editorMode">
>;
