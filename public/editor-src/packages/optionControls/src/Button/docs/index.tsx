import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { IconsName } from "../../EditorIcon/types";
import { Button } from "../index";
import "../style/index.scss";

export default {
  title: "Component/Button",
  component: Button,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary: ComponentStory<typeof Button> = Template.bind({});
Primary.args = {
  className: "",
  onClick: () => {},
  icon: IconsName["t2-event-calendar"],
  children: "Text",
  reverse: true,
  reverseTheme: true,
  align: "center"
};

export const Secondary: ComponentStory<typeof Button> = Template.bind({});
Secondary.args = {
  className: "",
  onClick: () => {},
  icon: IconsName.Duplicate,
  children: "",
  reverse: false,
  reverseTheme: false,
  align: "center"
};
