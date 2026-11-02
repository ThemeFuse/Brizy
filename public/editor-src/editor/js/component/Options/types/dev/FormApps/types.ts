import type { FC } from "react";
import type * as Option from "visual/component/Options/Type";
import type { FormField } from "visual/component/Prompts/common/GlobalApps/type";
import type { ConfigTab as PromptTab } from "visual/component/Prompts/PromptForm/types";
import type { WithClassName, WithConfig } from "visual/types/attributes";

export interface Config {
  id: string;
  fields: FormField[];
  icon: string;
  tabs?: PromptTab[];
}

export type Props = Option.Props<undefined> &
  WithClassName &
  WithConfig<Config>;

export type Component = FC<Props>;
