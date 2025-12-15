import { Str } from "@brizy/readers";
import { memoize } from "es-toolkit";
import { checkValue } from "visual/utils/checkValue";
import { makeAttr } from "visual/utils/i18n/attribute";
import { ViewType } from "./Form2Steps/types";
import { BoxResizerParams, MessageStatus, ResponseMessages } from "./types";

export const isViewType = (v: string): v is ViewType =>
  !!checkValue<ViewType>([
    ViewType.None,
    ViewType.Text,
    ViewType.Icon,
    ViewType.Number,
    ViewType.Progress,
    ViewType.NumberText,
    ViewType.IconText
  ])(v);

export const isViewTypeWithIcon = (v: ViewType): boolean =>
  v === ViewType.Icon || v === ViewType.IconText;

export const isViewTypeWithNumber = (v: ViewType): boolean =>
  v === ViewType.Number || v === ViewType.NumberText;

export const getBoxResizerParams: BoxResizerParams = memoize(() => ({
  points: ["centerLeft", "centerRight"],
  restrictions: {
    width: {
      "%": { min: 5, max: 100 }
    }
  }
}));

export const getTranslatedResponseMessages = (
  form: HTMLFormElement
): ResponseMessages =>
  Object.keys(MessageStatus).reduce((acc, _status) => {
    const status = _status.toLowerCase();

    const translatedMessage = Str.read(
      form.getAttribute(makeAttr("default-" + status, true))
    );

    return {
      ...acc,
      [status]: translatedMessage
    };
  }, {} as ResponseMessages);

export const isUserAgreementCheckbox = (type: string | undefined): boolean =>
  type === "UserAgreementCheckbox";
