import React from "react";
import { Icons } from "./Icons";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Component/Icons",
  component: Icons,
  parameters: {
    layout: "fullscreen"
  }
} as ComponentMeta<typeof Icons>;

const Template: ComponentStory<typeof Icons> = () => <Icons />;

export const Default = Template.bind({});
