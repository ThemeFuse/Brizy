import { ChoiceWithPermalink } from "visual/component/Options/types/dev/InternalLink/types";
import { Choice } from "visual/component/Options/types/dev/Select/types";
import { MValue } from "visual/utils/value";

export enum Status {
  INITIAL = "initial",
  SUCCESS = "success",
  ERROR = "error",
  NO_RESULT = "no_result"
}

export interface Props {
  className: string;
  value: MValue<ChoiceWithPermalink>;
  placeholder?: string;
  items: Choice[];
  status: Status;
  loading: boolean;
  resetValue: VoidFunction;
  onSearch: (v: string) => void;
  onChange: (v: Choice) => void;
}
