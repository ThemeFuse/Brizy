import * as Str from "visual/utils/reader/string";

export const getAddToCartData = ({
  productId,
  defaultVarintId
}: {
  productId: string;
  defaultVarintId: string | null;
}) => {
  const variantId =
    Str.read(
      document.querySelector<HTMLInputElement>(
        `.brz-shopify-variant-container [data-product-handle="${productId}"]`
      )?.value
    ) ??
    (defaultVarintId || "0");

  const quantity =
    Str.read(
      document.querySelector<HTMLInputElement>(
        `.brz-shopify-quantity-container [data-product-handle="${productId}"]`
      )?.value
    ) ?? "1";

  const formData = new FormData();

  formData.append("id", variantId);
  formData.append("quantity", quantity);

  return formData;
};

export const useSpinner = ({
  cartNode,
  loading
}: {
  cartNode: HTMLButtonElement;
  loading: boolean;
}): void => {
  if (!cartNode.children.length) return;

  const _children = Array.from(cartNode.children);

  const spinner = _children.find((node) =>
    node.classList.contains("brz-shopify-add-to-cart--spinner")
  );

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
