import $ from "jquery";
import { Libs } from "visual/libs";

export default function($node) {
  const root = $node.get(0);

  // RECAPTCHA
  const recaptcha = root.querySelectorAll(".brz-g-recaptcha");

  if (recaptcha.length) {
    // Load Script recaptcha
    loadReCAPTCHA();

    // callback recaptcha
    global.brzFormV2Captcha = token => {
      const formActive = root.querySelector(
        "[data-form-version='2'].brz-forms2--pending"
      );

      if (formActive) {
        const allData = getFormData(formActive);
        const recaptchaData = [{ name: "g-recaptcha-response", value: token }];
        const formData = {
          formData: allData.formData,
          data: allData.data.concat(recaptchaData)
        };

        handleSubmit(formActive, formData).then(() => {
          formActive.classList.remove("brz-forms2--pending");

          // need reset captchaId
          const recaptcha = formActive.querySelector(".brz-g-recaptcha");
          const recaptchaId = recaptcha.getAttribute("recaptchaId");
          global.grecaptcha.reset(recaptchaId);
        });
      }
    };

    // render Recaptcha
    global.brzOnloadRecaptchaCallback = function() {
      recaptcha.forEach(node => {
        const { sitekey, size, callback } = node.dataset;
        const recaptchaId = global.grecaptcha.render(node, {
          sitekey,
          size,
          callback
        });

        node.setAttribute("recaptchaId", recaptchaId);
      });
    };
  }

  root.querySelectorAll("[data-form-version='2']").forEach(initForm);

  // For Date
  root.querySelectorAll(".brz-forms2__field-date").forEach(node => {
    const data = node.dataset;
    const minDate = data.min;
    const maxDate = data.max;
    const native = data.native === "true";

    if (!native && Libs.Flatpickr) {
      Libs.Flatpickr(node, {
        minDate: minDate,
        maxDate: maxDate,
        disableMobile: true
      });
    } else {
      node.setAttribute("min", minDate);
      node.setAttribute("max", maxDate);
    }
  });

  // For Time
  root.querySelectorAll(".brz-forms2__field-time").forEach(node => {
    const data = node.dataset;
    const minDate = data.min;
    const maxDate = data.max;
    const native = data.native === "true";

    if (!native && Libs.Flatpickr) {
      Libs.Flatpickr(node, {
        minDate: minDate,
        maxDate: maxDate,
        enableTime: true,
        noCalendar: true,
        disableMobile: true
      });
    } else {
      node.setAttribute("min", minDate);
      node.setAttribute("max", maxDate);
    }
  });

  // Select
  root.querySelectorAll(".brz-forms2__field-select").forEach(node => {
    const $this = $(node);
    const $select = $this.find(".brz-select");
    const placeholder = $select.data("placeholder");
    const maxItemDropdown = $select.data("max-item-dropdown");
    let initialized = false;

    $select.select2({
      width: "100%",
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

        if ($dropdown.length && Libs.Scrollbars) {
          const node = $dropdown.get(0);
          scrollbars = new Libs.Scrollbars(node);
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
}

function validateFormItem(node) {
  const form = node.closest(".brz-form");
  const parentElem = node.closest(".brz-forms2__item");
  const value = node.value;
  const data = node.dataset;
  const type = data.type;
  const isRequired = node.required;
  const pattern =
    (node.getAttribute("pattern") || "") &&
    decodeURI(node.getAttribute("pattern"));
  const patternTest = new RegExp(pattern).test(value);
  let result = true;

  parentElem.classList.remove(
    "brz-forms2__item--error",
    "brz-forms2__item--error-pattern",
    "brz-forms2__item--error-required"
  );

  if (isRequired && (!value || !patternTest)) {
    parentElem.classList.add(
      "brz-forms2__item--error",
      "brz-forms2__item--error-required"
    );
    result = false;
  }

  if (value.length && !patternTest) {
    parentElem.classList.add(
      "brz-forms2__item--error",
      "brz-forms2__item--error-pattern"
    );
    result = false;
  }

  if (type === "Number") {
    const { min, max } = data;
    const toNum = Number(value);

    if (Boolean(value) && toNum < min && min !== "") {
      const messages = getFormMessage(
        "error",
        `Selected quantity is more than stock status, min: ${min}`
      );

      showFormMessage(form, messages);
      parentElem.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-pattern"
      );
      result = false;
    }
    if (Boolean(value) && toNum > max && max !== "") {
      const messages = getFormMessage(
        "error",
        `Selected quantity is more than stock status max: ${max}`
      );

      showFormMessage(form, messages);
      parentElem.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-pattern"
      );
      result = false;
    }
  }

  if (type === "FileUpload") {
    const files = node.files;
    const maxSize = parseInt(node.dataset.fileMaxSize) || 1;
    const accepts = node.getAttribute("accept")
      ? node
          .getAttribute("accept")
          .replace(/\s+/g, "")
          .split(",")
      : [];
    const MB = 1048576;
    let isBig = false;
    let isAccept = false;

    for (const file of files) {
      const { name, size } = file;
      /* eslint-disable no-useless-escape */
      const [ext] = name.match(/\.([^\.]+)$/);
      /* eslint-enabled no-useless-escape */

      isBig = size / MB >= maxSize;
      isAccept = accepts.length && !accepts.includes(ext);
    }

    if (isBig) {
      result = false;
      parentElem.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-pattern"
      );
      const messages = getFormMessage(
        "error",
        `This file exceeds the maximum allowed size. ${node.dataset.fileMaxSize}`
      );

      showFormMessage(form, messages);
    }
    if (isAccept) {
      result = false;
      parentElem.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-pattern"
      );
      const ext = accepts.map(ext => ext.replace(".", "")).join(", ");
      const messages = getFormMessage(
        "error",
        `Only files with the following extensions are allowed: ${ext}`
      );

      showFormMessage(form, messages);
    }
  }

  const isSelect = node.closest(".brz-forms2__field-select");

  if (isSelect) {
    const nodeSelect = isSelect.querySelector(".brz-select");
    const multiple = nodeSelect.multiple;
    const value = nodeSelect.value;

    if (multiple) {
      const selected = nodeSelect.querySelectorAll("option:checked");
      const values = Array.from(selected).map(el => el.value);

      if (values.length === 0) {
        parentElem.classList.add(
          "brz-forms2__item--error",
          "brz-forms2__item--error-required"
        );
        result = false;
      }
    } else if (value === " ") {
      parentElem.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-required"
      );
      result = false;
    }
  }

  if (
    isRequired &&
    type === "Checkbox" &&
    ![...parentElem.querySelectorAll("input")].some(({ checked }) => checked)
  ) {
    parentElem.classList.add(
      "brz-forms2__item--error",
      "brz-forms2__item--error-required"
    );
    result = false;
  }

  return result;
}

