import { Response } from "@/types/Response";
import { t } from "@/utils/i18n";

export const getCollectionTypesInfo = {
  handler: async (res: Response<undefined>, rej: Response<string>) => {
    try {
      return res(undefined);
    } catch (e) {
      rej(t("Failed to get collection types info"));
    }
  }
};
