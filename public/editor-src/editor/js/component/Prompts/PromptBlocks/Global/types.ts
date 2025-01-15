import { ComponentType, ReactElement } from "react";
import { FontsPayload } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import { BlockMetaType } from "visual/types";
import { BlockScreenshots } from "visual/utils/screenshots/types";
import { NormalOrPopup } from "../types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export type PromptGlobalBlock<T extends BlockMetaType> = {
  fonts: FontsPayload;
  block: NormalOrPopup<T>["data"];
};

export interface Props<T extends BlockMetaType> {
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
  globalBlocksInPage: ReduxState["globalBlocks"];
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
