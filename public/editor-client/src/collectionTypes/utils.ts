import { getConfig } from "../config";
import { ChoicesSync } from "../types/Choices";
import { MValue } from "../utils/types";

export const getCollectionTypes = (): MValue<ChoicesSync> => {
  const config = getConfig();

  const collectionTypes = config?.collectionTypes;

  if (collectionTypes && Array.isArray(collectionTypes)) {
    return collectionTypes.map(({ label, name }) => ({
      title: label,
      value: name
    }));
  }

  return undefined;
};
