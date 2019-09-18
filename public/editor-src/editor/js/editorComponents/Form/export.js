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
          $submit.removeClass("brz-blocked");
        });
    });
  }

  function validate() {
    var $this = $(this);
    var $parentElem = $this.closest(".brz-form__item");
    var value = $this.val();
    var data = $this.data();
    var type = data.type;
    var result = true;
    var isRequired = $this.prop("required");
    var pattern = $this.attr("pattern");

    $parentElem.removeClass(
      "brz-form__item--error brz-form__item--error-pattern brz-form__item--error-required"
    );

    if (type === "Number") {
      if (isRequired && !new RegExp(pattern).test(value)) {
        $parentElem.addClass(
          "brz-form__item--error brz-form__item--error-pattern"
        );
        result = false;
      }
    } else if (!new RegExp(pattern).test(value)) {
      $parentElem.addClass(
        "brz-form__item--error brz-form__item--error-pattern"
      );
      result = false;
    }

    if (isRequired && !value.length) {
      $parentElem.addClass(
        "brz-form__item--error brz-form__item--error-required"
      );
      result = false;
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

function resetFormValues($form) {
  $form.find(".brz-form__item").each(function() {
    $(this)
      .find("input, textarea, select")
      .val("")
      .trigger("change");
  });
}
