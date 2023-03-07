import { useArgs } from "@storybook/client-api";
import { Meta, Story } from "@storybook/react";
import React from "react";
import _ from "underscore";
import { Hex } from "../../types/Hex";
import { ColorPalette } from "../index";
import "../style/index.scss";
import { Props } from "../types";

export default {
  title: "Component/ColorPalette",
  component: ColorPalette,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as Meta;

const Template: Story<Props<string>> = (args) => {
  const [_, updateArgs] = useArgs();

  const onChange = (value: string) => updateArgs({ ...args, value });

  return <ColorPalette {...args} onChange={onChange} />;
};

export const Primary = Template.bind({});
Primary.args = {
  palette: [
    { id: "c1", hex: "#A170D9" as Hex },
    { id: "c2", hex: "#1C1C1C" as Hex },
    { id: "c3", hex: "#05CAB6" as Hex },
    { id: "c4", hex: "#B8E6E1" as Hex },
    { id: "c5", hex: "#F5D4D1" as Hex }
  ],
  value: "c2",
  openSettings: _.noop,
  className: ""
};
