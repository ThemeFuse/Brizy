import $ from "jquery";

export default function() {
  if ($(".brz-login").length > 0) {
    const autorization = $(".brz-login").attr("data-islogged") === "true";

    if (autorization) {
      $(".brz-login")
        .children(".brz-login__autorized")
        .css("display", "block");
    } else {
      $(".brz-login")
        .children(".brz-form-login")
        .css("display", "flex");
    }
  }
}
