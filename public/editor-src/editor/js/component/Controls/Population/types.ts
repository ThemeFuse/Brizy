import {
  Choices,
  OptGroup
} from "visual/component/Options/types/common/Population/types/Choices";
import { PopulationMethod } from "visual/component/Options/types/common/Population/types/PopulationMethod";
import {
  ChoicesAsync,
  ElementModelValue
} from "visual/component/Options/types/dev/Select/types";
import { WithClassName } from "visual/utils/options/attributes";

export interface Props<T extends string | number> extends WithClassName {
  isOpen: boolean;
  isEntityTypeLoaded: boolean;
  showChoices: boolean;
  choices: (Choices<T> | OptGroup<T>)[];
  currentDCChoice?: PopulationMethod;
  value: T;
  entityType: ElementModelValue;
  entityId: ElementModelValue;
  handleClickOutside: VoidFunction;
  onChange: (v: string) => void;
  onEntityTypeChange: (v: ElementModelValue) => void;
  onEntityIdChange: (v: ElementModelValue) => void;
  handleIconClick: VoidFunction;
  entityTypeChoices: ChoicesAsync;
  entityIdChoices: ChoicesAsync;
  onEntityTypeLoad?: VoidFunction;
}
