import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export type PromptAuthorizationTabs<T> = {
  id: string;
  title: string;
  icon: string;
  component: T;
};

export type SignAuthorizationProps = {
  checkCompatibilityAfter?: boolean;
  config: ConfigCommon;
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
