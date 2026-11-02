import type {
  Choices,
  OptGroup
} from "visual/component/Options/types/common/Population/types/Choices";
import type { PopulationMethod } from "visual/component/Options/types/common/Population/types/PopulationMethod";
import type {
  ChoicesAsync,
  ElementModelValue
} from "visual/component/Options/types/dev/Select/types";
import type { WithClassName } from "visual/types/attributes";

export interface Props<T extends string | number> extends WithClassName {
  isOpen: boolean;
  onOpened: (o: boolean) => void;
  isEntityTypeLoaded: boolean;
  showChoices: boolean;
  choices: (Choices<T> | OptGroup<T>)[];
  currentDCChoice?: PopulationMethod;
  value: T;
  entityType: ElementModelValue;
  entityId: ElementModelValue;
  onChange: (v: string) => void;
  onEntityTypeChange: (v: ElementModelValue) => void;
  onEntityIdChange: (v: ElementModelValue) => void;
  entityTypeChoices: ChoicesAsync;
  entityIdChoices: ChoicesAsync;
  onEntityTypeLoad?: VoidFunction;
}
