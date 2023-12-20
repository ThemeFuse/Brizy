import React, { ReactElement, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Prompts, { PromptsProps } from "visual/component/Prompts";
import { PromptGlobalBlock } from "visual/component/Prompts/PromptBlocks/Global/types";
import { PromptBlock } from "visual/component/Prompts/PromptBlocks/types";
import { rolesHOC } from "visual/component/Roles";
import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types";
import { isShopify } from "visual/global/Config/types/configs/Cloud";
import { setDeviceMode } from "visual/redux/actions2";
import { deviceModeSelector } from "visual/redux/selectors";
import { DeviceMode } from "visual/types";
import { t } from "visual/utils/i18n";
import { First as Control } from "./Controls/First";

interface TextsDevice {
  title: string;
  description: string;
}

interface Props {
  deviceMode: DeviceMode;
  onAddBlock: (data: PromptBlock) => void;
  onAddGlobalPopup: (data: PromptGlobalBlock<"popup">) => void;
  setDeviceMode: (device: DeviceMode) => void;
}

const getDeviceTexts = (device: DeviceMode): TextsDevice => {
  switch (device) {
    case "desktop": {
      return {
        title: t("START BUILDING YOUR POPUP"),
        description: t("Press the button above to add popup")
      };
    }
    case "tablet": {
      return {
        title: t("SWITCH TO DESKTOP"),
        description: t("Switch to desktop to add popup")
      };
    }
    case "mobile": {
      return {
        title: t("SWITCH TO DESKTOP"),
        description: t("Switch to desktop to add popup")
      };
    }
  }
};

const FirstPopupBlockAdder = (props: Props): ReactElement => {
  const { onAddBlock, onAddGlobalPopup } = props;
  const dispatch = useDispatch();
  const deviceMode = useSelector(deviceModeSelector);
  const { title, description } = getDeviceTexts(deviceMode);
  const icon =
    deviceMode === "mobile" || deviceMode === "tablet"
      ? "nc-desktop"
      : undefined;
  const iconClassName =
    deviceMode === "mobile" || deviceMode === "tablet"
      ? "floating-action-button--icon"
      : undefined;

  const handleOpen = useCallback((): void => {
    if (deviceMode === "desktop") {
      const config = Config.getAll();
      ///// TODO: https://github.com/bagrinsergiu/blox-editor/issues/24123
      const showGlobal = !(isCloud(config) && isShopify(config));

      const data: PromptsProps<"popup"> = {
        prompt: "blocks",
        mode: "single",
        props: {
          type: "popup",
          showTemplate: false,
          blocksType: false,
          globalSearch: false,
          showGlobal,
          onChangeBlocks: onAddBlock,
          onChangeGlobal: onAddGlobalPopup,
          onChangeSaved: (data) => {
            const { fonts, blocks, extraFontStyles } = data;
            onAddBlock({ fonts, extraFontStyles, block: blocks[0] });
          }
        }
      };
      Prompts.open(data);
    } else {
      dispatch(setDeviceMode("desktop"));
    }
  }, [deviceMode, dispatch, onAddBlock, onAddGlobalPopup]);

  return (
    <Control
      onClick={handleOpen}
      title={title}
      description={description}
      iconClassName={iconClassName}
      icon={icon}
    />
  );
};

export default rolesHOC({
  allow: ["admin"],
  fallbackRender: undefined,
  component: FirstPopupBlockAdder
});
