import { FC } from "react";
import * as Option from "visual/component/Options/Type";
import { FormField } from "visual/component/Prompts/common/GlobalApps/type";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";

interface Config {
  id: string;
  fields: FormField[];
  icon: string;
}

export type Props = Option.Props<undefined> &
  WithClassName &
  WithConfig<Config>;

export type Component = FC<Props>;
