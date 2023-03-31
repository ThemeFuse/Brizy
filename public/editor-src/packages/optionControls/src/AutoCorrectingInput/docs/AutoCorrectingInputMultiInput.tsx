import { useArgs } from "@storybook/client-api";
import { ComponentStory } from "@storybook/react";
import React from "react";
import "../style/index.scss";
import {
   AutoCorrectingInputMultiInput
} from "../variants";

export default {
  title: "Component/AutoCorrectingInput/MultiInput",
  component: AutoCorrectingInputMultiInput,
  parameters: {
    backgrounds: { default: "dark" },
  },
};

const MultiInputTemplate: ComponentStory<typeof AutoCorrectingInputMultiInput> = (
  args
) => {
  const [_, updateArgs] = useArgs();
  const onChange = (v: number) => updateArgs({ ...args, value: v });

  return <AutoCorrectingInputMultiInput {...args} onChange={onChange} />;
};

export const MultiInput: ComponentStory<typeof AutoCorrectingInputMultiInput> =
  MultiInputTemplate.bind({});
MultiInput.args = {
  className: "custom-multi-input-class",
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  size: 100,
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  onTextChange: () => {}
};
