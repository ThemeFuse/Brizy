import { Num, Obj, Str } from "@brizy/readers";
import type PerfectScrollbar from "perfect-scrollbar";
import type { Option } from "slim-select";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { getFreeLibs } from "visual/libs";
import { isIOS } from "visual/utils/devices";
import { readDataAttr } from "visual/utils/export/dataAttr";
import { delegatedTargets } from "visual/utils/export/delegate";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import { decodeFromString } from "visual/utils/string";
import { isNullish, type MValue } from "visual/utils/value";
import { FormAccessibility } from "../accessibility";
import { popup } from "../SectionPopup2/popup";
import type { PhoneOption } from "./Form2Field/types/type";
import { initCalculatedField } from "./initCalculatedField";
import { initMultiStep } from "./initMultiStep";
import {
  type SendCallbacks,
  type SendResult,
  sendRequest
} from "./sendRequest";
import {
  type AllFormData,
  type DataValue,
  type Errors,
  type GetFormMessageData,
  MessageStatus,
  type ResponseMessages
} from "./types";
import {
  flagsToSelectPhoneOptions,
  getFlagIconClass,
  getTranslatedResponseMessages,
  isPhoneType
} from "./utils";

let isSubmitEnabled = true;
const HIDE_SUBMIT_MESSAGE_DELAY_MS = 5000;
const recaptchaSelector =
  '.brz-g-recaptcha[data-sitekey]:not([data-sitekey=""])';

const defaultResponseMessages: ResponseMessages = {
  success: "Your email was sent successfully",
  error: "Your email was not sent",
  empty: "Please fill in the required fields",
  invalid: "Please check your entry and try again",
  "invalid-email": "Please enter a valid email address (e.g., name@example.com)"
};

function disableIOSInputZoom() {
  const viewport = document.querySelector<HTMLMetaElement>(
    'meta[name="viewport"]'
  );
  if (!viewport) return;

  if (!/maximum-scale/i.test(viewport.content)) {
    viewport.content += ", maximum-scale=1";
  }
}

const responseMessages = new Map<HTMLFormElement, ResponseMessages>();
const formMessageTimeouts = new Map<
  HTMLElement,
  ReturnType<typeof setTimeout>
>();

export const showErrorMessage = (form: HTMLFormElement) => {
  const isFormFieldEmpty = !!form.querySelector(
    ".brz-forms2__item--error-required"
  );

  const isEmailPatternInvalid = !!form.querySelector(
    ".brz-forms2__item--error-pattern .brz-forms2__field-email"
  );

  const status = isFormFieldEmpty
    ? MessageStatus.Empty
    : isEmailPatternInvalid
      ? MessageStatus.InvalidEmail
      : MessageStatus.Invalid;

  const { brzEmpty: formErrorMessage } = form.dataset;
  const message = getFormMessage({
    status,
    form,
    text: status === MessageStatus.Empty ? formErrorMessage : undefined
  });

  if (message) {
    showFormMessage(form, message);
  }
};

