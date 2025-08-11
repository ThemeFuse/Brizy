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

export interface ContainerProps {
  className?: string;
  acceptedElements: Array<string>;
}

export interface ItemsProps {
  meta: Record<string, unknown>;
  itemProps: Record<string, unknown>;
  sliceStartIndex: number;
  sliceEndIndex: number;
  acceptedElements?: Array<string>;
}

export type SortableAcceptElements = (
  from: { sortableNode: Element; elementNode: Element; elementType: string },
  to: { sortableNode: Element }
) => boolean;
