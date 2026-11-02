import React from "react";
import type { ElementModel } from "visual/component/Elements/Types";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ConfigContext } from "visual/providers/ConfigProvider/context";
import type { ReduxState } from "visual/redux/types";
import type { Block, BlockHtml } from "visual/types/Block";
import type {
  GlobalBlockOverlay,
  GlobalBlockPopup
} from "visual/types/GlobalBlock";

export type StateProps = {
  page: ElementModel;
  getBlockData: (c: ConfigCommon) => Array<Block>;
  getGlobalPopups: (c: ConfigCommon) => Array<GlobalBlockPopup>;
  // Overlay-type global blocks (e.g. Cookie Banner) must be diffed the same
  // way as popups: they are never part of blocksOrder, but any edit still
  // needs to reach the runtime compiler so storeGeneration/compiledGeneration
  // can converge (see waitForCompilation).
  getOverlays: () => Array<GlobalBlockOverlay>;
  blocksHTML: { [key: string]: Partial<BlockHtml> };
  symbols: ReduxState["symbols"]["classes"];
};

export type ContextType = React.ContextType<typeof ConfigContext>;

export type OwnProps = {
  mode: "page" | "popup" | "story";
};
