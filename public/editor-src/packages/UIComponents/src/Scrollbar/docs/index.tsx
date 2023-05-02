import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Scrollbar } from "..";
import { children } from "../mock/children";
import "../style/index.scss";

export default {
  title: "Components/Scrollbar",
  component: Scrollbar,
  args: {
    children
  }
} as ComponentMeta<typeof Scrollbar>;

const Template: ComponentStory<typeof Scrollbar> = (args) => {
  const [{ theme }, _] = useArgs();

  const style = {
    borderRadius: "10px",
    width: "180px",
    backgroundColor: theme === "dark" ? "#151a21" : "#a6a6a6",
    color: theme === "dark" ? "#ffffff" : "#000000"
  };

  return (
    <div style={style} className="brz-ed-font__typography">
      <Scrollbar {...args} />
    </div>
  );
};

export const Dark: ComponentStory<typeof Scrollbar> = Template.bind({});
Dark.args = {
  theme: "dark"
};

export const Light: ComponentStory<typeof Scrollbar> = Template.bind({});
Light.args = {
  theme: "light"
};
