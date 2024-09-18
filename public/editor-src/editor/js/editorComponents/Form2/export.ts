import { Num, Str } from "@brizy/readers";
import $ from "jquery";
import PerfectScrollbar from "perfect-scrollbar";
import { getFreeLibs } from "visual/libs";
import { makeDataAttrString } from "visual/utils/i18n/attribute";
import { decodeFromString } from "visual/utils/string";
import { isNullish, MValue } from "visual/utils/value";
import { initMultiStep } from "./initMultiStep";
import {
  AllFormData,
  DataValue,
  DoneResponse,
  Errors,
  MessageStatus
} from "./types";

let isSubmitEnabled = true;
const recaptchaSelector =
  '.brz-g-recaptcha[data-sitekey]:not([data-sitekey=""])';

export default function ($node: JQuery): void {
  const root = $node.get(0);

  if (!root) {
    return;
  }

  const versionAttr = makeDataAttrString({
    name: "form-version",
    value: "'2'"
  });

  // RECAPTCHA
  // Get all elements with a non-empty site-key data attribute
  const recaptcha = root.querySelectorAll<HTMLElement>(recaptchaSelector);

  if (recaptcha.length) {
    // Load Script recaptcha
    loadReCAPTCHA();

    // callback recaptcha
    global.brzFormV2Captcha = (token) => {
      const formActive = root.querySelector<HTMLElement>(
        `${versionAttr}.brz-forms2--pending`
      );

      if (formActive) {
        const allData = getFormData(formActive);
        const recaptchaData = [{ name: "g-recaptcha-response", value: token }];
        const formData = {
          formData: allData.formData,
          data: allData.data.concat(recaptchaData)
        };

        handleSubmit(formActive, formData)?.then(() => {
          formActive.classList.remove("brz-forms2--pending");

          // need reset captchaId
          const recaptcha = formActive.querySelector(".brz-g-recaptcha");
          if (recaptcha) {
            const recaptchaId =
              Str.read(recaptcha.getAttribute("recaptchaId")) ?? "";
            global.grecaptcha.reset(recaptchaId);
          }
        });
      }
    };

    // render Recaptcha
    global.brzOnloadRecaptchaCallback = function () {
      recaptcha.forEach((node) => {
        const { sitekey: _siteKey, size: _size, callback } = node.dataset;

        const sitekey = Str.read(_siteKey) ?? "";
        const size = Str.read(_size) ?? "";

        const recaptchaId = Str.read(
          global.grecaptcha.render(node, {
            sitekey,
            size,
            callback
          })
        );

        if (recaptchaId) {
          node.setAttribute("recaptchaId", recaptchaId);
        }
      });
    };
  }

  root.querySelectorAll<HTMLElement>(versionAttr).forEach((item) => {
    initMultiStep(item);
    initForm(item);
  });

  // For Date
  root
    .querySelectorAll<HTMLElement>(".brz-forms2__field-date")
    .forEach((node) => {
      const data = node.dataset;
      const minDate = data.brzMin;
      const maxDate = data.brzMax;
      const native = data.brzNative === "true";
      const { Flatpickr } = getFreeLibs();

      if (!native && Flatpickr) {
        Flatpickr(node, {
          minDate: minDate,
          maxDate: maxDate,
          disableMobile: true
        });
      } else {
        if (minDate) {
          node.setAttribute("min", minDate);
        }
        if (maxDate) {
          node.setAttribute("max", maxDate);
        }
      }
    });

  // For Time
  root
    .querySelectorAll<HTMLElement>(".brz-forms2__field-time")
    .forEach((node) => {
      const data = node.dataset;
      const minDate = data.brzMin;
      const maxDate = data.brzMax;
      const native = data.brzNative === "true";
      const { Flatpickr } = getFreeLibs();

      if (!native && Flatpickr) {
        Flatpickr(node, {
          minDate: minDate,
          maxDate: maxDate,
          enableTime: true,
          noCalendar: true,
          disableMobile: true
        });
      } else {
        if (minDate) {
          node.setAttribute("min", minDate);
        }
        if (maxDate) {
          node.setAttribute("max", maxDate);
        }
      }
    });

  // Select
  root
    .querySelectorAll<HTMLElement>(".brz-forms2__field-select")
    .forEach((node) => {
      const $this = $(node);
      const $select = $this.find(".brz-select");
      const isMultiple = ($select.get(0) as HTMLSelectElement).multiple;
      const placeholder = $select.data("brz-placeholder");
      const maxItemDropdown = $select.attr("data-brz-max-item-dropdown") ?? "5";
      let initialized = false;

      $select.select2({
        width: "100%",
        minimumResultsForSearch: Infinity,
        dropdownParent: $this,
        placeholder,
        templateSelection: (data) => {
          return !placeholder && !initialized ? "" : Str.read(data.text) ?? "";
        }
      });

      const oldArrow = node.querySelector(".select2-selection__arrow");
      const oldArrowMultiple = node.querySelector(
        ".select2-selection.select2-selection--multiple"
      );
      const newArrow = node.querySelector(".brz-forms2__select--arrow");

      if (newArrow) {
        if (oldArrow) {
          oldArrow.parentNode?.replaceChild(newArrow, oldArrow);
        }

        if (oldArrowMultiple) {
          oldArrowMultiple.appendChild(newArrow);
        }
      }

      // Custom Scrollbars
      const { Scrollbars } = getFreeLibs();
      let scrollbars: PerfectScrollbar | null;

      $select.on("select2:opening", function () {
        // waiting appear the dropdown in the dom
        setTimeout(function () {
          const $dropdown = $this.find(".select2-dropdown");
          const itemHeight = parseInt(
            $dropdown
              .find(".select2-results__options .select2-results__option")
              .css("height")
          );

          $dropdown.css("maxHeight", itemHeight * parseInt(maxItemDropdown));

          if ($dropdown.length && Scrollbars) {
            const node = $dropdown.get(0);

            if (node) {
              scrollbars = new Scrollbars(node);
            }
          }

          if (isMultiple) {
            $this.addClass("brz-forms2__field-select--multiple--opened");
          }
        }, 0);
      });

      // destroy custom scrollbar when dropdown closed
      $select.on("select2:close", function () {
        if (scrollbars) {
          scrollbars.destroy();
          scrollbars = null;
        }

        if (isMultiple) {
          $this.removeClass("brz-forms2__field-select--multiple--opened");
        }
      });

      initialized = true;
    });
}

