import { ChoicesSync } from "visual/component/Options/types/dev/Select/types";
import { Response } from "../../common";

export interface Shopify {
  type: "shopify";
  api?: {
    metafieldsLoad?: {
      handler: (
        res: Response<ChoicesSync>,
        rej: Response<string>,
        args: {
          sourceType: string;
        }
      ) => void;
    };
    blogPostMetaLoad?: {
      handler: (
        res: Response<ChoicesSync>,
        rej: Response<string>,
        args: {
          sourceType: string;
        }
      ) => void;
    };
  };
}
