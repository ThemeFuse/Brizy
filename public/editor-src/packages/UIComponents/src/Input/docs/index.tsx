import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Input } from "../index";
import "../style/index.scss";

export default {
  title: "Selection and Input/Input",
  component: Input,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Default: ComponentStory<typeof Input> = Template.bind({});
Default.args = {
  className: "",
  onChange: () => {},
  onBlur: () => {},
  size: "medium",
  placeholder: "text"
};
