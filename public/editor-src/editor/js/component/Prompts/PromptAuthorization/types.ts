import { ComponentType } from "react";

export type PromptAuthorizationTabs = {
  id: string;
  title: string;
  icon: string;
  component: ComponentType;
};

export type SignAuthorizationProps = {
  className?: string;
  onSuccess?: () => void;
  onSkip?: () => void;
  onClose?: () => void;
  onLoading?: (isLoading: boolean) => void;
};

export type AuthorizationField = {
  title: string;
  name: string;
  required: boolean;
  type?: string;
};
