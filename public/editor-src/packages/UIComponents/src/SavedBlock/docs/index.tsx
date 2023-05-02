import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { SavedBlock } from "..";
import { IconsName } from "../../EditorIcon/types";
import "../style/index.scss";

export default {
  title: "Action/SavedBlock",
  component: SavedBlock,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof SavedBlock>;

const Template: ComponentStory<typeof SavedBlock> = (args) => {
  const [_, updateArgs] = useArgs();

  const onClick = () => {
    updateArgs({ ...args, isLoading: true });
    setTimeout(() => {
      updateArgs({ ...args, isLoading: false });
    }, 1000);
  };

  return <SavedBlock {...args} onClick={onClick} />;
};

export const Primary: ComponentStory<typeof SavedBlock> = Template.bind({});
Primary.args = {
  className: "",
  isLoading: false,
  onClick: () => {},
  icon: IconsName.Heart,
  tooltipContent: "Saved",
  title: "Save"
};
