import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Close } from "../Icons/Close";

export default {
  title: "Component/Icon",
  component: Close,
  parameters: {
    layout: "fullscreen"
  }
} as ComponentMeta<typeof Close>;

const IconTemplate: ComponentStory<typeof Close> = (args) => (
  <Close {...args} />
);

const styles = {
  fontSize: "22px",
  color: "red",
  padding: "20px"
};

export const Icon = IconTemplate.bind({});
Icon.args = {
  className: "brz-custom-class",
  onClick: () => alert("onClick"),
  style: styles
};