const updatePattern = (form: HTMLElement): void => {
  const elements = form.querySelectorAll("input[pattern], textarea[pattern]");

  elements.forEach((item) => {
    const pattern = item.getAttribute("pattern");

    if (pattern) {
      item.setAttribute("pattern", decodeURI(pattern));
    }
  });
};

function validateFormItem(node: HTMLFormElement): boolean {
  const form = node.closest<HTMLElement>(".brz-form");
  const parentElem = node.closest(".brz-forms2__item");
  const { value, dataset: data, required: isRequired } = node;
  const { brzType, brzError, brzFileMaxSize } = data;

  const _error = brzError ? decodeFromString<Errors>(brzError) : null;

  const pattern = node.getAttribute("pattern");
  const patternTest = isNullish(pattern) || new RegExp(pattern).test(value);
  let result = true;

  parentElem?.classList.remove(
    "brz-forms2__item--error",
    "brz-forms2__item--error-pattern",
    "brz-forms2__item--error-required"
  );

  if (isRequired && (!value || !patternTest)) {
    parentElem?.classList.add(
      "brz-forms2__item--error",
      "brz-forms2__item--error-required"
    );
    result = false;
  }

  if (value.length && !patternTest) {
    parentElem?.classList.add(
      "brz-forms2__item--error",
      "brz-forms2__item--error-pattern"
    );
    result = false;
  }

  if (brzType === "Number") {
    const { brzMin, brzMax } = data;
    const toNum = Number(value);
    const _brzMin = Num.read(brzMin);
    const _brzMax = Num.read(brzMax);

    if (Boolean(value) && _brzMin && toNum < _brzMin) {
      const messages = getFormMessage(
        MessageStatus.Error,
        `${
          _error?.minNumError ||
          "Selected quantity is less than stock status, min:"
        } ${brzMin}`
      );

      if (form) {
        showFormMessage(form, messages);
      }

      parentElem?.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-pattern"
      );
      result = false;
    }
    if (Boolean(value) && _brzMax && toNum > _brzMax) {
      const messages = getFormMessage(
        MessageStatus.Error,
        `${
          _error?.maxNumError ||
          "Selected quantity is more than stock status, max:"
        } ${brzMax}`
      );

      if (form) {
        showFormMessage(form, messages);
      }

      parentElem?.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-pattern"
      );
      result = false;
    }
  }

  if (brzType === "FileUpload") {
    const files = node.files;
    const maxSize = parseInt(Str.read(node.dataset.brzFileMaxSize) ?? "") || 1;
    const accepts = node.getAttribute("accept")
      ? node
          ?.getAttribute("accept")
          ?.replace(/\s+/g, "")
          .toLowerCase()
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

      if (ext) {
        isAccept = !(accepts ?? []).includes(ext.toLowerCase());
      }
    }

    if (isBig) {
      result = false;
      parentElem?.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-pattern"
      );
      const messages = getFormMessage(
        MessageStatus.Error,
        `${
          _error?.fileMaxSizeError ||
          "This file exceeds the maximum allowed size."
        } ${brzFileMaxSize}`
      );

      if (form) {
        showFormMessage(form, messages);
      }
    }
    if (isAccept) {
      result = false;
      parentElem?.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-pattern"
      );
      const ext = accepts?.map((ext) => ext.replace(".", "")).join(", ");
      const messages = getFormMessage(
        MessageStatus.Error,
        `${
          _error?.fileTypeError ||
          "Only files with the following extensions are allowed:"
        } ${ext}`
      );

      if (form) {
        showFormMessage(form, messages);
      }
    }
  }

  const isSelect = node.closest(".brz-forms2__field-select");

  if (isSelect) {
    const nodeSelect = isSelect.querySelector<HTMLSelectElement>(".brz-select");
    const multiple = nodeSelect?.multiple;
    const value = nodeSelect?.value;

    if (multiple) {
      const selected =
        nodeSelect.querySelectorAll<HTMLOptionElement>("option:checked");
      const values = Array.from(selected).map((el) => el.value);

      if (values.length === 0) {
        parentElem?.classList.add(
          "brz-forms2__item--error",
          "brz-forms2__item--error-required"
        );
        result = false;
      }
    } else if (value === " ") {
      parentElem?.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-required"
      );
      result = false;
    }
  }

  if (
    isRequired &&
    brzType === "Checkbox" &&
    ![...(parentElem?.querySelectorAll("input") ?? [])].some(
      ({ checked }) => checked
    )
  ) {
    parentElem?.classList.add(
      "brz-forms2__item--error",
      "brz-forms2__item--error-required"
    );
    result = false;
  }

  return result;
}

