import React, { ReactElement, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Prompts from "visual/component/Prompts";
import { PromptTabsId } from "visual/component/Prompts/PromptBlocks/types";
import { rolesHOC } from "visual/component/Roles";
import { useConfig } from "visual/global/hooks";
import { setDeviceMode } from "visual/redux/actions2";
import { deviceModeSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { First as Control } from "../Controls/First";
import { Props } from "./types";

const getTextsByDeviceMode = () => ({
  desktop: {
    title: t("START BUILDING YOUR PAGE"),
    description: t("Press the button above to add blocks")
  },
  tablet: {
    title: t("SWITCH TO DESKTOP"),
    description: t("Switch to desktop to add blocks")
  },
  mobile: {
    title: t("SWITCH TO DESKTOP"),
    description: t("Switch to desktop to add blocks")
  }
});

const FirstBlockAdder = (props: Props): ReactElement => {
  const { onAddBlock, onAddTemplate, onAddGlobalBlock } = props;
  const dispatch = useDispatch();
  const deviceMode = useSelector(deviceModeSelector);
  const config = useConfig();

  const handleOpen = useCallback(() => {
    const showGlobal = typeof config.api?.globalBlocks?.create === "function";
    const activeTab = config.ui?.prompts?.blockAdder?.activeTab as PromptTabsId;

    if (deviceMode === "desktop") {
      Prompts.open({
        prompt: "blocks",
        mode: "single",
        props: {
          ...(activeTab ? { activeTab } : {}),
          type: "normal",
          showGlobal,
          onChangeBlocks: onAddBlock,
          onChangeGlobal: onAddGlobalBlock,
          onChangeSaved: onAddTemplate,
          onChangeTemplate: onAddTemplate
        }
      });
    } else {
      dispatch(setDeviceMode("desktop"));
    }
  }, [
    deviceMode,
    config,
    dispatch,
    onAddBlock,
    onAddGlobalBlock,
    onAddTemplate
  ]);

  const docs = getTextsByDeviceMode();
  const { title, description } = docs[deviceMode];
  const icon =
    deviceMode === "mobile" || deviceMode === "tablet"
      ? "nc-desktop"
      : undefined;
  const iconClassName =
    deviceMode === "mobile" || deviceMode === "tablet"
      ? "floating-action-button--icon"
      : undefined;

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
  component: FirstBlockAdder
});
