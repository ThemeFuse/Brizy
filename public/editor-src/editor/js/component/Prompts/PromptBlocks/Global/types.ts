import type { ComponentType, ReactElement } from "react";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { FontsPayload } from "visual/redux/actions2";
import type { ReduxState } from "visual/redux/types";
import type { BlockScreenshots } from "visual/utils/screenshots/types";
import type { NormalOrPopup, PromptBlockMetaType } from "../types";

export type PromptGlobalBlock<T extends PromptBlockMetaType> = {
  fonts: FontsPayload;
  block: NormalOrPopup<T>["data"];
};

export interface Props<T extends PromptBlockMetaType> {
  type: T;
  showSearch?: boolean;
  showSidebar?: boolean;
  onAddBlocks: (b: PromptGlobalBlock<T>) => void;
  onClose: VoidFunction;
  HeaderSlotLeft?: ComponentType;
  config: ConfigCommon;
}

export interface StateToProps {
  globalBlocks: ReduxState["globalBlocks"];
  getGlobalBlocksInPage: (config: ConfigCommon) => ReduxState["globalBlocks"];
  projectFonts: ReduxState["fonts"];
}

export interface State {
  search: string;
}

export interface Thumbnail extends BlockScreenshots {
  uid: string;
  thumbnailSrc: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  showRemoveIcon: boolean;
  renderWrapper: (r: ReactElement) => ReactElement;
  inactive: boolean;
  dataVersion: number;
  title?: string;
  tags?: string;
}

export interface Filter {
  tags: string;
  search: string;
}
