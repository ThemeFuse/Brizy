import { Config } from "config";
import { ChoicesAsync, ChoicesSync } from "types/Choices";
import {
  EkklesiaExtra,
  EkklesiaFieldMap,
  EkklesiaFields,
  EkklesiaKeys,
  EkklesiaParams
} from "types/Ekklesia";
import { Response } from "types/Response";
import { t } from "utils/i18n";
import { getFields } from "./utils";

export const getEkklesiaFields = (config: Config) => ({
  async handler<T extends keyof EkklesiaFields = keyof EkklesiaFields>(
    res: Response<ChoicesAsync | ChoicesSync>,
    rej: Response<string>,
    keys: EkklesiaParams<T>,
    extra?: EkklesiaExtra
  ): Promise<void> {
    const { ekklesiaApiUrl } = config.api;
    if (!ekklesiaApiUrl) {
      if (process.env.NODE_ENV === "development") {
        console.error("Missing Ekklesia api url!");
      }
      res([{ value: "", title: t("None") }]);
      return;
    }
    try {
      const fields = await getFields(ekklesiaApiUrl, keys, extra);
      res(fields);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to load ekklesia fields 2");
      }
      rej(t("Failed to load ekklesia fields"));
    }
  }
});

export const updateEkklesiaFields = (config: Config) => ({
  async handler<T extends keyof EkklesiaFields = keyof EkklesiaFields>(
    res: Response<EkklesiaKeys | undefined>,
    rej: Response<string>,
    keys: {
      fields: Array<EkklesiaFieldMap[T]>;
    },
    extra?: EkklesiaExtra
  ): Promise<void> {
    const { ekklesiaApiUrl } = config.api;

    if (!ekklesiaApiUrl) {
      if (process.env.NODE_ENV === "development") {
        console.error("Missing Ekklesia api url!");
      }
      rej(t("Missing Ekklesia api url!"));
      return;
    }

    const dataToChange: EkklesiaKeys = {};
    try {
      for (const field of keys.fields) {
        const choiches = await getFields<T>(
          ekklesiaApiUrl,
          field.module,
          extra
        );

        if (!choiches.length) continue;

        const updatedField = Object.keys(field.value).reduce((acc, key) => {
          const value = field.value[key];
          const currentField = choiches.find(
            (choice) => choice.value === value
          );

          if (!currentField) {
            acc[key] = "";
          }

          return acc;
        }, {} as EkklesiaKeys);

        Object.assign(dataToChange, updatedField);
      }
      res(Object.keys(dataToChange).length ? dataToChange : undefined);
    } catch (error) {
      rej(t("Failed to load ekklesia fields"));
    }
  }
});
