import { getConfig } from "src/config";
import { ChoicesSync } from "src/types/Choices";
import { MValue } from "src/utils/types";

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
