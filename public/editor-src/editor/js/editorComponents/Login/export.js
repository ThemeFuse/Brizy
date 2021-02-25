import $ from "jquery";

export default function() {
  // Button function
  function loginButton(
    classNameButton,
    classNameOpenForm,
    displayForm = "flex"
  ) {
    if ($(`.${classNameButton}`).length > 0) {
      $(`.${classNameButton}`).click(function() {
        $(this)
          .parents(".brz-login")
          .children(".brz-form-login")
          .css("display", "none");
        $(this)
          .parents(".brz-login")
          .children(`.${classNameOpenForm}`)
          .css("display", displayForm);
      });
    }
  }

  if ($(".brz-login").length > 0) {
    const login = $(".brz-login");
    const type = $(".brz-login").attr("type");

    // For Login form
    if (type === "login" || type === "authorized") {
      const autorization =
        login.attr("data-islogged") === "true" &&
        (type === "login" || type === "authorized");

      if (autorization) {
        $(".brz-login__autorized").css("display", "block");
      } else {
        $(".brz-form-login-login").css("display", "flex");
      }
    }

    // For Register form
    if (type === "register") {
      $(".brz-form-login-register").css("display", "flex");
    }

    // For Forgot form
    if (type === "forgot") {
      $(".brz-form-login-forgot").css("display", "flex");
    }

    // Login
    if (login.attr("data-islogged") === "true") {
      loginButton(
        "brz-form-login__field-login-link",
        "brz-login__autorized",
        "block"
      );
    } else {
      loginButton("brz-form-login__field-login-link", "brz-form-login-login");
    }

    // Lost Password button
    loginButton("brz-form-login__field-lost-password", "brz-form-login-forgot");

    // Register button
    loginButton(
      "brz-form-login__field-register-link",
      "brz-form-login-register"
    );
  }
}