function validateForm(form) {
  const elements = form.querySelectorAll(
    "input[pattern], textarea[pattern], input[required], textarea[required], input[type='file'], select[required]"
  );
  let submitForm = true;

  elements.forEach(element => {
    if (!validateFormItem(element)) {
      submitForm = false;
    }
  });

  return submitForm;
}

function initForm(form) {
  const $form = $(form);

  $form.on("blur", "form input, form textarea, form select", function() {
    validateFormItem(this);
  });

  const recaptcha = form.querySelector(".brz-g-recaptcha");

  // if has recaptcha
  // (1) need generate token
  // (1.1) captcha is called global fn brzFormV1Captcha
  // (2) need added the pending form selector .brz-forms--pending
  // (2.1) this class is used in brzFormV1Captcha for find and generate formData
  if (recaptcha) {
    $form.on("submit", "form", function(event) {
      event.preventDefault();

      // validate form
      const isValid = validateForm(form);

      if (!isValid) {
        return;
      }

      // call recaptcha
      // added pending class for form
      form.classList.add("brz-forms2--pending");
      const recaptchaId = recaptcha.getAttribute("recaptchaId");
      global.grecaptcha.execute(recaptchaId);
    });
  } else {
    $form.on("submit", "form", function(event) {
      event.preventDefault();

      // validate form
      const isValid = validateForm(form);

      if (!isValid) {
        return;
      }

      // create formData;
      const data = getFormData(form);
      handleSubmit(form, data);
    });
  }
}

