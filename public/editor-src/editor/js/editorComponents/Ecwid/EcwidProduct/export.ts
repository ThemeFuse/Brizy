import { Str } from "@brizy/readers";
import { EcwidProductId, EcwidStoreId } from "visual/global/Ecwid/types";
import { EcwidService } from "visual/libs/Ecwid";
import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { ExportFunction } from "visual/types";
import { getEcwidShopPathFromAttribute } from "visual/utils/ecwid";
import { makeAttr } from "visual/utils/i18n/attribute";
import * as Num from "visual/utils/reader/number";
import { parseFromString } from "visual/utils/string";
import {
  datePickerSelector,
  getReplacePlaceholderFn,
  textAreaSelector,
  textFieldSelector
} from "./utils";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-product").each((_, node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;
    const config = Str.read(node.getAttribute("data-storefront"));
    const cfg = config ? parseFromString<EcwidConfig>(config) : {};
    const baseUrl = getEcwidShopPathFromAttribute(node) ?? "";
    const langLocale = node.getAttribute(makeAttr("lang-locale")) ?? "";
    const textFieldPlaceholderText = node.getAttribute(
      "data-textFieldplaceholderText"
    );
    const textareaPlaceholderText = node.getAttribute(
      "data-textareaplaceholderText"
    );
    const datepickerPlaceholderText = node.getAttribute(
      "data-datepickerplaceholderText"
    );

    const productId = Num.read(node.getAttribute("data-product-id")) as
      | EcwidProductId
      | undefined;
    const defaultProductId = Num.read(
      node.getAttribute("data-default-product-id")
    ) as EcwidProductId | undefined;

    const _productId = productId ?? defaultProductId;

    if (_productId && storeId) {
      const replacePlaceholder = getReplacePlaceholderFn(node);
      const onPageLoadCallbacks: Array<VoidFunction> = [];

      if (textFieldPlaceholderText) {
        onPageLoadCallbacks.push(() =>
          replacePlaceholder(textFieldPlaceholderText, textFieldSelector)
        );
      }

      if (textareaPlaceholderText) {
        onPageLoadCallbacks.push(() =>
          replacePlaceholder(textareaPlaceholderText, textAreaSelector)
        );
      }

      if (datepickerPlaceholderText) {
        onPageLoadCallbacks.push(() =>
          replacePlaceholder(datepickerPlaceholderText, datePickerSelector)
        );
      }

      const _cfg = { ...(cfg ?? {}), baseUrl, onPageLoadCallbacks, langLocale };

      EcwidService.init(storeId, _cfg).product(_productId, node);
    }
  });
};
