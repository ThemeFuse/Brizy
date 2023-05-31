import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Popover as Control } from "../index";
import { CheckCircle } from "./../../../../icons/src/Icons/CheckCircle";

export default {
  title: "Layout and structure/Popover/PopoverWithException",
  component: Control,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof Control>;

const TemplateWithException: ComponentStory<typeof Control> = (args) => (
  <div style={{ padding: "50px" }}>
    <Control {...args} />
    <div className="exception" style={{ textAlign: "center", color: "white" }}>
      If you click here tooltip won't close.
    </div>
  </div>
);

export const PopoverWithException: ComponentStory<typeof Control> =
  TemplateWithException.bind({});
PopoverWithException.args = {
  className: "",
  size: "small",
  placement: "top",
  trigger: <CheckCircle />,
  children: <div style={{ padding: "5px", color: "white" }}>Children</div>,
  title: "checkbox",
  clickOutsideExceptions: [".exception"]
};
