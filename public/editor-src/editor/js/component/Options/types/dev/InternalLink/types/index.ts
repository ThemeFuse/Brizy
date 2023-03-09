import * as Option from "visual/component/Options/Type";
import {
  WithClassName,
  WithConfig,
  WithSize
} from "visual/utils/options/attributes";
import { MValue } from "visual/utils/value";
import { Post } from "./Post";

interface Config extends WithSize {
  postType?: string;
}

type OnChange = (s: string) => void;

export type DebouncedSearch = OnChange & _.Cancelable;

export type Props = Option.Props<MValue<Post>> &
  WithConfig<Config> &
  WithClassName & {
    placeholder?: string;
  };
