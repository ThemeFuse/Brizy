import { OptionStyle } from "visual/utils/cssStyle/types";

export const successMessageSelector =
  "{{WRAPPER}} .brz-forms2__alert--success .brz-forms2__alert-text";
export const successMessageContainerSelector =
  "{{WRAPPER}} .brz-forms2__alert--success";
export const errorMessageSelector =
  "{{WRAPPER}} .brz-forms2__alert--error .brz-forms2__alert-text";
export const errorMessageContainerSelector =
  "{{WRAPPER}} .brz-forms2__alert--error";
export const emptyMessageSelector =
  "{{WRAPPER}} .brz-forms2__alert--empty .brz-forms2__alert-text";
export const emptyMessageContainerSelector =
  "{{WRAPPER}} .brz-forms2__alert--empty";
export const invalidMessageSelector =
  "{{WRAPPER}} .brz-forms2__alert--invalid .brz-forms2__alert-text";
export const invalidMessageContainerSelector =
  "{{WRAPPER}} .brz-forms2__alert--invalid";
export const invalidEmailMessageSelector =
  "{{WRAPPER}} .brz-forms2__alert--invalid-email .brz-forms2__alert-text";
export const invalidEmailMessageContainerSelector =
  "{{WRAPPER}} .brz-forms2__alert--invalid-email";

export const getTextAlignCSSFn =
  (selector: string): OptionStyle<"toggle"> =>
  ({ value: { value } }) => ({
    [selector]: {
      "text-align": value
    }
  });

export const getFlexAlignCSSFn =
  (selector: string): OptionStyle<"toggle"> =>
  ({ value: { value } }) => {
    let align = "flex-start";

    switch (value) {
      case "center":
        align = "center";
        break;
      case "right":
        align = "flex-end";
        break;
    }

    return {
      [selector]: {
        "justify-content": align
      }
    };
  };

export const getWidthCSSFn =
  (selector: string): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) => ({
    [selector]: {
      width: `${value}${unit}`
    }
  });
