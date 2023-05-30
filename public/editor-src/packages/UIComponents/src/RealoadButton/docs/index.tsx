import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { ReloadButton } from "../index";
import "../style/index.scss";

export default {
  title: "Action/ReloadButton",
  component: ReloadButton,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof ReloadButton>;

const Template: ComponentStory<typeof ReloadButton> = (args) => (
  <ReloadButton {...args} />
);
export const Default: ComponentStory<typeof ReloadButton> = Template.bind({});
Default.args = {
  className: "",
  onClick: () => {},
  children: "Replay Animation"
};
