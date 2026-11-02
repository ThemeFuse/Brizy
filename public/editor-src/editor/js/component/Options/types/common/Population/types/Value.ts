import type { SimpleValue } from "visual/component/Options/Type";
import type { Literal } from "visual/utils/types/Literal";

export type ElementModelValue = SimpleValue<Literal>;

export type Value = {
  population: string | undefined;
  populationEntityType: string | undefined;
  populationEntityId: Literal | undefined;
};
