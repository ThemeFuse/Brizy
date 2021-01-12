import $ from "jquery";

export default function($node) {
  $node.find(".brz-login").each(function() {
    const $this = $(this);
    const autorization = $this.attr("data-islogged") === "true";

    if (autorization) {
      $this.find(".brz-login__autorized").css("display", "block");
    } else {
      $this.find(".brz-form-login").css("display", "flex");
    }
  });
}
