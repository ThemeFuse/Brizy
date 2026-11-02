import type { Response } from "../common";
import type { Choice } from "./CollectionTypes";

export interface CollectionItems {
  getCollectionItemsIds: {
    handler: (
      res: Response<Choice[]>,
      rej: Response<string>,
      extra: { id: string }
    ) => void;
  };
}
