import { useArgs } from "@storybook/client-api";
import { ComponentStory } from "@storybook/react";
import React from "react";
import "../style/index.scss";
import { AutoCorrectingInputWidth } from "../variants";

export default {
  title: "Selection and Input/AutoCorrectingInput/Width",
  component: AutoCorrectingInputWidth,
  parameters: {
    backgrounds: { default: "dark" }
  }
};

const WidthTemplate: ComponentStory<typeof AutoCorrectingInputWidth> = (
  args
) => {
  const [_, updateArgs] = useArgs();
  const onChange = (v: number) => updateArgs({ ...args, value: v });

  return <AutoCorrectingInputWidth {...args} onChange={onChange} />;
};

export const Width: ComponentStory<typeof AutoCorrectingInputWidth> =
  WidthTemplate.bind({});
Width.args = {
  className: "custom-width-class",
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
