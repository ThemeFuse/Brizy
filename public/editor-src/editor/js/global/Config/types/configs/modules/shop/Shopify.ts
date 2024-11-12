import { ChoicesSync } from "visual/component/Options/types/dev/Select/types";
import { Response } from "../../common";
import { Rule as PublishRule } from "visual/utils/api/types";
import { BlogSourceItem } from "visual/utils/api/types";
import { SelectedItem } from "visual/utils/api/types";

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
        extra: unknown
      ) => void;
    };
    shopifySyncRules?: {
      handler: (
        res: Response<{ message: string }>,
        rej: Response<string>,
        extra: { id: string; rules: SelectedItem[]; title: string }
      ) => void;
    };
    shopifySyncPage?: {
      handler: (
        res: Response<{ message: string }>,
        rej: Response<string>,
        extra: { id: string; title: string; isHomePage: boolean }
      ) => void;
    };
    getPageRelations?: {
      handler: (res: Response<PublishRule[]>, rej: Response<string>) => void;
    };
  };
}
