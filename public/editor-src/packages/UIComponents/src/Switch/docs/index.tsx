import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Switch } from "../index";
import "../style/index.scss";

export default {
  title: "Selection and Input/Switch",
  component: Switch
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = (args) => {
  const [_, updateArgs] = useArgs();

  const onChange = (value: boolean) => updateArgs({ ...args, value });

  return <Switch {...args} onChange={onChange} />;
};

export const Default: ComponentStory<typeof Switch> = Template.bind({});
Default.args = {
  className: "",
  theme: "dark",
  value: true
};

export const Light: ComponentStory<typeof Switch> = Template.bind({});
Light.args = {
  className: "",
  theme: "light",
  value: false
};
