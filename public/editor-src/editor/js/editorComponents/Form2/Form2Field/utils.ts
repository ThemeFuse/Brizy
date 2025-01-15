import { ChoicesAsync } from "visual/component/Options/types/dev/Select/types";
import {
  FormFieldsOption,
  Response
} from "visual/global/Config/types/configs/common";
import { t } from "visual/utils/i18n";
import types, { FormInputTypesName } from "./types";
import { InputType, InputTypeChoice } from "./type";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { MValue } from "visual/utils/value";

export const getThirtyOptions = (
  fieldId: string,
  config: ConfigCommon
): ChoicesAsync["load"] => {
  const uniqueField: FormFieldsOption = {
    title: t("Unique Id"),
    value: fieldId
  };

  return () => {
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

export function inputTypesChoice(inputTypes: MValue<FormInputTypesName[]>) {
  const _types = types as Record<FormInputTypesName, InputType>;

  const isProvidedInputTypes =
    Array.isArray(inputTypes) && inputTypes.length >= 1;

  if (isProvidedInputTypes) {
    return inputTypes
      .filter((key) => _types[key as FormInputTypesName])
      .map((key) => getInputType(_types[key as FormInputTypesName]));
  }

  return Object.values(_types).map(getInputType);
}