export default function (root: HTMLElement): void {
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

        handleSubmit(formActive, formData)?.then((result) => {
          if (result.kind !== "done") {
            return;
          }

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
    global.brzOnloadRecaptchaCallback = () => {
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

  // For Calculated
  const { Formula, SlimSelect } = getFreeLibs();

  if (Formula) {
    root
      .querySelectorAll<HTMLElement>(".brz-forms2__calculated")
      .forEach((item) => {
        initCalculatedField(item, Formula);
      });
  }

  // For Phone
  if (SlimSelect) {
    const translatedFlagsHTML = Array.from(
      root.querySelector<HTMLSelectElement>(
        ".brz-forms2__field-phone--translated-data select"
      )?.children ?? []
    );

    const flags: PhoneOption[] = (
      translatedFlagsHTML as HTMLOptionElement[]
    ).map((option) => {
      const dialCode = option.getAttribute("data-dial-code") ?? "";

      return {
        dialCode,
        name: option.textContent ?? "",
        code: option.value
      };
    });

    // Remove all divs that contain the translated strings because we already have the data
    root
      .querySelectorAll<HTMLElement>(
        ".brz-forms2__field-phone--translated-data"
      )
      .forEach((container) => {
        container.remove();
      });

    root
      .querySelectorAll<HTMLElement>(".brz-forms2__field-phone")
      .forEach((item) => {
        const select = item.querySelector<HTMLSelectElement>(
          ".brz-forms2__phone--country select"
        );

        if (select) {
          const defaultCountry =
            item.getAttribute("data-brz-default-country") ?? "US";
          const defaultDialCode =
            flags.find((flag) => flag.code === defaultCountry)?.dialCode ?? "";

          const contentLocation = item.querySelector<HTMLElement>(
            ".brz-forms2__phone--country"
          );

          const currentValueNode = item.querySelector<HTMLElement>(
            ".brz-forms2__phone--country-selected"
          );

          const input = item.querySelector<HTMLInputElement>(
            ".brz-forms2__phone--number input.brz-input"
          );
          input?.setAttribute("data-dial-code", defaultDialCode);

          const selectInstance = new SlimSelect({
            select,
            settings: {
              contentLocation
            },
            data: flagsToSelectPhoneOptions(flags, defaultCountry),
            events: {
              afterChange: (data: Option[]) => {
                const v = data[0]?.value;
                if (!v) {
                  return;
                }

                const currentFlag = flags.find((flag) => flag.code === v);

                if (currentFlag) {
                  const currentValueNodeInner = item.querySelector<HTMLElement>(
                    ".brz-forms2__phone--country-selected span"
                  );

                  if (currentValueNodeInner) {
                    const next = document.createElement("span");
                    next.className = getFlagIconClass(currentFlag.code);
                    currentValueNodeInner.replaceWith(next);
                  }

                  const dialCodeNode = item.querySelector<HTMLElement>(
                    ".brz-forms2__phone--country-code"
                  );

                  if (dialCodeNode) {
                    dialCodeNode.textContent = currentFlag.dialCode;
                  }
                  input?.setAttribute("data-dial-code", currentFlag.dialCode);
                }
              }
            }
          });

          if (currentValueNode) {
            currentValueNode.addEventListener("click", () => {
              selectInstance.open();
            });
          }
        }
      });
  }

  // For Date
  root
    .querySelectorAll<HTMLElement>(".brz-forms2__field-date")
    .forEach((node) => {
      const data = node.dataset;
      const minDate = data.brzMin;
      const maxDate = data.brzMax;
      const native = data.brzNative === "true";
      const language = data.brzLanguage;
      const dateFormat = data.brzDateFormat;
      const { Flatpickr } = getFreeLibs();

      if (!native && Flatpickr) {
        Flatpickr(node, {
          minDate: minDate,
          maxDate: maxDate,
          disableMobile: true,
          locale: (language ?? "en") as keyof typeof Flatpickr.l10ns,
          dateFormat: dateFormat ?? "Y-m-d"
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
      const select = node.querySelector<HTMLSelectElement>(".brz-select");
      const { select2, Scrollbars } = getFreeLibs();

      if (!select || !select2) {
        return;
      }

      const isMultiple = select.multiple;
      const placeholder = readDataAttr(select, "brz-placeholder");
      const maxItemDropdown =
        select.getAttribute("data-brz-max-item-dropdown") ?? "5";
      let initialized = false;

      const handle = select2(select, {
        width: "100%",
        minimumResultsForSearch: Number.POSITIVE_INFINITY,
        dropdownParent: node,
        placeholder,
        templateSelection: (data) => {
          return !placeholder && !initialized
            ? ""
            : (Str.read(data.text) ?? "");
        },
        templateResult: (data) =>
          typeof data.text === "string" ? data.text : "",
        dropdownAutoWidth: false
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

      const formAccessibility = new FormAccessibility({
        selectNode: node,
        select,
        rootNode: root,
        select2: handle
      });

      formAccessibility.init();

      // Custom Scrollbars
      let scrollbars: PerfectScrollbar | undefined;

      select.addEventListener("select2:opening", () => {
        // waiting appear the dropdown in the dom
        setTimeout(() => {
          const dropdown = node.querySelector<HTMLElement>(".select2-dropdown");
          const item = dropdown?.querySelector<HTMLElement>(
            ".select2-results__options .select2-results__option"
          );
          const itemHeight = item ? parseInt(getItemHeight(item), 10) : NaN;
          const maxHeight = itemHeight * parseInt(maxItemDropdown, 10);

          if (dropdown && !Number.isNaN(maxHeight)) {
            dropdown.style.maxHeight = `${maxHeight}px`;
          }

          if (dropdown && Scrollbars) {
            scrollbars = new Scrollbars(dropdown);
          }

          if (isMultiple) {
            node.classList.add("brz-forms2__field-select--multiple--opened");
          }
        }, 0);
      });

      // A closing dropdown validates the field, as leaving its hidden search field always did.
      select.addEventListener("select2:closing", () => {
        const search = node.querySelector<HTMLFormElement>(
          ".select2-search--dropdown .select2-search__field"
        );

        if (search && document.activeElement !== search) {
          validateFormItem(search);
        }
      });

      // destroy custom scrollbar when dropdown closed
      select.addEventListener("select2:close", () => {
        if (scrollbars) {
          scrollbars.destroy();
          scrollbars = undefined;
        }

        if (isMultiple) {
          node.classList.remove("brz-forms2__field-select--multiple--opened");
        }
      });

      initialized = true;
    });

  if (isIOS()) {
    disableIOSInputZoom();
  }
}

// The computed height of a dropdown row, measured the way the max height always was.
const getItemHeight = (item: HTMLElement): string => {
  const styles = getComputedStyle(item);
  const height = styles.height;

  if (/^[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)(?!px)[a-z%]+$/i.test(height)) {
    return height;
  }

  const isAuto =
    height === "auto" || (!parseFloat(height) && styles.display === "inline");

  if (isAuto && item.getClientRects().length) {
    if (styles.boxSizing === "border-box") {
      return `${item.offsetHeight}px`;
    }

    const edges =
      (parseFloat(styles.paddingTop) || 0) +
      (parseFloat(styles.paddingBottom) || 0) +
      (parseFloat(styles.borderTopWidth) || 0) +
      (parseFloat(styles.borderBottomWidth) || 0);

    return `${item.offsetHeight - edges}px`;
  }

  return `${parseFloat(height) || 0}px`;
};

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
  const form = node.closest<HTMLFormElement>(".brz-form");
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

  if (isRequired && !value) {
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

    if (value && _brzMin && toNum < _brzMin) {
      const messages = getFormMessage({
        status: MessageStatus.Error,
        form,
        text: `${
          _error?.minNumError ||
          "Selected quantity is less than stock status, min:"
        } ${brzMin}`
      });

      if (form) {
        showFormMessage(form, messages);
      }

      parentElem?.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-pattern"
      );
      result = false;
    }
    if (value && _brzMax && toNum > _brzMax) {
      const messages = getFormMessage({
        status: MessageStatus.Error,
        text: `${
          _error?.maxNumError ||
          "Selected quantity is more than stock status, max:"
        } ${brzMax}`,
        form
      });

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
    const maxSize =
      parseInt(Str.read(node.dataset.brzFileMaxSize) ?? "", 10) || 1;
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
      // biome-ignore lint/complexity/noUselessEscapeInRegex: migrated from eslint
      const [ext] = name.match(/\.([^\.]+)$/);

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
      const messages = getFormMessage({
        status: MessageStatus.Error,
        text: `${
          _error?.fileMaxSizeError ||
          "This file exceeds the maximum allowed size."
        } ${brzFileMaxSize}`,
        form
      });

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
      const messages = getFormMessage({
        status: MessageStatus.Error,
        text: `${
          _error?.fileTypeError ||
          "Only files with the following extensions are allowed:"
        } ${ext}`,
        form
      });

      if (form) {
        showFormMessage(form, messages);
      }
    }
  }

  if (brzType === "Phone") {
    const phoneDigits = value.replace(/\D/g, "");
    const minLength = 4;
    const maxLength = 15;
    const hasInvalidChars = /\D/.test(value);

    if (value && hasInvalidChars) {
      const messages = getFormMessage({
        status: MessageStatus.Error,
        form,
        text:
          _error?.phoneInvalidCharsError ||
          "Phone number must contain only digits"
      });

      if (form) {
        showFormMessage(form, messages);
      }

      parentElem?.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-pattern"
      );
      result = false;
    } else if (value && phoneDigits.length < minLength) {
      const messages = getFormMessage({
        status: MessageStatus.Error,
        form,
        text:
          _error?.phoneMinLengthError ||
          `Phone number is too short, minimum ${minLength} digits required`
      });

      if (form) {
        showFormMessage(form, messages);
      }

      parentElem?.classList.add(
        "brz-forms2__item--error",
        "brz-forms2__item--error-pattern"
      );
      result = false;
    } else if (value && phoneDigits.length > maxLength) {
      const messages = getFormMessage({
        status: MessageStatus.Error,
        form,
        text:
          _error?.phoneMaxLengthError ||
          `Phone number is too long, maximum ${maxLength} digits allowed`
      });

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
    (brzType === "Checkbox" || brzType === "UserAgreementCheckbox") &&
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
    "input[pattern], textarea[pattern], input[required], textarea[required], input[type='file'], select[required], input[type='tel']"
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
  const formNode = form.querySelector<HTMLFormElement>("form");

  // Correction Form Fields with Checkbox & Radio
  form
    .querySelectorAll<HTMLElement>(
      ".brz-forms2__checkbox-options, .brz-forms2__radio-options, .brz-forms2__field-select"
    )
    .forEach((item) => {
      initFieldOptions(item);
    });

  if (formNode) {
    const messages = getTranslatedResponseMessages(formNode);
    responseMessages.set(formNode, messages);
  }

  const submitButton = form.querySelector(".brz-btn");
  const spinner = form.querySelector(".brz-form-spinner");

  if (submitButton && spinner) {
    submitButton.appendChild(spinner);
  }

  updatePattern(form);

  form.addEventListener("focusout", (event) => {
    delegatedTargets<HTMLFormElement>(
      form,
      event,
      ":scope form input, :scope form textarea, :scope form select"
    ).forEach((node) => {
      validateFormItem(node);
    });
  });

  const recaptcha = form.querySelector(recaptchaSelector);

  // if has recaptcha
  // (1) need generate token
  // (1.1) captcha is called global fn brzFormV1Captcha
  // (2) need added the pending form selector .brz-forms--pending
  // (2.1) this class is used in brzFormV1Captcha for find and generate formData
  if (recaptcha) {
    form.addEventListener("submit", (event) => {
      if (delegatedTargets(form, event, ":scope form").length === 0) {
        return;
      }

      event.preventDefault();

      // validate form
      const isValid = validateForm(form);

      if (!isValid && formNode) {
        return showErrorMessage(formNode);
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
    form.addEventListener("submit", (event) => {
      if (delegatedTargets(form, event, ":scope form").length === 0) {
        return;
      }

      event.preventDefault();

      if (isSubmitEnabled) {
        // validate form
        const isValid = validateForm(form);

        if (!isValid && formNode) {
          return showErrorMessage(formNode);
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
  const { formData, data: _data } = allData;

  const data = _data.map((item) => {
    if (isPhoneType(item.type) && item.value) {
      return {
        ...item,
        value: `${item.dialCode}${item.value}`
      };
    }

    return item;
  });

  formData.append("data", JSON.stringify(data));
  if (brzProjectId) {
    formData.append("project_id", brzProjectId);
  }
  if (brzFormId) {
    formData.append("form_id", brzFormId);
  }
  formData.append("page_url", window.location.href);

  const handleDone = (data: unknown) => {
    // check status in the data
    const success = Obj.read(data)?.success;

    if (success === false) {
      handleError();
    } else {
      const { brzClosePopup, brzPopupId } = nodeForm.dataset;
      const shouldClosePopup = brzClosePopup === "on";

      showFormMessage(
        nodeForm,
        getFormMessage({
          status: MessageStatus.Success,
          text: successMessage,
          form: nodeForm
        })
      );
      scheduleHideFormMessage(nodeForm);

      if (brzRedirect && brzRedirect !== "") {
        window.location.replace(brzRedirect);
      }

      if (shouldClosePopup && brzPopupId) {
        clearFormMessages(nodeForm);
        closePopupForm(brzPopupId);
      }

      // Reset Form Values
      resetFormValues(form);
    }
  };

  const handleError = () => {
    form.classList.add("brz-forms2__send--fail");
    showFormMessage(
      nodeForm,
      getFormMessage({
        status: MessageStatus.Error,
        text: errorMessage,
        form: nodeForm
      })
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
      const isPhone = node.querySelector(".brz-forms2__field-phone");

      // When the type is phone, we need to extract exactly our input
      // because otherwise the input and select from the slim-select library will be extracted as well
      const selector = isPhone ? "input.brz-input" : "input, textarea, select";

      const elements = node.querySelectorAll<HTMLFormElement>(selector);

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
            Str.read(node.dataset.brzFileMaxSize) ?? "",
            10
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
          dataValue.value = value || brzPlaceholder || brzLabel;
        }

        if (isPhoneType(brzType)) {
          dataValue.dialCode = node.dataset.dialCode;
        }
      }

      data.push(dataValue);
    });

  return {
    data,
    formData
  };
}

function getFormMessage({
  status,
  text,
  form
}: GetFormMessageData): HTMLDivElement {
  const alert = document.createElement("div");
  const textContainer = document.createElement("div");
  const textInner = document.createElement("span");

  const messages = form ? responseMessages.get(form) : undefined;
  const message = messages ? messages[status] : undefined;

  alert.className = `brz-forms2__alert brz-forms2__alert--${status}`;
  textContainer.className = "brz-forms2__alert-text";
  textInner.className = "brz-forms2__alert-text--inner";

  textInner.innerHTML = text || message || defaultResponseMessages[status];

  textContainer.appendChild(textInner);
  alert.appendChild(textContainer);

  return alert;
}

export function clearFormMessages(form: HTMLElement): void {
  const hideMessageTimeout = formMessageTimeouts.get(form);
  if (hideMessageTimeout) {
    clearTimeout(hideMessageTimeout);
    formMessageTimeouts.delete(form);
  }

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

  const messagesWrapper = form.querySelector(".brz-forms2__messages");

  if (messagesWrapper) {
    messagesWrapper.appendChild(message);
  } else {
    // for users who have not yet recompiled their HTML after the feature update for message styling
    form.appendChild(message);
  }
}

function scheduleHideFormMessage(form: HTMLElement): void {
  const timeoutId = setTimeout(() => {
    clearFormMessages(form);
  }, HIDE_SUBMIT_MESSAGE_DELAY_MS);

  formMessageTimeouts.set(form, timeoutId);
}

function closePopupForm(popupId: string): void {
  const elem = document.getElementById(popupId);

  if (!elem) {
    return;
  }

  if (elem.classList.contains("brz-popup2")) {
    popup([elem]).close();
  }
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
            if (el.getAttribute(makeAttr("type")) === ElementTypes.Calculated) {
              const defaultValue = el.getAttribute("defaultValue");
              const resultNode = el.parentNode?.querySelector<HTMLElement>(
                ".brz-forms2__calculated-result"
              );

              if (resultNode) {
                resultNode.innerText = defaultValue ?? "";
              }
            }

            if (
              el.closest(".brz-forms2__field-phone") &&
              el.tagName === "SELECT"
            ) {
              const phoneContainer = el.closest(".brz-forms2__field-phone");
              el.value =
                phoneContainer?.getAttribute("data-brz-default-country") ??
                "US";
              break;
            }

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
  cbs: SendCallbacks
): Promise<SendResult> {
  return sendRequest(url, { body: formData, contentType: undefined }, cbs);
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
  scriptElement.setAttribute(makeAttr("consent"), "necessary");

  document.body.append(scriptElement);

  return scriptElement;
}

// Radio & Checkbox
function initFieldOptions(element: HTMLElement): void {
  const values = element.dataset.value?.split(",").map((f) => f.trim()) ?? [];
  const inputs = element.querySelectorAll<HTMLInputElement>("input");
  const selects = element.querySelectorAll<HTMLSelectElement>("select");

  inputs.forEach((input) => {
    input.checked = values.includes(input.value) ?? false;
  });

  selects.forEach((select) => {
    const values = select.dataset.value?.split(",").map((f) => f.trim()) ?? [];
    const options = select.querySelectorAll("option");

    options.forEach((option) => {
      if (option.value) {
        option.selected = values.includes(option.value) ?? false;
      }
    });
  });
}
