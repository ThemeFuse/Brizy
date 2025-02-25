import { FC } from "react";
import * as Option from "visual/component/Options/Type";
import { ConfigTab as PromptTab } from "visual/component/Prompts/PromptForm/types";
import { FormField } from "visual/component/Prompts/common/GlobalApps/type";
import { WithClassName, WithConfig } from "visual/types/attributes";

interface Config {
  id: string;
  fields: FormField[];
  icon: string;
  tabs?: PromptTab[];
}

export type Props = Option.Props<undefined> &
  WithClassName &
  WithConfig<Config>;

export type Component = FC<Props>;
