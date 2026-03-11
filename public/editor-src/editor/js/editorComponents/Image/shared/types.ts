import React from "react";
import { EditorComponentContextValue } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { RenderType } from "visual/providers/RenderProvider";
import { ReduxState } from "visual/redux/types";
import { DeviceMode } from "visual/types";
import {
  Dimensions,
  ImageSizes,
  ImagesSources,
  Meta,
  Patch,
  V as Value,
  WrapperSizes
} from "../types";

/**
 * Container sizes for different device modes
 */
export interface ContainerSizes {
  desktop: number;
  tablet: number;
  mobile: number;
}

/**
 * State interface for image components
 */
export interface ImageComponentState {
  containerWidth: number;
  tabletContainerWidth: number;
  mobileContainerWidth: number;
  isDragging: boolean;
  sizePatch: Patch | null;
}

/**
 * Previous wrapper sizes for DC value hook
 */
export interface PrevWrapperSizes {
  cW: number;
  cH: number;
}

/**
 * Context required for shared utility functions
 */
export interface ImageUtilsContext {
  /** The container element ref */
  container: React.RefObject<Element>;
  /** Whether the component is mounted */
  mounted: boolean;
  /** Previous wrapper sizes for DC calculations */
  prevWrapperSizes: PrevWrapperSizes;
  /** Current component state */
  state: ImageComponentState;
  /** Component meta props */
  meta: Meta;
  /** Render context (editor or view) */
  renderContext: RenderType;
  /** Editor component context */
  editorContext: EditorComponentContextValue;
  /** Redux state */
  reduxState: ReduxState;
  /** Global config */
  config: ConfigCommon;
  /** Current device mode */
  deviceMode: DeviceMode;
  /** Get current value */
  getValue: () => Value;
  /** Get value with v property */
  getValue2: () => { v: Value };
  /** Set state callback */
  setState: (
    updater:
      | Partial<ImageComponentState>
      | ((prev: ImageComponentState) => Partial<ImageComponentState>),
    callback?: () => void
  ) => void;
  /** Update previous wrapper sizes */
  updatePrevWrapperSizes: (sizes: PrevWrapperSizes) => void;
  /** Patch value callback */
  patchValue: (patch: Partial<Value>) => void;
}

/**
 * Extra image attributes for dynamic content
 */
export interface ExtraImageAttributes {
  loading?: "lazy" | "eager";
  alt: string;
  title: string;
}

/**
 * Result of image URL calculation
 */
export interface ImageUrlResult {
  source: string | null;
  url: string;
}

/**
 * Result of hover image URL calculation
 */
export interface HoverImageUrlResult {
  hoverSource?: string;
  hoverUrl?: string;
  isHover?: boolean;
}

/**
 * DC Value hook result
 */
export interface DCValueHookResult {
  key: string;
  attr: Record<string, unknown>;
  fallback?: string;
  hasDC: boolean;
  staticValue: unknown;
  dcValue: string;
  entityType?: unknown;
  entityId?: unknown;
}

/**
 * Extended wrapper sizes with hover desktop
 */
export interface ExtendedWrapperSizes extends WrapperSizes {
  hoverDesktop?: {
    width: number;
    height: number;
  };
}

/**
 * Union type for all possible image patch results
 */
export type ImagePatchResult = Record<string, unknown>;

export type { Value, Patch, WrapperSizes, ImageSizes, ImagesSources, Dimensions, Meta };
