import type { Props as OptionProps } from "visual/component/Options/Type";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import type { DCTypes } from "visual/global/Config/types/DynamicContent";
import type { WithClassName, WithConfig } from "visual/types/attributes";
import type { Handler } from "./Handler";
import type {
  PopulationMethod,
  PopulationOptgroupMethod
} from "./PopulationMethod";
import type { Value } from "./Value";

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
