import { Literal } from "../utils/types/Literal";
import { MValue } from "../utils/value";

export interface Post {
  id: string;
  title: string;
}

export type Choice = {
  icon?: string;
  title: string;
  value: Literal;
};

export enum Status {
  INITIAL = "initial",
  SUCCESS = "success",
  ERROR = "error",
  NO_RESULT = "no_result"
}

export interface Props {
  className?: string;
  value: MValue<Post>;
  placeholder?: string;
  items: Choice[];
  status: Status;
  isLoading?: boolean;
  resetValue: VoidFunction;
  onSearch: (v: string) => void;
  onChange: (v: Choice) => void;
}