export function validateForm(form: HTMLElement): boolean {
  const elements = form.querySelectorAll<HTMLFormElement>(
    "input[pattern], textarea[pattern], input[required], textarea[required], input[type='file'], select[required]"
  );
  let submitForm = true;

  elements.forEach((element) => {
    if (!validateFormItem(element)) {
      submitForm = false;
    }
  });

  return submitForm;
}

function initForm(form: HTMLElement): void {
  const $form = $(form);

  const submitButton = form.querySelector(".brz-btn");
  const spinner = form.querySelector(".brz-form-spinner");

  if (submitButton && spinner) {
    submitButton.appendChild(spinner);
  }

  updatePattern(form);

  $form.on("blur", "form input, form textarea, form select", function () {
    validateFormItem(this);
  });

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
      form.classList.add("brz-forms2--pending");
      const recaptchaId = Str.read(recaptcha.getAttribute("recaptchaId"));

      if (recaptchaId) {
        global.grecaptcha.execute(recaptchaId);
      }
    });
  } else {
    $form.on("submit", "form", function (event) {
      event.preventDefault();

      if (isSubmitEnabled) {
        // validate form
        const isValid = validateForm(form);

        if (!isValid) {
          return;
        }

        // create formData;
        const data = getFormData(form);
        handleSubmit(form, data);
        isSubmitEnabled = false;
      }
    });
  }
}

function setSpinner(submit: HTMLElement, isLoading: boolean): void {
  if (!submit.children.length) return;

  const _children = Array.from(submit.children);
  const spinner = _children.find((node) =>
    node.classList.contains("brz-form-spinner")
  );

  if (isLoading) {
    submit.classList.add("brz-blocked");

    _children.forEach((node) => {
      node.classList.add("brz-invisible");
    });

    if (spinner) {
      spinner.classList.remove("brz-invisible");
    }
  } else {
    submit.classList.remove("brz-blocked");

    _children.forEach((node) => {
      node.classList.remove("brz-invisible");
    });

    if (spinner) {
      spinner.classList.add("brz-invisible");
    }
    isSubmitEnabled = true;
  }
}

