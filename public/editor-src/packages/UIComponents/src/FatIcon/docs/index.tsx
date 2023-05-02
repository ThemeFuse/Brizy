import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import _ from "underscore";
import { IconsName } from "../../EditorIcon/types";
import { FatIcon } from "../index";
import "../style/index.scss";

export default {
  title: "Images and icons/FatIcon",
  component: FatIcon,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof FatIcon>;

const Template: ComponentStory<typeof FatIcon> = (args) => {
  const [{ isActive }, updateArgs] = useArgs();

  const handleChange = () => updateArgs({ isActive: !isActive });

  return <FatIcon {...args} onClick={handleChange} />;
};

export const Primary: ComponentStory<typeof FatIcon> = Template.bind({});
Primary.args = {
  className: "",
  onClick: _.noop,
  icon: IconsName["t2-event-detail"],
  label: "Active",
  isActive: true
};

export const Secondary: ComponentStory<typeof FatIcon> = Template.bind({});
Secondary.args = {
  className: "",
  onClick: _.noop,
  icon: IconsName["t2-event-calendar"],
  label: "Label"
};
