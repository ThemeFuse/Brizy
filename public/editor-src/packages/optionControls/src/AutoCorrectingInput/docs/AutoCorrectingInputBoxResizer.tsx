import { useArgs } from "@storybook/client-api";
import { ComponentStory } from "@storybook/react";
import React from "react";
import "../style/index.scss";
import {
  AutoCorrectingInputBoxResizer
} from "../variants";

export default {
  title: "Component/AutoCorrectingInput/BoxResizer",
  component: AutoCorrectingInputBoxResizer,
  parameters: {
    backgrounds: { default: "dark" },
  },
};

const BoxResizerTemplate: ComponentStory<
  typeof AutoCorrectingInputBoxResizer
> = (args) => {
  const [_, updateArgs] = useArgs();
  const onChange = (v: number) => updateArgs({ ...args, value: v });

  return (
    <div style={{ position: "relative", minHeight: "20px" }}>
      <AutoCorrectingInputBoxResizer {...args} onChange={onChange} />
    </div>
  );
};
export const BoxResizer: ComponentStory<typeof AutoCorrectingInputBoxResizer> =
  BoxResizerTemplate.bind({});
BoxResizer.args = {
  className: "custom-box-resizer-class",
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