function handleSubmit(form, allData) {
  // clear form messages
  clearFormMessages(form);

  // block submit button for repeat click
  const submit = form.querySelector(".brz-btn");
  submit.classList.add("brz-blocked");

  const nodeForm = form.querySelector("form.brz-form");

  if (!nodeForm) {
    return;
  }

  const {
    projectId,
    formId,
    redirect,
    success: successMessage,
    error: errorMessage
  } = nodeForm.dataset;
  const url = nodeForm.getAttribute("action");
  const { formData, data } = allData;

  formData.append("data", JSON.stringify(data));
  formData.append("project_id", projectId);
  formData.append("form_id", formId);

  const handleDone = data => {
    // check status in the data
    const { success = undefined } = data || {};

    if (success === false) {
      handleError();
    } else {
      showFormMessage(form, getFormMessage("success", successMessage));

      if (redirect !== "") {
        window.location.replace(redirect);
      }

      // Reset Form Values
      resetFormValues(form);
    }
  };

  const handleError = () => {
    form.classList.add("brz-forms2__send--fail");
    showFormMessage(form, getFormMessage("error", errorMessage));
  };

  const handleAlways = () => {
    submit.classList.remove("brz-blocked");
  };

  const callbacks = {
    done: handleDone,
    error: handleError,
    always: handleAlways
  };

  return sendForm(url, formData, callbacks);
}

function getFormData(form) {
  let formData = new FormData();
  let data = [];

  form
    .querySelectorAll(".brz-forms2__item:not(.brz-forms2__item-button)")
    .forEach(node => {
      const elements = node.querySelectorAll("input, textarea, select");

      if (elements.length === 0) {
        return;
      }

      let dataValue = {};

      // checkboxes & radio
      const isOptions = node.querySelector(
        ".brz-forms2__checkbox, .brz-forms2__radio"
      );
      if (isOptions && elements.length > 1) {
        let elementValues = [];

        elements.forEach(element => {
          const { name, required, type, checked, value, dataset } = element;

          if (checked) {
            elementValues.push(value);
            dataValue.name = name;
            dataValue.required = required;
            dataValue.type = type;
            dataValue.label = dataset.label;
          }
        });

        dataValue.value = elementValues.join(",");
      } else {
        const [node] = elements;
        const name = node.getAttribute("name");
        const { type, label } = node.dataset;
        const required = node.required;
        let value = node.value;

        dataValue.name = name;
        dataValue.value = value;
        dataValue.required = required;
        dataValue.type = type;
        dataValue.label = label;

        if (type === "FileUpload") {
          const files = node.files;

          for (const file of files) {
            formData.append(`${name}[]`, file, file.name);
          }

          dataValue.maxSize = parseInt(node.dataset.fileMaxSize);
          dataValue.extensions = node.getAttribute("accept");
        }
        if (type === "Hidden") {
          dataValue.value = label;
        }
        if (type === "Select") {
          const multiple = node.multiple;

          if (multiple) {
            const selected = node.querySelectorAll("option:checked");
            const values = Array.from(selected).map(el => el.value);

            dataValue.value = values.join(",");
          }
        }
      }

      data.push(dataValue);
    });

  return {
    data,
    formData
  };
}

function getFormMessage(status, text) {
  const defaultTexts = {
    success: "Your email was sent successfully",
    error: "Your email was not sent",
    empty: "Please check your entry and try again"
  };
  const alert = document.createElement("div");
  alert.className = `brz-forms2__alert brz-forms2__alert--${status}`;
  alert.innerHTML = text || defaultTexts[status];

  return alert;
}

function clearFormMessages(form) {
  const alert = form.querySelector(".brz-forms2__alert");

  if (alert) {
    alert.remove();
  }

  form.classList.remove(
    "brz-forms2__send--empty",
    "brz-forms2__send--success",
    "brz-forms2__send--fail"
  );
}

function showFormMessage(form, message) {
  clearFormMessages(form);
  form.appendChild(message);
}

function resetFormValues(form) {
  form.querySelectorAll(".brz-forms2__item").forEach(item => {
    item.querySelectorAll("input, textarea, select").forEach((el, index) => {
      switch (el.type) {
        case "radio": {
          el.checked = index === 0;
          break;
        }
        case "checkbox": {
          el.checked = false;
          break;
        }
        default: {
          el.value = "";
        }
      }
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
}

function sendForm(url, formData, cbs) {
  const { done, error, always } = cbs;

  return $.ajax({
    type: "POST",
    processData: false,
    contentType: false,
    url: url,
    data: formData
  })
    .done(done)
    .fail(error)
    .always(always);
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
