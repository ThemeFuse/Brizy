import { ChoicesAsync } from "visual/component/Options/types/dev/Select/types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  FormFieldsOption,
  Response
} from "visual/global/Config/types/configs/common";
import { t } from "visual/utils/i18n";
import { Translation } from "visual/utils/i18n/t";
import { MValue } from "visual/utils/value";
import { InputType, InputTypeChoice, MatchTypeToNameProps } from "./type";
import types, { FormInputTypesName } from "./types";

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

const matchTypeToName = ({
  componentType,
  t
}: MatchTypeToNameProps): string => {
  switch (componentType) {
    case "Checkbox":
      return t("Checkbox");
    case "UserAgreementCheckbox":
      return t("User Agreement");
    case "Text":
      return t("Text");
    case "Date":
      return t("Date");
    case "Email":
      return t("Email");
    case "Hidden":
      return t("Hidden");
    case "Number":
      return t("Number");
    case "Paragraph":
      return t("Paragraph");
    case "Password":
      return t("Password");
    case "Radio":
      return t("Radio");
    case "Select":
      return t("Select");
    case "Tel":
      return t("Tel");
    case "Time":
      return t("Time");
    case "Url":
      return t("URL");
    case "FileUpload":
      return t("FileUpload");
    case "Calculated":
      return t("Calculated");
    default:
      return "";
  }
};

const getInputType = (item: InputType, t: Translation): InputTypeChoice => ({
  title: matchTypeToName({ componentType: item.componentType, t }),
  value: item.componentType
});

export function inputTypesChoice(
  inputTypes: MValue<FormInputTypesName[]>,
  t: Translation
) {
  const _types = types as Record<FormInputTypesName, InputType>;

  const isProvidedInputTypes =
    Array.isArray(inputTypes) && inputTypes.length >= 1;

  if (isProvidedInputTypes) {
    return inputTypes
      .filter((key) => _types[key as FormInputTypesName])
      .map((key) => getInputType(_types[key as FormInputTypesName], t));
  }

  return Object.values(_types).map((item) => getInputType(item, t));
}
