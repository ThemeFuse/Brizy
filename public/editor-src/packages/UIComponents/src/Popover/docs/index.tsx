import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Popover as Control } from "../index";
import { CheckCircle } from "./../../../../icons/src/Icons/CheckCircle";

export default {
  title: "Layout and structure/Popover",
  component: Control,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof Control>;

const Template: ComponentStory<typeof Control> = (args) => (
  <div style={{ padding: "50px" }}>
    <Control {...args} />
  </div>
);

export const Popover: ComponentStory<typeof Control> = Template.bind({});
Popover.args = {
  className: "",
  size: "small",
  placement: "top",
  trigger: <CheckCircle />,
  children: <div style={{ padding: "5px", color: "white" }}>Children</div>,
  title: "checkbox"
};
