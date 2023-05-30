import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { InputHex } from "../../InputHex";
import "../style/index.scss";

export default {
  title: "Selection and Input/InputHex",
  component: InputHex,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof InputHex>;

const Template: ComponentStory<typeof InputHex> = (args) => {
  const [_, updateArgs] = useArgs();
  const onChange = (value: string) => updateArgs({ ...args, value });

  return <InputHex {...args} onChange={onChange} />;
};

export const Default: ComponentStory<typeof InputHex> = Template.bind({});
Default.args = {
  value: "#ffffff",
  className: ""
};
