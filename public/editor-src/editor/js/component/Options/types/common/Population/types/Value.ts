import { Literal } from "visual/utils/types/Literal";
import { SimpleValue } from "visual/component/Options/Type";

export type ElementModelValue = SimpleValue<Literal>;

export type Value = {
  population: string | undefined;
  populationEntityType: string | undefined;
  populationEntityId: Literal | undefined;
};
