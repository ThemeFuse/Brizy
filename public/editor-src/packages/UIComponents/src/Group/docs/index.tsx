import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { MockData } from "../data";
import { Group as Control } from "../index";
import "../style/index.scss";

export default {
  title: "Layout and structure/Group",
  component: Control
} as ComponentMeta<typeof Control>;

const Template: ComponentStory<typeof Control> = (args) => (
  <Control {...args} />
);

export const Group: ComponentStory<typeof Control> = Template.bind({});
Group.args = {
  className: "custom-classname",
  children: MockData
};
