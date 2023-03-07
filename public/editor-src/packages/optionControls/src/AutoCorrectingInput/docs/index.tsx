import { useArgs } from "@storybook/client-api";
import { ComponentStory } from "@storybook/react";
import React from "react";
import { AutoCorrectingInput as Control } from "../index";
import "../style/index.scss";

export default {
  title: "Component/AutoCorrectingInput",
  component: Control
};

const Template: ComponentStory<typeof Control> = (args) => {
  const [_, updateArgs] = useArgs();
  const onChange = (v: number) => updateArgs({ ...args, value: v });

  return <Control {...args} onChange={onChange} />;
};

export const AutoCorrectingInput: ComponentStory<typeof Control> =
  Template.bind({});
AutoCorrectingInput.args = {
  className: "brz-input",
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
