import { Response } from "../common";
import { Choice } from "./CollectionTypes";

export interface CollectionItems {
  getCollectionItemsIds: {
    handler: (
      res: Response<Choice[]>,
      rej: Response<string>,
      extra: { id: string }
    ) => void;
  };
}
