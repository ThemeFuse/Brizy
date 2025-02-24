import React, { ReactElement, useCallback } from "react";
import Prompts from "visual/component/Prompts";
import { rolesHOC } from "visual/component/Roles";
import Config from "visual/global/Config";
import { Middle as Control } from "../Controls/Middle";
import { Props } from "./types";

const MiddleBlockAdder = (props: Props): ReactElement => {
  const { onAddBlock, onAddTemplate, onAddGlobalBlock } = props;

  const handleOpen = useCallback(() => {
    const config = Config.getAll();
    const showGlobal = typeof config.api?.globalBlocks?.create === "function";

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
  component: MiddleBlockAdder
});
