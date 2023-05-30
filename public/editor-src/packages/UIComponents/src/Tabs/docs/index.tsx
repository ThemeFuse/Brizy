import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Tabs } from "../index";
import "../style/index.scss";
import {
  tabChildrenMap,
  tabChildrenSide,
  tabChildrenSingle,
  tabChildrenTop
} from "../utils/TabChilren";

export default {
  title: "Layout and structure/Tabs",
  component: Tabs,
  parameters: {
    backgrounds: { default: "dark" }
  },
  argTypes: {
    value: {
      type: "string"
    }
  }
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs<string>> = (args) => {
  const [_, updateArgs] = useArgs();

  const onChange = (value: string) => updateArgs({ ...args, value });

  return <Tabs<string> {...args} onChange={onChange} />;
};

export const TabTop: ComponentStory<typeof Tabs<string>> = Template.bind({});
TabTop.args = {
  align: "center",
  position: "top",
  showSingle: false,
  value: "currentShortcodeTab",
  children: tabChildrenMap(tabChildrenTop)
};

export const TabLeft: ComponentStory<typeof Tabs<string>> = Template.bind({});
TabLeft.args = {
  align: "center",
  position: "left",
  showSingle: false,
  value: "currentShortcodeTab",
  children: tabChildrenMap(tabChildrenSide)
};

export const TabSingle: ComponentStory<typeof Tabs<string>> = Template.bind({});
TabSingle.args = {
  align: "center",
  position: "top",
  showSingle: false,
  value: "currentShortcodeTab",
  children: tabChildrenMap(tabChildrenSingle)
};
