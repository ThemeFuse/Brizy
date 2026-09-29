import type { ReactNode } from "react";
import type { OnChange, SimpleValue } from "visual/component/Options/Type";
import type { ChoiceWithPermalink } from "visual/component/Options/types/dev/InternalLink/types";
import type { Literal } from "visual/utils/types/Literal";
import type { MValue } from "visual/utils/value";

export enum Status {
  INITIAL = "initial",
  SUCCESS = "success",
  ERROR = "error",
  NO_RESULT = "no_result"
}

export type Choice = {
  title: string;
  value: Literal;
};

export type ChoicesAsync = {
  load: (abortSignal?: AbortSignal) => Promise<Choice[]>;
  emptyLoad?: {
    title?: string;
  };
};

export interface Props {
  className: string;
  value: MValue<ChoiceWithPermalink>;
  placeholder?: string;
  items: Choice[];
  label: ReactNode;
  source: string;
  sourceLabel?: string;
  sourceHelper?: string;
  choices: ChoicesAsync;
  status: Status;
  loading: boolean;
  resetValue: VoidFunction;
  onSearch: (v: string) => void;
  onChange: (v: Choice) => void;
  onSourceChange: OnChange<SimpleValue<Literal>>;
}
