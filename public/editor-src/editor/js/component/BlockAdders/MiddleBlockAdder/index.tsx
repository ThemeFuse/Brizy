import React, { ReactElement, useCallback } from "react";
import Prompts from "visual/component/Prompts";
import { PromptTabsId } from "visual/component/Prompts/PromptBlocks/types";
import { rolesHOC } from "visual/component/Roles";
import { useConfig } from "visual/global/hooks";
import { Middle as Control } from "../Controls/Middle";
import { Props } from "./types";

const MiddleBlockAdder = (props: Props): ReactElement => {
  const { onAddBlock, onAddTemplate, onAddGlobalBlock } = props;
  const config = useConfig();

  const handleOpen = useCallback(() => {
    const showGlobal = typeof config.api?.globalBlocks?.create === "function";
    const activeTab = config.ui?.prompts?.blockAdder?.activeTab as PromptTabsId;

    Prompts.open({
      prompt: "blocks",
      mode: "single",
      props: {
        ...(activeTab ? { activeTab } : {}),
        type: "normal",
        showGlobal,
        onChangeBlocks: onAddBlock,
        onChangeTemplate: onAddTemplate,
        onChangeSaved: onAddTemplate,
        onChangeGlobal: onAddGlobalBlock
      }
    });
  }, [config, onAddBlock, onAddGlobalBlock, onAddTemplate]);

  return <Control onClick={handleOpen} />;
};

export default rolesHOC({
  allow: ["admin"],
  fallbackRender: undefined,
  component: MiddleBlockAdder
});
