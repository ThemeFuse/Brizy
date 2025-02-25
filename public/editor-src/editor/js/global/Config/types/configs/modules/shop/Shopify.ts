import { ChoicesSync } from "visual/component/Options/types/dev/Select/types";
import { ShopifyPage } from "visual/types/Page";
import {
  BlogSourceItem,
  Rule as PublishRule,
  SelectedItem
} from "visual/utils/api/types";
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
    shopifyBlogItems?: {
      handler: (res: Response<BlogSourceItem[]>, rej: Response<string>) => void;
    };
    shopifyUnpublishPage?: {
      handler: (
        res: Response<{ message: string }>,
        rej: Response<string>
      ) => void;
    };
    shopifySyncArticle?: {
      handler: (
        res: Response<unknown>,
        rej: Response<string>,
        extra: {
          id: string;
          layout: ShopifyPage["layout"]["value"];
        }
      ) => void;
    };
    shopifySyncRules?: {
      handler: (
        res: Response<{ message: string }>,
        rej: Response<string>,
        extra: {
          id: string;
          rules: SelectedItem[];
          title: string;
          layout: ShopifyPage["layout"]["value"];
        }
      ) => void;
    };
    shopifySyncPage?: {
      handler: (
        res: Response<{ message: string }>,
        rej: Response<string>,
        extra: {
          id: string;
          title: string;
          isHomePage: boolean;
          layout: ShopifyPage["layout"]["value"];
        }
      ) => void;
    };
    getPageRelations?: {
      handler: (res: Response<PublishRule[]>, rej: Response<string>) => void;
    };
  };
}
