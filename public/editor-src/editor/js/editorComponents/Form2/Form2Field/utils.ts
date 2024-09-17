import { ChoicesAsync } from "visual/component/Options/types/dev/Select/types";
import Config from "visual/global/Config";
import {
  FormFieldsOption,
  Response
} from "visual/global/Config/types/configs/common";
import { t } from "visual/utils/i18n";
import types, { FormInputTypesName } from "./types";
import { InputType, InputTypeChoice } from "./type";

export const getThirtyOptions = (fieldId: string): ChoicesAsync["load"] => {
  const uniqueField: FormFieldsOption = {
    title: t("Unique Id"),
    value: fieldId
  };

  return () => {
    const config = Config.getAll();
    const handler = config.integrations?.form?.fields?.handler;

    if (typeof handler !== "function") {
      return Promise.reject(t("Invalid form config thirdPartyOption"));
    }

    return new Promise((resolve, reject) => {
      const res: Response<Array<FormFieldsOption>> = (choices) => {
        resolve([uniqueField, ...choices]);
      };

      handler(res, reject);
    });
  };
};

const getInputType = (item: InputType): InputTypeChoice => {
  return { title: item.componentTitle, value: item.componentType };
};

export function inputTypesChoice() {
  const config = Config.getAll();
  const inputTypes = config.elements?.form?.inputTypes;
  const _types = types as Record<FormInputTypesName, InputType>;

  const isProvidedInputTypes =
    Array.isArray(inputTypes) && inputTypes.length >= 1;

  if (isProvidedInputTypes) {
    return inputTypes
      .filter((key) => _types[key as FormInputTypesName])
      .map((key) => getInputType(_types[key]));
  }

  return Object.values(_types).map(getInputType);
}
