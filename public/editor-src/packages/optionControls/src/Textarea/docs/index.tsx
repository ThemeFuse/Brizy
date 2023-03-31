import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { useArgs } from "@storybook/client-api";
import { Textarea as Control } from "../index";
import "../styles/styles.scss";

export default {
  title: "Component/Textarea",
  component: Control
} as ComponentMeta<typeof Control>;

const Template: ComponentStory<typeof Control> = (args) => {
  const [_, updateArgs] = useArgs();
  const onChange = (value: string) => updateArgs({...args, value});

  return <Control {...args} onChange={onChange} />;
};

export const Textarea: ComponentStory<typeof Control> = Template.bind({});
Textarea.args = {
  size: "auto",
  value: "",
  placeholder: "placeholder"
};
