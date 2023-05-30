import { useArgs } from "@storybook/client-api";
import { ComponentStory } from "@storybook/react";
import React from "react";
import { AutoCorrectingInput as Control } from "../";
import "../style/index.scss";

export default {
  title: "Selection and Input/AutoCorrectingInput",
  component: Control,
  parameters: {
    backgrounds: { default: "dark" }
  }
};

const Template: ComponentStory<typeof Control> = (args) => {
  const [_, updateArgs] = useArgs();
  const onChange = (v: number) => updateArgs({ ...args, value: v });

  return <Control {...args} onChange={onChange} />;
};

export const Simple: ComponentStory<typeof Control> = Template.bind({});
Simple.args = {
  className: "",
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
