import { Literal } from "visual/utils/types/Literal";

export type Value = {
  population: string | undefined;
  populationEntityType: string | undefined;
  populationEntityId: Literal | undefined;
};
