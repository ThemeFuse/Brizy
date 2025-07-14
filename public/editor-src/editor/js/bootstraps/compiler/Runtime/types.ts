import React from "react";
import { ElementModel } from "visual/component/Elements/Types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ConfigContext } from "visual/providers/ConfigProvider/context";
import { Block, BlockHtml } from "visual/types/Block";
import { GlobalBlockPopup } from "visual/types/GlobalBlock";

export type StateProps = {
  page: ElementModel;
  getBlockData: (c: ConfigCommon) => Array<Block>;
  getGlobalPopups: (c: ConfigCommon) => Array<GlobalBlockPopup>;
  blocksHTML: { [key: string]: Partial<BlockHtml> };
};

export type ContextType = React.ContextType<typeof ConfigContext>;

export type OwnProps = {
  mode: "page" | "popup" | "story";
};
