import { ComponentType } from "react";
import { DeviceMode } from "visual/types";

export interface DynamicContentProps {
  placeholder: string;
  placeholderIcon?: string;
  placeholderHeight?: number;
  className?: string;
  tagName?: keyof JSX.IntrinsicElements;
  blocked?: boolean;
  onSuccess?: (h: string) => void;
}

export interface ThirdPartyProps {
  device?: DeviceMode;
  DynamicContent?: ComponentType<DynamicContentProps>;
}
