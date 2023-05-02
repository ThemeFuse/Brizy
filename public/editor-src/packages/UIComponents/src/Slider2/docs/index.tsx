import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Slider2 } from "../index";
import "../style/index.scss";

export default {
  title: "Selection and Input/Slider2",
  component: Slider2,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof Slider2>;

const Template: ComponentStory<typeof Slider2> = (args) => {
  const [_, updateArgs] = useArgs();

  const onChange = (value: number) => updateArgs({ ...args, value });
  return <Slider2 {...args} onChange={onChange} />;
};

export const Primary: ComponentStory<typeof Slider2> = Template.bind({});
Primary.args = {
  className: "",
  value: 50,
  step: 10,
  min: 0,
  max: 100
};
