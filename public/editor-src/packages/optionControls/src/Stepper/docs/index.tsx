import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Stepper as Control } from "../index";
import "../style/index.scss";

export default {
  title: "Component/Stepper",
  component: Control,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof Control>;

const Template: ComponentStory<typeof Control> = (args) => {
  const [{ value }, updateArgs] = useArgs();

  const onChange = (value: number) => updateArgs({ ...args, value });

  return <Control {...args} value={value} onChange={onChange} />;
};

export const Stepper: ComponentStory<typeof Control> = Template.bind({});
Stepper.args = {
  className: "",
  min: 0,
  max: 100,
  step: 1,
  value: 0,
  onChange: () => {}
};