function handleSubmit(form: HTMLElement, allData: AllFormData) {
  // clear form messages
  clearFormMessages(form);

  const submit = form.querySelector<HTMLElement>(".brz-btn");

  if (submit) {
    setSpinner(submit, true);
  }

  const nodeForm = form.querySelector<HTMLFormElement>("form.brz-form");

  if (!nodeForm) {
    return;
  }

  const {
    brzProjectId,
    brzFormId,
    brzRedirect,
    brzSuccess: successMessage,
    brzError: errorMessage
  } = nodeForm.dataset;

  const url = Str.read(nodeForm.getAttribute("action")) ?? "";
  const { formData, data } = allData;

  formData.append("data", JSON.stringify(data));
  if (brzProjectId) {
    formData.append("project_id", brzProjectId);
  }
  if (brzFormId) {
    formData.append("form_id", brzFormId);
  }

  const handleDone = (data: DoneResponse) => {
    // check status in the data
    const { success = undefined } = data || {};

    if (success === false) {
      handleError();
    } else {
      showFormMessage(
        nodeForm,
        getFormMessage(MessageStatus.Success, successMessage)
      );

      if (brzRedirect && brzRedirect !== "") {
        window.location.replace(brzRedirect);
      }

      // Reset Form Values
      resetFormValues(form);
    }
  };

  const handleError = () => {
    form.classList.add("brz-forms2__send--fail");
    showFormMessage(
      nodeForm,
      getFormMessage(MessageStatus.Error, errorMessage)
    );
  };

  const handleAlways = () => {
    if (submit) {
      setSpinner(submit, false);
    }
  };

  const callbacks = {
    done: handleDone,
    error: handleError,
    always: handleAlways
  };

  return sendForm(url, formData, callbacks);
}

function getFormData(form: HTMLElement): AllFormData {
  const formData = new FormData();
  const data: Partial<DataValue>[] = [];

  form
    .querySelectorAll(".brz-forms2__item:not(.brz-forms2__item-button)")
    .forEach((node) => {
      const elements = node.querySelectorAll<HTMLFormElement>(
        "input, textarea, select"
      );

      if (elements.length === 0) {
        return;
      }

      const dataValue: Partial<DataValue> = {};

      // checkboxes & radio
      const isOptions = node.querySelector(
        ".brz-forms2__checkbox, .brz-forms2__radio"
      );
      if (isOptions) {
        const elementValues: string[] = [];

        elements.forEach((element) => {
          const { name, required, type, checked, value, dataset } = element;

          if (checked) {
            elementValues.push(value);
          }

          dataValue.name = name;
          dataValue.required = required;
          dataValue.type = type;
          dataValue.label = Str.read(dataset.brzLabel) ?? "";
        });

        dataValue.value = elementValues.join(",");
      } else {
        const [node] = elements;
        const name = Str.read(node.getAttribute("name")) ?? "";
        const { brzType, brzLabel, brzPlaceholder } = node.dataset;
        const required = node.required;
        const value = node.value;

        dataValue.name = name;
        dataValue.value = value;
        dataValue.required = required;
        dataValue.type = Str.read(brzType) ?? "";
        dataValue.label = Str.read(brzLabel) ?? "";

        if (brzType === "FileUpload") {
          const files = node.files;

          for (const file of files) {
            formData.append(`${name}[]`, file, file.name);
          }

          dataValue.maxSize = parseInt(
            Str.read(node.dataset.brzFileMaxSize) ?? ""
          );
          dataValue.extensions = Str.read(node.getAttribute("accept")) ?? "";
        }
        if (brzType === "Select") {
          const multiple = node.multiple;

          if (multiple) {
            const selected =
              node.querySelectorAll<HTMLOptionElement>("option:checked");
            const values = Array.from(selected).map((el) => el.value);

            dataValue.value = values.join(",");
          }
        }

        if (brzType === "Hidden") {
          dataValue.value = brzPlaceholder || brzLabel;
        }
      }

      data.push(dataValue);
    });

  return {
    data,
    formData
  };
}

function getFormMessage(status: MessageStatus, text?: string): HTMLDivElement {
  const defaultTexts: { [k in MessageStatus]: string } = {
    success: "Your email was sent successfully",
    error: "Your email was not sent",
    empty: "Please check your entry and try again"
  };
  const alert = document.createElement("div");
  alert.className = `brz-forms2__alert brz-forms2__alert--${status}`;
  alert.innerHTML = text || defaultTexts[status];

  return alert;
}

export function clearFormMessages(form: HTMLElement): void {
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

function showFormMessage(form: HTMLElement, message: HTMLElement): void {
  clearFormMessages(form);
  form.appendChild(message);
}

function resetFormValues(form: HTMLElement): void {
  form.querySelectorAll<HTMLElement>(".brz-forms2__item").forEach((item) => {
    item
      .querySelectorAll<HTMLFormElement>("input, textarea, select")
      .forEach((el, index) => {
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

function sendForm(
  url: string,
  formData: FormData,
  cbs: {
    done: (data: DoneResponse) => void;
    error: VoidFunction;
    always: VoidFunction;
  }
) {
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
function loadReCAPTCHA(): MValue<HTMLScriptElement> {
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
