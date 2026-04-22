import { OptionStyle } from "visual/utils/cssStyle/types";

const size = {
  small: "16px",
  medium: "24px",
  large: "32px"
};

export const contentAlignCss: OptionStyle<"toggle"> = ({
  value: { value }
}) => ({
  "{{WRAPPER}}.brz-pinterest, {{WRAPPER}} .brz-ed-pinterest--content": {
    "justify-content": value
  }
});

export const buttonSizeCss: OptionStyle<"radioGroup"> = ({
  value: { value }
}) => ({
  "{{WRAPPER}}.brz-pinterest--followButton span[data-pin-log='button_follow']":
    {
      padding: size[value as keyof typeof size]
    }
});
