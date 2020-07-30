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
  formFields: [];
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
  options: PromptConditionsOption[];
  onClose?: () => void;
};

export type PromptFontsProps = {
  onClose?: () => void;
};

export type PromptKeyHelperProps = {
  onClose?: () => void;
};
