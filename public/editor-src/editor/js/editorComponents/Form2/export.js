import flatpickr from "flatpickr";
import Scrollbars from "perfect-scrollbar";
import $ from "jquery";
import "select2";

export default function($node) {
  $node.find("[data-form-version='2']").each(function() {
    initForm($(this));
  });

  // For Date
  $node.find(".brz-forms2__field-date").each(function() {
    const $this = $(this);
    const data = $this.data();
    const minDate = data.min;
    const maxDate = data.max;
    const native = data.native;

    if (!native) {
      flatpickr($this.get(0), {
        minDate: minDate,
        maxDate: maxDate,
        disableMobile: true
      });
    } else {
      $this.attr("min", minDate);
      $this.attr("max", maxDate);
    }
  });

  // For Time
  $node.find(".brz-forms2__field-time").each(function() {
    const $this = $(this);
    const data = $this.data();
    const minDate = data.min;
    const maxDate = data.max;
    const native = data.native;

    if (!native) {
      flatpickr($this.get(0), {
        minDate: minDate,
        maxDate: maxDate,
        enableTime: true,
        noCalendar: true,
        disableMobile: true
      });
    } else {
      $this.attr("min", minDate);
      $this.attr("max", maxDate);
    }
  });

  // Select
  $node.find(".brz-forms2__field-select").each(function() {
    const $this = $(this);
    const $select = $this.find(".brz-select");
    const placeholder = $select.data("placeholder");
    const maxItemDropdown = $select.data("max-item-dropdown");
    let initialized = false;

    $select.select2({
      minimumResultsForSearch: Infinity,
      dropdownParent: $this,
      templateSelection: data => {
        return !placeholder && !initialized ? "" : data.text;
      }
    });

    // Custom Scrollbars
    let scrollbars;
    $select.on("select2:opening", function() {
      // waiting appear the dropdown in the dom
      setTimeout(function() {
        const $dropdown = $this.find(".select2-dropdown");
        const itemHeight = parseInt(
          $dropdown
            .find(".select2-results__options .select2-results__option")
            .css("height")
        );

        $dropdown.css("maxHeight", itemHeight * maxItemDropdown);

        if ($dropdown.length) {
          const node = $dropdown.get(0);
          scrollbars = new Scrollbars(node);
        }
      }, 0);
    });

    // destroy custom scrollbar when dropdown closed
    $select.on("select2:close", function() {
      if (scrollbars) {
        scrollbars.destroy();
        scrollbars = null;
      }
    });

    initialized = true;
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
        const recaptchaId = global.grecaptcha.render(el, { sitekey, size });

        $form.attr("data-recaptchaId", recaptchaId);

        // Generated hash recaptcha
        global.grecaptcha.execute(recaptchaId);
      });
    };
  }
}

