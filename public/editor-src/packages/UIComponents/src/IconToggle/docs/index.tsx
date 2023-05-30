import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Literal } from "../../types/literal";
import { IconToggle } from "../index";
import "../style/index.scss";
import { children } from "../utils/IconToggleChildren";

export default {
  title: "Images and icons/IconToggle",
  component: IconToggle,
  args: {
    children
  },
  argTypes: {
    value: {
      type: "string"
    }
  }
} as ComponentMeta<typeof IconToggle<Literal>>;

const Template: ComponentStory<typeof IconToggle<Literal>> = (args) => {
  const [_, updateArgs] = useArgs();

  const onChange = (value: Literal) => updateArgs({ ...args, value });

  return <IconToggle<Literal> {...args} onChange={onChange} />;
};

export const Primary: ComponentStory<typeof IconToggle<Literal>> =
  Template.bind({});

Primary.args = {
  className: "brz-ed-option__toggle",
  value: "center"
};
