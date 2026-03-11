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

    if (expression) {
      const decodedExpression = decodeFromString<string>(expression);

      // Extract original field names BEFORE removing spaces
      // This preserves field names with spaces like "Number one"
      const originalFields: string[] = [];
      const fieldNameRegex = /\{\{([^}]+)\}\}/g;
      let match;
      while ((match = fieldNameRegex.exec(decodedExpression)) !== null) {
        originalFields.push(match[1].trim());
      }

      // Create mapping from normalized (no spaces) to original field names
      const fieldMapping = new Map<string, string>();
      originalFields.forEach((originalField) => {
        const normalizedField = originalField.replace(/\s+/g, "");
        fieldMapping.set(normalizedField, originalField);
      });

      // Normalize expression for formula parsing (remove spaces)
      const _expression = decodedExpression.replace(/\s+/g, "");

      if (_expression) {
        const operators = ["+", "-", "*", "/"];

        // Extract normalized field names from "{{ }}"
        const _fields = _expression
          .replace(/[()]/g, "")
          .split(/\{{([^}}]+)\}}/)
          .filter((item) => !operators.includes(item) && item.length);

        const values: string[] = [];
        const result = "";

        if (form) {
          setCalculatedListeners(
            _fields,
            fieldMapping,
            form,
            values,
            result,
            _expression,
            calculatedField,
            inputValue,
            Formula
          );
        }
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
  fieldMapping: Map<string, string>,
  form: HTMLElement,
  values: string[],
  result: string,
  _expression: string,
  calculatedField: HTMLElement,
  inputValue: HTMLInputElement | null,
  Formula: typeof _Formula
) => {
  _fields.forEach((field, i) => {
    // Use original field name (with spaces) for querying form fields
    const originalField = fieldMapping.get(field) || field;
    const input = form.querySelector<HTMLInputElement>(
      `[${makeAttr("label")}='${originalField}']`
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
            `input[type='radio'][${makeAttr("label")}='${originalField}']`
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
            `input[type='checkbox'][${makeAttr("label")}='${originalField}']`
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
    } catch (e) {
      console.error(e);
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
