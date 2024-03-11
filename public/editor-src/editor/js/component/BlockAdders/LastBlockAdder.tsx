import React, { ReactElement, useCallback } from "react";
import Prompts from "visual/component/Prompts";
import { PromptGlobalBlock } from "visual/component/Prompts/PromptBlocks/Global/types";
import {
  PromptBlock,
  PromptBlockTemplate
} from "visual/component/Prompts/PromptBlocks/types";
import { rolesHOC } from "visual/component/Roles";
import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types";
import { isShopify } from "visual/global/Config/types/configs/Cloud";
import { Last as Control } from "./Controls/Last";

interface Props {
  onAddBlock?: (block: PromptBlock) => void;
  onAddTemplate?: (template: PromptBlockTemplate) => void;
  onAddGlobalBlock?: (block: PromptGlobalBlock<"normal">) => void;
}

const LastBlockAdder = (props: Props): ReactElement => {
  const { onAddBlock, onAddTemplate, onAddGlobalBlock } = props;

  const handleOpen = useCallback(() => {
    const config = Config.getAll();
    // TODO: https://github.com/bagrinsergiu/blox-editor/issues/24123
    const showGlobal = !(isCloud(config) && isShopify(config));

    Prompts.open({
      prompt: "blocks",
      mode: "single",
      props: {
        type: "normal",
        showGlobal,
        onChangeBlocks: onAddBlock,
        onChangeTemplate: onAddTemplate,
        onChangeSaved: onAddTemplate,
        onChangeGlobal: onAddGlobalBlock
      }
    });
  }, [onAddBlock, onAddGlobalBlock, onAddTemplate]);

  return <Control onClick={handleOpen} />;
};

export default rolesHOC({
  allow: ["admin"],
  fallbackRender: undefined,
  component: LastBlockAdder
});
