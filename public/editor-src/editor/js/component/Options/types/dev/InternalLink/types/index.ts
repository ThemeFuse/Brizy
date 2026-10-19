import type { DebouncedFunction } from "es-toolkit";
import type * as Option from "visual/component/Options/Type";
import type {
  WithClassName,
  WithConfig,
  WithSize
} from "visual/types/attributes";
import type { MValue } from "visual/utils/value";
import type { Choice } from "../../Select/types";

export interface Config extends WithSize {
  helper?: string;
  sourceLabel?: string;
}

export type DebouncedSearch = DebouncedFunction<(s: string) => void>;

export type Props = Option.Props<MValue<ChoiceWithPermalink>> &
  WithConfig<Config> &
  WithClassName & {
    placeholder?: string;
  };

export interface ChoiceWithPermalink extends Choice {
  populationPermalink?: string;
  id?: string;
  source?: string;
}

export type ChoicesSync = ChoiceWithPermalink[];
