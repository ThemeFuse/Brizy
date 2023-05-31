import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { FontFamily } from "..";
import { fonts } from "../mock/fonts";
import "../style/index.scss";
import { FontWithType } from "../types";

export default {
  title: "Typography/FontFamily",
  component: FontFamily
} as ComponentMeta<typeof FontFamily>;

const Template: ComponentStory<typeof FontFamily> = (args) => {
  const [_, updateArgs] = useArgs();

  const onChange = (value: FontWithType) =>
    updateArgs({ ...args, value: value.id });

  const addFont = () => {
    alert("Add font prompt");
  };

  return (
    <div
      style={{
        backgroundColor: "#151a21",
        borderRadius: "10px",
        width: "180px"
      }}
    >
      <FontFamily {...args} onChange={onChange} addFont={addFont} />
    </div>
  );
};

export const Primary: ComponentStory<typeof FontFamily> = Template.bind({});
Primary.args = {
  addFont: () => {},
  addFontLabel: "Add New Font",
  fonts,
  value: "overpass",
  className: ""
};
