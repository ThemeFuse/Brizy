import { Num, Str } from "@brizy/readers";
import _Formula from "fparser";
import $ from "jquery";
import { makeAttr } from "visual/utils/i18n/attribute";
import { decodeFromString } from "visual/utils/string";

export const initCalculatedField = (
  item: HTMLElement,
  Formula: typeof _Formula
): void => {
  const form = item.closest<HTMLElement>("form.brz-form");
  const calculatedField = item.querySelector<HTMLElement>(
    ".brz-forms2__calculated-result"
  );
  const inputValue = item.querySelector<HTMLInputElement>(
    "input[type='hidden']"
  );

  if (calculatedField) {
    const expression = Str.read(
      calculatedField.getAttribute(makeAttr("calc-expression"))
    );

    const _expression =
      expression && decodeFromString<string>(expression).replace(/\s+/g, "");

    if (_expression) {
      const operators = ["+", "-", "*", "/"];

      // remove extra spaces and parantheses and get field names from "{{ }}"
      const _fields = _expression
        .replace(/\s+/g, "")
        .replace(/[()]/g, "")
        .split(/\{{([^}}]+)\}}/)
        .filter((item) => !operators.includes(item) && item.length);

      const values: string[] = [];
      const result = "";

      if (form) {
        setCalculatedListeners(
          _fields,
          form,
          values,
          result,
          _expression,
          calculatedField,
          inputValue,
          Formula
        );
      }

      if (
        inputValue &&
        calculatedField &&
        !inputValue.hasAttribute("defaultValue")
      ) {
        inputValue.setAttribute("defaultValue", calculatedField.innerText);
      }
    }
  }
};

export const getCalculatedValue = (
  value: string,
  field: string,
  expression: string,
  fallbackFunction: (field: string, expression: string) => 0 | 1
): string => {
  let result = expression;
  if (value) {
    result = result.replace(`{{${field}}}`, value);
  } else {
    const _value = fallbackFunction(field, expression);
    result = result.replace(`{{${field}}}`, String(_value));
  }

  return result;
};

export const getValueInNullCase = (
  field: string,
  _expression: string
): 0 | 1 => {
  // in case we get null/undefined we will have this construction as example : 1+null*undefined
  // to avoid this we check which operator is setted in front or back of the nullish value
  // in case of "+" or "-" we replace with "0", in case of "*" or "/" we replace with "1"
  if (
    _expression.includes(`{{${field}}}+`) ||
    _expression.includes(`+{{${field}}}`) ||
    _expression.includes(`{{${field}}}-`) ||
    _expression.includes(`-{{${field}}}`)
  ) {
    return 0;
  }

  if (
    _expression.includes(`{{${field}}}*`) ||
    _expression.includes(`*{{${field}}}`) ||
    _expression.includes(`{{${field}}}/`) ||
    _expression.includes(`/{{${field}}}`)
  ) {
    return 1;
  }

  return 0;
};

const setCalculatedListeners = (
  _fields: string[],
  form: HTMLElement,
  values: string[],
  result: string,
  _expression: string,
  calculatedField: HTMLElement,
  inputValue: HTMLInputElement | null,
  Formula: typeof _Formula
) => {
  _fields.forEach((field, i) => {
    const input = form.querySelector<HTMLInputElement>(
      `[${makeAttr("label")}='${field}']`
    );

    const type = input?.type;

    if (input && type) {
      switch (type) {
        case "number": {
          calculateFieldValue(
            i,
            input.value,
            values,
            result,
            _expression,
            _fields,
            calculatedField,
            inputValue,
            Formula
          );
          input.addEventListener("input", () => {
            calculateFieldValue(
              i,
              input.value,
              values,
              result,
              _expression,
              _fields,
              calculatedField,
              inputValue,
              Formula
            );
          });

          break;
        }
        case "radio": {
          const radios = form.querySelectorAll<HTMLInputElement>(
            `input[type='radio'][${makeAttr("label")}='${field}']`
          );

          radios.forEach((radio) => {
            if (radio.checked) {
              calculateFieldValue(
                i,
                radio.value,
                values,
                result,
                _expression,
                _fields,
                calculatedField,
                inputValue,
                Formula
              );
            }
            radio.addEventListener("change", () => {
              if (radio.checked) {
                calculateFieldValue(
                  i,
                  radio.value,
                  values,
                  result,
                  _expression,
                  _fields,
                  calculatedField,
                  inputValue,
                  Formula
                );
              }
            });
          });
          break;
        }
        case "checkbox": {
          const checkboxes = form.querySelectorAll<HTMLInputElement>(
            `input[type='checkbox'][${makeAttr("label")}='${field}']`
          );

          let total = 0;
          checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
              if (checkbox.checked) {
                total += Num.read(checkbox.value) ?? 0;
              } else {
                total -= Num.read(checkbox.value) ?? 0;
              }

              if (total < 0) total = 0;
              calculateFieldValue(
                i,
                String(total),
                values,
                result,
                _expression,
                _fields,
                calculatedField,
                inputValue,
                Formula
              );
            });
          });
          break;
        }
        case "select-one": {
          $(input).on("change", (e) => {
            const value = e.target.value;
            calculateFieldValue(
              i,
              value,
              values,
              result,
              _expression,
              _fields,
              calculatedField,
              inputValue,
              Formula
            );
          });
          break;
        }
      }
    }
  });
};

const calculateFieldValue = (
  i: number,
  value: string,
  values: string[],
  result: string,
  _expression: string,
  _fields: string[],
  calculatedField: HTMLElement,
  inputValue: HTMLInputElement | null,
  Formula: typeof _Formula
) => {
  values[i] = value;
  result = _expression;

  _fields.forEach((field, i) => {
    result = getCalculatedValue(values[i], field, result, getValueInNullCase);
  });

  if (result && calculatedField) {
    // Get the calculated container for class management
    const calculatedContainer = calculatedField.closest(
      ".brz-forms2__calculated"
    );

    try {
      const formula = new Formula(result, { memoization: true });
      const _result = formula.evaluate({});

      const value = _result === Infinity ? "0" : (Str.read(_result) ?? "0");

      calculatedField.innerText = value;

      // Remove invalid class if formula is now valid
      if (calculatedContainer) {
        calculatedContainer.classList.remove("brz-forms2__calculated--invalid");
      }

      if (inputValue) {
        inputValue.value = value;
      }
    } catch (error) {
      // If formula is invalid, show error message and add invalid class
      calculatedField.innerText = "Invalid formula";

      // Add invalid class to the calculated field container
      if (calculatedContainer) {
        calculatedContainer.classList.add("brz-forms2__calculated--invalid");
      }
    }
  } else {
    if (calculatedField) {
      calculatedField.innerText = "0";
    }
    if (inputValue) {
      inputValue.value = "0";
    }
  }
};
