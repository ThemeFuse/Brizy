import { useArgs } from "@storybook/client-api";
import { ComponentStory } from "@storybook/react";
import React from "react";
import "../style/index.scss";
import { AutoCorrectingInputBackgroundColor } from "../variants";

export default {
  title: "Selection and Input/AutoCorrectingInput/BackgroundColor",
  component: AutoCorrectingInputBackgroundColor,
  parameters: {
    backgrounds: { default: "dark" }
  }
};

const BackgroundColorTemplate: ComponentStory<
  typeof AutoCorrectingInputBackgroundColor
> = (args) => {
  const [_, updateArgs] = useArgs();
  const onChange = (v: number) => updateArgs({ ...args, value: v });

  return <AutoCorrectingInputBackgroundColor {...args} onChange={onChange} />;
};
export const BackgroundColor: ComponentStory<
  typeof AutoCorrectingInputBackgroundColor
> = BackgroundColorTemplate.bind({});
BackgroundColor.args = {
  className: "custom-background-color-class",
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  size: 100,
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  onTextChange: () => {}
};
