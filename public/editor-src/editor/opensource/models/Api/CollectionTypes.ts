import { Response } from "../common";

export interface Choice {
  title: string;
  value: string | number;
}

export interface CollectionTypes {
  loadCollectionTypes: {
    handler: (
      res: Response<Choice[]>,
      rej: Response<string>,
      extraData?: { defaultTitle?: string; defaultValue?: string }
    ) => void;
  };
}
