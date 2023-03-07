import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { EditorIcon } from "..";
import { IconsName } from "../../EditorIcon/types";
import "../style/index.scss";

export default {
  title: "Component/EditorIcon",
  component: EditorIcon
} as ComponentMeta<typeof EditorIcon>;

const Template: ComponentStory<typeof EditorIcon> = (args) => (
  <EditorIcon {...args} />
);

export const Primary: ComponentStory<typeof EditorIcon> = Template.bind({});
Primary.args = {
  icon: IconsName.Duplicate
};

export const MinistryBrand: ComponentStory<typeof EditorIcon> = Template.bind(
  {}
);
MinistryBrand.args = {
  icon: IconsName["t2-event-calendar"],
  style: { color: "green" }
};
