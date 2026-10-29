function closest(el, fn) {
  while (el) {
    if (fn(el)) return el;
    el = el.parentElement;
  }
}

export default function (node) {
  if (node.querySelector(".brz-woo-add-to-cart")) {
    const variationsForm = node.querySelector(".variations_form");

    if (variationsForm) {
      const productGalleryExists = Boolean(
        node.querySelector(".woocommerce-product-gallery")
      );

      if (productGalleryExists) {
        const closestProductGalleryContainer = closest(
          variationsForm,
          (el) => el.querySelector(".woocommerce-product-gallery") != null
        );

        if (closestProductGalleryContainer) {
          // this class is needed to make woocommerce 'tick'
          closestProductGalleryContainer.classList.add("product");
        }
      }
    }
  }
}
