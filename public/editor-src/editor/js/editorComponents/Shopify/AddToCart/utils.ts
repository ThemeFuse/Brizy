import { makeAttr } from "visual/utils/i18n/attribute";
import * as Str from "visual/utils/reader/string";

export const getAddToCartData = ({
  productId,
  defaultVarintId
}: {
  productId: string;
  defaultVarintId: string | null;
}) => {
  const productIdAttr = `[${makeAttr("product-handle")}="${productId}"]`;
  const variantId =
    Str.read(
      document.querySelector<HTMLInputElement>(
        `.brz-shopify-variant-container ${productIdAttr}`
      )?.value
    ) ||
    defaultVarintId ||
    "0";

  const quantity =
    Str.read(
      document.querySelector<HTMLInputElement>(
        `.brz-shopify-quantity-container ${productIdAttr}`
      )?.value
    ) || "1";

  const formData = new FormData();

  formData.append("id", variantId);
  formData.append("quantity", quantity);

  return formData;
};

export const handleSpinner = ({
  cartNode,
  loading,
  className
}: {
  cartNode: HTMLButtonElement;
  loading: boolean;
  className: string;
}): void => {
  if (!cartNode.children.length) return;

  const _children = Array.from(cartNode.children);

  const spinner = _children.find((node) => node.classList.contains(className));

  if (loading) {
    cartNode.classList.add("brz-blocked");

    _children.forEach((node) => {
      node.classList.add("brz-invisible");
    });

    if (spinner) {
      spinner.classList.remove("brz-invisible");
    }
  } else {
    cartNode.classList.remove("brz-blocked");

    _children.forEach((node) => {
      node.classList.remove("brz-invisible");
    });

    if (spinner) {
      spinner.classList.add("brz-invisible");
    }
  }
};
