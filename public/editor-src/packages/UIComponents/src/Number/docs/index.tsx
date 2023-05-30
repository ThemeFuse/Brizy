import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React, { useCallback } from "react";
import { Number } from "../index";
import "../style/index.scss";

export default {
  title: "Selection and Input/Number",
  component: Number,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof Number>;

const Template: ComponentStory<typeof Number> = ({
  showArrows,
  className,
  size
}) => {
  const [{ value }, updateArgs] = useArgs();

  const handleDecrease = useCallback(
    () => updateArgs({ value: value ? value - 1 : -1 }),
    [value, updateArgs]
  );
  const handleIncrease = useCallback(
    () => updateArgs({ value: value ? value + 1 : 1 }),
    [value, updateArgs]
  );
  const handleChange = useCallback(
    (value) => updateArgs({ value }),
    [updateArgs]
  );

  return (
    <Number
      value={value}
      className={className}
      showArrows={showArrows}
      size={size}
      onDecrease={handleDecrease}
      onIncrease={handleIncrease}
      onChange={handleChange}
    />
  );
};

export const Primary: ComponentStory<typeof Number> = Template.bind({});
Primary.args = {
  value: 0,
  className: "",
  showArrows: false
};

export const Secondary: ComponentStory<typeof Number> = Template.bind({});
Secondary.args = {
  value: undefined,
  className: "",
  size: "large"
};

export const Tertiary: ComponentStory<typeof Number> = Template.bind({});
Tertiary.args = {
  value: -1,
  className: "",
  size: "medium"
};

export const Quaternary: ComponentStory<typeof Number> = Template.bind({});
Quaternary.args = {
  value: 1,
  className: "",
  size: "short"
};
