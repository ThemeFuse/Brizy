import $ from "jquery";

export default function() {
  $(".brz-form").each(function() {
    var $this = $(this);
    initForm($this);
  });
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
      var projectLanguage = $this.attr("data-project-language");
      var id = $this.attr("data-form-id");
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
          project_language: projectLanguage,
          form_id: id
        }
      })
        .done(function() {
          showFormMessage($this, getFormMessage("success", successMessage));
          if (redirect !== "") {
            window.location.replace(redirect);
          }
        })
        .fail(function() {
          $this.addClass("brz-form__send--fail");
          showFormMessage($this, getFormMessage("error", errorMessage));
        })
        .always(function() {
          $submit.removeClass("brz-blocked");
        });
    });
  }

  function validate() {
    var $this = $(this);
    var $parentElem = $this.closest(".brz-form__item");
    var value = $this.val();
    var result = true;

    $parentElem.removeClass(
      "brz-form__item--error brz-form__item--error-pattern brz-form__item--error-required"
    );

    var pattern = $this.attr("pattern");
    if (!new RegExp(pattern).test(value)) {
      $parentElem.addClass(
        "brz-form__item--error brz-form__item--error-pattern"
      );
      result = false;
    }

    var isRequired = $this.prop("required");
    if (isRequired) {
      if (!value.length) {
        $parentElem.addClass(
          "brz-form__item--error brz-form__item--error-required"
        );
        result = false;
      }
    }

    return result;
  }
  function getFormMessage(status, text) {
    var defaultTexts = {
      success: "Your email was sent successfully",
      error: "Your email was not sent",
      empty: "Please check your entry and try again"
    };
    switch (status) {
      case "success":
        return (
          '<div class="brz-form__alert brz-form__alert--success">' +
          (text || defaultTexts.success) +
          "</div>"
        );
      case "error":
        return (
          '<div class="brz-form__alert brz-form__alert--error">' +
          (text || defaultTexts.error) +
          "</div>"
        );
    }
  }
  function clearFormMessages($form) {
    $form
      .parent()
      .find(".brz-form__alert")
      .remove();
    $form.removeClass(
      "brz-form__send--empty brz-form__send--success brz-form__send--fail"
    );
  }
  function showFormMessage($form, message) {
    $form.after(message);
  }
}
