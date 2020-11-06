function closest(el, fn) {
  while (el) {
    if (fn(el)) return el;
    el = el.parentElement;
  }
}

export default function($node) {
  $node.find(".brz-woo-add-to-cart").each(function() {
    const variationsForm = $node.find(".variations_form").get(0);

    if (variationsForm) {
      const productGalleryExists = Boolean(
        $node.find(".woocommerce-product-gallery").get(0)
      );

      if (productGalleryExists) {
        const closestProductGalleryContainer = closest(
          variationsForm,
          el => el.querySelector(".woocommerce-product-gallery") != null
        );

        if (closestProductGalleryContainer) {
          // this class is needed to make woocommerce 'tick'
          closestProductGalleryContainer.classList.add("product");
        }
      }
    }
  });
}
