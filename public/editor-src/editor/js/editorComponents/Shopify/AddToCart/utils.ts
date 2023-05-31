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
