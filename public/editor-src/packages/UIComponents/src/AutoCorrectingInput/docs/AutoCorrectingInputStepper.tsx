import { useArgs } from "@storybook/client-api";
import { ComponentStory } from "@storybook/react";
import React from "react";
import "../style/index.scss";
import { AutoCorrectingInputStepper } from "../variants";

export default {
  title: "Selection and Input/AutoCorrectingInput/Stepper",
  component: AutoCorrectingInputStepper,
  parameters: {
    backgrounds: { default: "dark" }
  }
};

const StepperTemplate: ComponentStory<typeof AutoCorrectingInputStepper> = (
  args
) => {
  const [_, updateArgs] = useArgs();
  const onChange = (v: number) => updateArgs({ ...args, value: v });

  return <AutoCorrectingInputStepper {...args} onChange={onChange} />;
};

export const Stepper: ComponentStory<typeof AutoCorrectingInputStepper> =
  StepperTemplate.bind({});
Stepper.args = {
  className: "custom-stepper-class",
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
  onTextChange: () => {},
  stepperSize: "small"
};
