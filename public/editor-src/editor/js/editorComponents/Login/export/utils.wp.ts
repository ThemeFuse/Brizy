import { clearAlerts, ElementType, getValidateInputs } from "./utils.common";

const getRequiredInputsSelector = (elementType: ElementType): string => {
  switch (elementType) {
    case ElementType.login:
      return "input[name='log'], input[name='pwd']";
    case ElementType.register:
      return "";
    case ElementType.forgot:
      return "";
    case ElementType.authorized:
      return "";
  }
};

export const getInputs = (
  elementType: ElementType,
  form: HTMLFormElement
): NodeListOf<HTMLInputElement> => {
  const inputsSelector = getRequiredInputsSelector(elementType);

  return form.querySelectorAll<HTMLInputElement>(inputsSelector);
};

export const validateInputs = (
  elementType: ElementType,
  form: HTMLFormElement,
  errorMessages: Record<string, string>
): { success: boolean; messages: string[] } => {
  clearAlerts(form);

  const inputs = getInputs(elementType, form);

  switch (elementType) {
    case ElementType.login:
      return getValidateInputs(inputs, errorMessages);

    case ElementType.register:
    case ElementType.forgot:
    case ElementType.authorized:
      return { success: true, messages: [] };
  }
};

export const getData = (
  elementType: ElementType.login,
  form: HTMLFormElement
): string => {
  switch (elementType) {
    case ElementType.login: {
      const formData = new FormData(form);
      formData.set("isEditorLogin", "1");
      formData.set("redirect_to", "/");

      return (
        // @ts-expect-error need to serialize form data
        new URLSearchParams(formData).toString()
      );
    }
  }
};
