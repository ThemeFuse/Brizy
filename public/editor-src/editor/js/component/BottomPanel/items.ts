import { ReactNode } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import HiddenElementsToggle from "./components/HiddenElementsToggle";
import { PreviewButton } from "./components/PreviewButton";
import PublishButton from "./components/PublishButton";
import { RedoButton } from "./components/RedoButton";
import { UndoButton } from "./components/UndoButton";

export const getComponents = (config: ConfigCommon): Array<ReactNode> => {
  return [
    HiddenElementsToggle,
    UndoButton,
    RedoButton,
    PreviewButton,
    ...(config.ui?.publish?.handler ? [PublishButton] : [])
  ];
};
