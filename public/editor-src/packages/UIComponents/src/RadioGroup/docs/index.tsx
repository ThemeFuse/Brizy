import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { IconsName } from "../../EditorIcon/types";
import { Item } from "../Item/Item";
import { RadioGroup } from "../index";
import "../style/index.scss";

export default {
  title: "Selection and Input/RadioGroup",
  component: RadioGroup,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof RadioGroup>;

const Template: ComponentStory<typeof RadioGroup> = (args) => {
  const [_, updateArgs] = useArgs();

  const onChange = (value: string) => {
    updateArgs({ ...args, value });
  };

  return <RadioGroup {...args} onChange={onChange} />;
};

export const Primary: ComponentStory<typeof RadioGroup> = Template.bind({});
Primary.args = {
  className: "",
  onChange: () => {},
  value: "image",
  children: [
    <Item icon={IconsName.MediaImage} value="image" />,
    <Item icon={IconsName.MediaMap} value="map" />,
    <Item icon={IconsName.MediaVideo} value="video" />
  ]
};
