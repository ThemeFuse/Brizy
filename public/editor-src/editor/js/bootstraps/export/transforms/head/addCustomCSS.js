export default function addCustomCSS($) {
  let styles = "";
  $(`[data-custom-css]`).each(function() {
    const $this = $(this);
    const id = $this.attr("data-custom-id");

    styles += $this.attr("data-custom-css");

    const children = $this.children();
    children.attr("data-custom-id", id);
    $this.replaceWith(children);
  });

  $("head").append(`<style id="custom-css">${styles}</style>`);
}