// Forms
function initForm($component) {
  $component.on("blur", "form input, form textarea, form select", function() {
    validate.call(this);
  });
  $component.on("submit", "form", function(event) {
    event.preventDefault();

    const $this = $(this);
    const projectId = $this.attr("data-project-id");
    const id = $this.attr("data-form-id");
    const url = $this.attr("action");
    const successMessage = $this.attr("data-success");
    const errorMessage = $this.attr("data-error");
    const redirect = $this.attr("data-redirect");

    event.preventDefault();

    const $elements = $this.find(
      "input[pattern], textarea[pattern], input[required], textarea[required], input[type='file'], select[required]"
    );
    let submitForm = true;

    $elements.each(function() {
      if (!validate.call(this)) {
        submitForm = false;
      }
    });

    if (!submitForm) {
      return;
    }

    let formData = new FormData();
    let data = [];
    let $submit = $this.find(".brz-btn");
    let recaptchaId = null;

    clearFormMessages($this);

    if ($this.find(".brz-g-recaptcha").length) {
      recaptchaId = $this.data("recaptchaid");

      data.push({
        name: "g-recaptcha-response",
        value: global.grecaptcha.getResponse(recaptchaId)
      });
    }

    $submit.addClass("brz-blocked");
    $this
      .find(".brz-forms2__item:not(.brz-forms2__item-button)")
      .each(function() {
        const $elem = $(this).find("input, textarea, select");
        const name = $elem.attr("name");
        const type = $elem.attr("data-type");
        const required = Boolean($elem.prop("required"));
        const label = $elem.attr("data-label");
        let value = $elem.val();
        let dataValue = { name, value, required, type, label };

        if (Array.isArray(value)) {
          dataValue.value = value.join(",");
        }
        if (type === "FileUpload") {
          const files = $elem.get(0).files;

          $.each(files, function(i, file) {
            formData.append(`${name}[]`, file, file.name);
          });
          dataValue.maxSize = parseInt($elem.data().fileMaxSize);
          dataValue.extensions = $elem.attr("accept");
        }
        if (type === "Checkbox" || type === "Radio") {
          let elementValues = [];

          $elem.each(function(_, el) {
            if (el.checked) {
              elementValues.push(el.value);
            }
          });

          dataValue.value = elementValues.join(",");
        }
        if (type === "Hidden") {
          dataValue.value = label;
        }

        data.push(dataValue);
      });

    formData.append("data", JSON.stringify(data));
    formData.append("project_id", projectId);
    formData.append("form_id", id);

    $.ajax({
      type: "POST",
      processData: false,
      contentType: false,
      url: url,
      data: formData
    })
      .done(function() {
        showFormMessage($this, getFormMessage("success", successMessage));

        if (redirect !== "") {
          window.location.replace(redirect);
        }

        // Reset Form Values
        resetFormValues($this);
      })
      .fail(function() {
        $this.addClass("brz-forms2__send--fail");
        showFormMessage($this, getFormMessage("error", errorMessage));
      })
      .always(function() {
        // Regenerate recaptcha hash
        if (recaptchaId !== null) {
          global.grecaptcha.reset(recaptchaId);
          global.grecaptcha.execute(recaptchaId);
        }
        $submit.removeClass("brz-blocked");
      });
  });
}
function validate() {
  const $this = $(this);
  const $form = $this.closest(".brz-form");
  const $parentElem = $this.closest(".brz-forms2__item");
  const value = $this.val();
  const data = $this.data();
  const type = data.type;
  const isRequired = $this.prop("required");
  const pattern = $this.attr("pattern");
  let result = true;

  $parentElem.removeClass(
    "brz-forms2__item--error brz-forms2__item--error-pattern brz-forms2__item--error-required"
  );

  if (isRequired && !value) {
    $parentElem.addClass(
      "brz-forms2__item--error brz-forms2__item--error-required"
    );
    result = false;
  }

  if (type === "Number") {
    const { min, max } = data;

    if (isRequired && !new RegExp(pattern).test(value)) {
      $parentElem.addClass(
        "brz-forms2__item--error brz-forms2__item--error-pattern"
      );
      result = false;
    }

    if (Boolean(min) && Boolean(value) && value < min) {
      const messages = getFormMessage(
        "error",
        `Selected quantity is more than stock status, min: ${min}`
      );

      showFormMessage($form, messages);
      $parentElem.addClass(
        "brz-forms2__item--error brz-forms2__item--error-pattern"
      );
      result = false;
    }
    if (Boolean(max) && Boolean(value) && value > max) {
      const messages = getFormMessage(
        "error",
        `Selected quantity is more than stock status max: ${max}`
      );

      showFormMessage($form, messages);
      $parentElem.addClass(
        "brz-forms2__item--error brz-forms2__item--error-pattern"
      );
      result = false;
    }
  } else if (!new RegExp(pattern).test(value)) {
    $parentElem.addClass(
      "brz-forms2__item--error brz-forms2__item--error-pattern"
    );
    result = false;
  }

  if (type === "FileUpload") {
    const files = $this.get(0).files;
    const maxSize = parseInt($this.data().fileMaxSize) || 1;
    const accepts = $this.attr("accept")
      ? $this
          .attr("accept")
          .replace(/\s+/g, "")
          .split(",")
      : [];
    const MB = 1048576;
    let isBig = false;
    let isAccept = false;

    $.each(files, function(i, { size, name }) {
      /* eslint-disable no-useless-escape */
      const [ext] = name.match(/\.([^\.]+)$/);
      /* eslint-enabled no-useless-escape */

      isBig = size / MB >= maxSize;
      isAccept = accepts.length && !accepts.includes(ext);
    });

    if (isBig) {
      result = false;
      $parentElem.addClass(
        "brz-forms2__item--error brz-forms2__item--error-pattern"
      );
      const messages = getFormMessage(
        "error",
        `This file exceeds the maximum allowed size. ${
          $this.data().fileMaxSize
        }`
      );

      showFormMessage($form, messages);
    }
    if (isAccept) {
      result = false;
      $parentElem.addClass(
        "brz-forms2__item--error brz-forms2__item--error-pattern"
      );
      const ext = accepts.map(ext => ext.replace(".", "")).join(", ");
      const messages = getFormMessage(
        "error",
        `Only files with the following extensions are allowed: ${ext}`
      );

      showFormMessage($form, messages);
    }
  }

  if (
    type === "Select" &&
    (($this.prop("multiple") && value.filter(v => v).length === 0) ||
      value === " ")
  ) {
    $parentElem.addClass(
      "brz-forms2__item--error brz-forms2__item--error-required"
    );
    result = false;
  }

  if (
    isRequired &&
    type === "Checkbox" &&
    ![...$parentElem.find("input")].some(({ checked }) => checked)
  ) {
    $parentElem.addClass(
      "brz-forms2__item--error brz-forms2__item--error-required"
    );
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

  return `<div class="brz-forms2__alert brz-forms2__alert--${status}">${text ||
    defaultTexts[status]}</div>`;
}
function clearFormMessages($form) {
  $form
    .parent()
    .find(".brz-forms2__alert")
    .remove();
  $form.removeClass(
    "brz-forms2__send--empty brz-forms2__send--success brz-forms2__send--fail"
  );
}
function showFormMessage($form, message) {
  clearFormMessages($form);
  $form.after(message);
}
function resetFormValues($form) {
  $form.find(".brz-forms2__item").each(function() {
    const $elements = $(this).find("input, textarea, select");
    const elements = [...$elements];

    elements.forEach((el, index) => {
      const $el = $(el);

      if (el.type === "radio" && index === 0) {
        $el.prop("checked", true).trigger("change");
      } else {
        $el
          .val("")
          .prop("checked", false)
          .trigger("change");
      }
    });
  });
}

// Recaptcha
function loadReCAPTCHA() {
  let scriptId = "brz-recaptcha__script";

  if (document.getElementById(scriptId)) {
    return;
  }

  let scriptElement = document.createElement("script");

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
