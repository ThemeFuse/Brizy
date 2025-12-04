import $ from "jquery";
import { makeDataAttrString } from "visual/utils/i18n/attribute";
import { getTranslatedResponseMessages } from "../Form2/utils";

const recaptchaSelector =
  '.brz-g-recaptcha[data-sitekey]:not([data-sitekey=""])';

const defaultMessages = {
  success: "Your email was sent successfully",
  error: "Your email was not sent",
  empty: "Please check your entry and try again"
};

const resMessages = new Map();

export default function ($node) {
  const root = $node.get(0);
  const versionAttr = makeDataAttrString({
    name: "form-version",
    value: "'1'"
  });

  // RECAPTCHA
  // Get all elements with a non-empty site-key data attribute
  const recaptcha = root.querySelectorAll(recaptchaSelector);

  if (recaptcha.length) {
    // Load Script recaptcha
    loadReCAPTCHA();

    // callback recaptcha
    global.brzFormV1Captcha = (token) => {
      const formActive = root.querySelector(
        `${versionAttr}.brz-forms--pending`
      );

      if (formActive) {
        const formData = getFormData(formActive);
        const data = [
          ...formData,
          {
            name: "g-recaptcha-response",
            value: token
          }
        ];

        handleSimpleSubmit(formActive, data).then(() => {
          formActive.classList.remove("brz-forms--pending");

          // need reset captchaId
          const recaptcha = formActive.querySelector(".brz-g-recaptcha");
          const recaptchaId = recaptcha.getAttribute("recaptchaId");
          global.grecaptcha.reset(recaptchaId);
        });
      }
    };

    // render Recaptcha
    global.brzOnloadRecaptchaCallback = function () {
      recaptcha.forEach((node) => {
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

  root.querySelectorAll(versionAttr).forEach(initForm);
}

function validateFormItem(node) {
  const value = node.value;
  const isRequired = node.required;
  const pattern = node.getAttribute("pattern") || "";
  const patternTest = new RegExp(pattern).test(value);
  const parentElem = node.closest(".brz-forms__item");
  let result = true;

  if (parentElem === null) {
    return false;
  }

  parentElem.classList.remove(
    "brz-forms__item--error",
    "brz-forms__item--error-pattern",
    "brz-forms__item--error-required"
  );

  if (isRequired && (!value || !patternTest)) {
    parentElem.classList.add(
      "brz-forms__item--error",
      "brz-forms__item--error-required"
    );
    result = false;
  }

  if (value.length && !patternTest) {
    parentElem.classList.add(
      "brz-form__item--error",
      "brz-form__item--error-pattern"
    );
    result = false;
  }

  return result;
}

function validateForm(form) {
  let isValid = true;
  const elements = form.querySelectorAll(
    "input[pattern], textarea[pattern], input[required], textarea[required]"
  );

  elements.forEach((element) => {
    if (!validateFormItem(element)) {
      isValid = false;
    }
  });

  return isValid;
}

function initForm(form) {
  const $form = $(form);
  const formNode = form.querySelector("form");

  if (formNode) {
    const messages = getTranslatedResponseMessages(formNode);
    resMessages.set(formNode, messages);
  }

  $form.on("blur", "form input, form textarea", function () {
    validateFormItem(this);
  });

  $form.on(
    "click",
    "form .brz-control__select .brz-control__select-option",
    function () {
      const input = $(this)
        .closest(".brz-control__select")
        .find("input")
        .get(0);
      validateFormItem(input);
    }
  );

  const recaptcha = form.querySelector(recaptchaSelector);

  // if has recaptcha
  // (1) need generate token
  // (1.1) captcha is called global fn brzFormV1Captcha
  // (2) need added the pending form selector .brz-forms--pending
  // (2.1) this class is used in brzFormV1Captcha for find and generate formData
  if (recaptcha) {
    $form.on("submit", "form", function (event) {
      event.preventDefault();

      // validate form
      const isValid = validateForm(form);

      if (!isValid) {
        return;
      }

      // call recaptcha
      // added pending class for form
      form.classList.add("brz-forms--pending");
      const recaptchaId = recaptcha.getAttribute("recaptchaId");
      global.grecaptcha.execute(recaptchaId);
    });
  } else {
    $form.on("submit", "form", function (event) {
      event.preventDefault();

      // validate form
      const isValid = validateForm(form);

      if (!isValid) {
        return;
      }

      // create formData;
      const data = getFormData(form);
      handleSimpleSubmit(form, data);
    });
  }
}

function handleSimpleSubmit(form, data) {
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
    brzProjectId,
    brzFormId,
    brzSuccess: successMessage,
    brzError: errorMessage,
    brzRedirect
  } = nodeForm.dataset;
  const url = nodeForm.getAttribute("action");

  const handleDone = (data) => {
    // check status in the data
    const { success = undefined } = data || {};

    if (success === false) {
      handleError();
    } else {
      showFormMessage(
        form,
        getFormMessage({
          status: "success",
          text: successMessage,
          form: nodeForm
        })
      );

      if (brzRedirect !== "") {
        window.location.replace(brzRedirect);
      }

      // Reset Forms Fields Value
      resetFormValues(form);
    }
  };

  const handleError = () => {
    form.classList.add("brz-form__send--fail");
    showFormMessage(
      form,
      getFormMessage({ status: "error", text: errorMessage, form: nodeForm })
    );
  };

  const handleAlways = () => {
    submit.classList.remove("brz-blocked");
  };

  const callbacks = {
    done: handleDone,
    error: handleError,
    always: handleAlways
  };
  const formData = {
    data: JSON.stringify(data),
    project_id: brzProjectId,
    form_id: brzFormId
  };

  return sendForm(url, formData, callbacks);
}

function getFormData(form) {
  const data = [];

  form
    .querySelectorAll(".brz-forms__fields input,  .brz-forms__fields textarea")
    .forEach((element) => {
      const { brzType, brzLabel } = element.dataset;
      const name = element.getAttribute("name");
      const value = element.value;
      const required = element.required;

      data.push({
        name: name,
        value: value,
        required: required,
        type: brzType,
        label: brzLabel
      });
    });

  return data;
}

function getFormMessage({ status, text, form }) {
  const messages = form ? resMessages.get(form) : undefined;
  const message = messages ? messages[status] : undefined;

  switch (status) {
    case "success": {
      const alert = document.createElement("div");
      alert.className = "brz-forms__alert brz-forms__alert--success";
      alert.innerHTML = text || message || defaultMessages.success;

      return alert;
    }
    case "error": {
      const alert = document.createElement("div");
      alert.className = "brz-forms__alert brz-forms__alert--error";
      alert.innerHTML = text || message || defaultMessages.error;

      return alert;
    }
  }
}

function clearFormMessages(form) {
  const alert = form.querySelector(".brz-forms__alert");

  if (alert) {
    alert.remove();
  }

  form.classList.remove(
    "brz-forms__send--empty",
    "brz-forms__send--success",
    "brz-forms__send--fail"
  );
}

function showFormMessage(form, message) {
  form.appendChild(message);
}

function resetFormValues(form) {
  form.querySelectorAll(".brz-forms__item").forEach((element) => {
    element.querySelectorAll("input, textarea, select").forEach((element) => {
      element.value = "";
      element.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
}

function sendForm(url, formData, cbs) {
  const { done, error, always } = cbs;

  return $.ajax({
    type: "POST",
    url: url,
    data: formData
  })
    .done(done)
    .fail(error)
    .always(always);
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
