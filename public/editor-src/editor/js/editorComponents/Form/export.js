import $ from "jquery";

export default function($node) {
  $node.find("[data-form-version='1']").each(function() {
    initForm($(this));
  });

  // RECAPTCHA
  const $recaptcha = $node.find(".brz-g-recaptcha");

  if ($recaptcha.length) {
    // Load Script recaptcha
    loadReCAPTCHA();

    // Render Recaptcha
    global.brzOnloadRecaptchaCallback = function() {
      $recaptcha.each(function(_, el) {
        const $this = $(this);
        const $form = $this.closest(".brz-form");
        const data = $this.data();
        const sitekey = data.sitekey;
        const size = data.size;
        const recaptchaId = global.grecaptcha.render(el, {
          sitekey,
          size
        });
        $form.attr("data-recaptchaId", recaptchaId);

        // Generated hash recaptcha
        global.grecaptcha.execute(recaptchaId);
      });
    };
  }
}

// Forms
function initForm($component) {
  $component.on("blur", "form input, form textarea", function() {
    validate.call(this);
  });
  $component.on(
    "click",
    "form .brz-control__select .brz-control__select-option",
    function() {
      var input = $(this)
        .closest(".brz-control__select")
        .find("input")
        .get(0);
      validate.call(input);
    }
  );
  $component.on("submit", "form", function(event) {
    event.preventDefault();

    var $this = $(this);
    var projectId = $this.attr("data-project-id");
    var formId = $this.attr("data-form-id");
    var url = $this.attr("action");
    var successMessage = $this.attr("data-success");
    var errorMessage = $this.attr("data-error");
    var redirect = $this.attr("data-redirect");

    event.preventDefault();
    clearFormMessages($this);

    var $elements = $this.find(
      "input[pattern], textarea[pattern], input[required], textarea[required]"
    );
    var submitForm = true;
    $elements.each(function() {
      if (!validate.call(this)) {
        submitForm = false;
      }
    });

    if (!submitForm) {
      return;
    }

    var data = [];
    var $submit = $this.find(".brz-btn");

    $submit.addClass("brz-blocked");
    $this.find("input, textarea").each(function() {
      var $elem = $(this);
      var name = $elem.attr("name");
      var type = $elem.attr("data-type");
      var value = $elem.val();
      var required = Boolean($elem.prop("required"));
      var label = $elem.attr("data-label");

      data.push({
        name: name,
        value: value,
        required: required,
        type: type,
        label: label
      });
    });

    $.ajax({
      type: "POST",
      url: url,
      data: {
        data: JSON.stringify(data),
        project_id: projectId,
        form_id: formId
      }
    })
      .done(function() {
        showFormMessage($this, getFormMessage("success", successMessage));
        if (redirect !== "") {
          window.location.replace(redirect);
        }

        // Reset Forms Fields Value
        resetFormValues($this);
      })
      .fail(function() {
        $this.addClass("brz-form__send--fail");
        showFormMessage($this, getFormMessage("error", errorMessage));
      })
      .always(function() {
        // Regenerate recaptcha hash
        if ($this.find(".brz-g-recaptcha").length) {
          var recaptchaId = $this.data("recaptchaid");

          global.grecaptcha.reset(recaptchaId);
          global.grecaptcha.execute(recaptchaId);
        }

        $submit.removeClass("brz-blocked");
      });
  });
}

function validate() {
  const $this = $(this);
  const $parentElem = $this.closest(".brz-forms__item");
  const value = $this.val();
  const isRequired = $this.prop("required");
  const pattern = $this.attr("pattern");
  const patternTest = new RegExp(pattern).test(value);
  let result = true;

  $parentElem.removeClass(
    "brz-forms__item--error brz-forms__item--error-pattern brz-forms__item--error-required"
  );

  if (isRequired && (!value || !patternTest)) {
    $parentElem.addClass(
      "brz-forms__item--error brz-forms__item--error-required"
    );
    result = false;
  }

  if (value.length && !patternTest) {
    $parentElem.addClass("brz-form__item--error brz-form__item--error-pattern");
    result = false;
  }

  return result;
}
function getFormMessage(status, text) {
  const defaultTexts = {
    success: "Your email was sent successfully",
    error: "Your email was not sent",
    empty: "Please check your entry and try again"
  };
  switch (status) {
    case "success":
      return (
        "<div class='brz-forms__alert brz-forms__alert--success'>" +
        (text || defaultTexts.success) +
        "</div>"
      );
    case "error":
      return (
        "<div class='brz-forms__alert brz-forms__alert--error'>" +
        (text || defaultTexts.error) +
        "</div>"
      );
  }
}
function clearFormMessages($form) {
  $form
    .parent()
    .find(".brz-forms__alert")
    .remove();
  $form.removeClass(
    "brz-forms__send--empty brz-forms__send--success brz-forms__send--fail"
  );
}
function showFormMessage($form, message) {
  $form.after(message);
}
function resetFormValues($form) {
  $form.find(".brz-forms__item").each(function() {
    $(this)
      .find("input, textarea, select")
      .val("")
      .trigger("change");
  });
}

// Recaptcha
function loadReCAPTCHA() {
  const scriptId = "brz-recaptcha__script";

  if (document.getElementById(scriptId)) {
    return;
  }

  const scriptElement = document.createElement("script");

  scriptElement.setAttribute(
    "src",
    "https://www.google.com/recaptcha/api.js?onload=brzOnloadRecaptchaCallback&render=explicit"
  );
  scriptElement.setAttribute("async", "async");
  scriptElement.setAttribute("defer", "defer");
  scriptElement.setAttribute("id", scriptId);

  document.body.append(scriptElement);

  return scriptElement;
}
