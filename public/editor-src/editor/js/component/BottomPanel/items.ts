import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import HelpButton from "./components/HelpButton";
import HiddenElementsToggle from "./components/HiddenElementsToggle";
import { PreviewButton } from "./components/PreviewButton";
import PublishButton from "./components/PublishButton";
import { RedoButton } from "./components/RedoButton";
import { UndoButton } from "./components/UndoButton";

type Component = () => JSX.Element;

export const getComponents = (
  config: ConfigCommon
): Array<Component | typeof PublishButton> => {
  return [
    ...(config.ui?.help?.showIcon ? [HelpButton] : []),
    HiddenElementsToggle,
    UndoButton,
    RedoButton,
    PreviewButton,
    ...(config.ui?.publish?.handler ? [PublishButton] : [])
  ];
};

export default [
  HelpButton,
  HiddenElementsToggle,
  UndoButton,
  RedoButton,
  PreviewButton,
  PublishButton
];
