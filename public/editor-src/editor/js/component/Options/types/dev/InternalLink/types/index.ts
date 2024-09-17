import * as Option from "visual/component/Options/Type";
import { WithClassName, WithConfig, WithSize } from "visual/types/attributes";
import { MValue } from "visual/utils/value";
import { Choice } from "../../Select/types";

interface Config extends WithSize {
  helper?: string;
  sourceLabel?: string;
}

type OnChange = (s: string) => void;

export type DebouncedSearch = OnChange & _.Cancelable;

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
