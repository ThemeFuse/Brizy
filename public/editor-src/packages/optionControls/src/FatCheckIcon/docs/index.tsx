import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React, { useCallback } from "react";
import { IconsName } from "../../EditorIcon/types";
import { FatCheckIcon } from "../index";
import "../style/index.scss";

export default {
  title: "Component/FatCheckIcon",
  component: FatCheckIcon,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof FatCheckIcon>;

const Template: ComponentStory<typeof FatCheckIcon> = (args) => {
  const [{ isChecked, isActive }, updateArgs] = useArgs();

  const handleCheck = useCallback(() => {
    updateArgs({ isChecked: !isChecked });
  }, [isChecked, updateArgs]);

  const handleClick = useCallback(() => {
    updateArgs({ isChecked: !isActive, isActive: !isActive });
  }, [isActive, updateArgs]);

  return <FatCheckIcon {...args} onCheck={handleCheck} onClick={handleClick} />;
};

export const Primary: ComponentStory<typeof FatCheckIcon> = Template.bind({});
Primary.args = {
  className: "",
  icon: IconsName.Duplicate,
  label: "Fat Check Icon"
};

export const Secondary: ComponentStory<typeof FatCheckIcon> = Template.bind({});
Secondary.args = {
  className: "",
  icon: IconsName.Settings,
  label: "Active",
  isActive: true
};

export const Tertiary: ComponentStory<typeof FatCheckIcon> = Template.bind({});
Tertiary.args = {
  className: "",
  icon: IconsName.Settings,
  label: "Checked",
  isChecked: true
};

export const Quaternary: ComponentStory<typeof FatCheckIcon> = Template.bind(
  {}
);
Quaternary.args = {
  className: "",
  icon: IconsName.Settings,
  label: "Checked And Active",
  isChecked: true,
  isActive: true
};
