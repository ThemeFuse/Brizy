import { Handler } from "./Handler";
import { Value } from "./Value";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { Props as OptionProps } from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/types/attributes";
import { PopulationMethod, PopulationOptgroupMethod } from "./PopulationMethod";

export interface Base {
  iconOnly?: boolean;
  mockValue?: boolean;
  type?: DCTypes;
}

export interface ConfigChoices {
  choices?: Array<PopulationMethod | PopulationOptgroupMethod>;
}

export interface ConfigHandler {
  handlerChoices?: Handler<string>;
}

export type BaseConfig = ConfigChoices | ConfigHandler;

export const isHandler = (c: BaseConfig): c is Required<ConfigHandler> => {
  return "handlerChoices" in c && c.handlerChoices !== undefined;
};

export const isChoices = (c: BaseConfig): c is Required<ConfigChoices> => {
  return "choices" in c && c.choices !== undefined;
};

export type Config = BaseConfig & Base;

export interface Props
  extends OptionProps<Value>,
    WithConfig<Config>,
    WithClassName {
  option?: ToolbarItemType;
  fallback?: ToolbarItemType;
}
