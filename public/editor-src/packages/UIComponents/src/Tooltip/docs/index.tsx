import { ComponentMeta, ComponentStory } from "@storybook/react";
import React, { CSSProperties, ReactElement } from "react";
import { noop } from "underscore";
import { Button } from "../../Button/index";
import "../../Button/style/index.scss";
import { Tooltip, TooltipItem } from "../index";
import "../style/index.scss";
import { Props } from "../types";

const defaultStyles: CSSProperties = { padding: "150px" };

export default {
  title: "Layout and structure/Tooltip",
  component: Tooltip,
  parameters: {
    backgrounds: { default: "dark" }
  },
  decorators: [
    (Story) => (
      <div style={defaultStyles}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof Tooltip>;

const TooltipComponent = (props: Props): ReactElement => (
  <Tooltip {...props}>
    <Button onClick={noop}>
      {props.showOnClick ? "Click" : "Hover"} To Open Tooltip
    </Button>
  </Tooltip>
);

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <TooltipComponent {...args} />
);

const exceptionStyle: CSSProperties = { color: "#3dbfe8", textAlign: "center" };

const TemplateWithExceptions: ComponentStory<typeof Tooltip> = (args) => (
  <>
    <TooltipComponent {...args} />
    <br />
    <div className="excepion" style={exceptionStyle}>
      If you click here tooltip will not be closed
    </div>
  </>
);

export const TooltipXLargeAndTop: ComponentStory<typeof Tooltip> =
  Template.bind({});
TooltipXLargeAndTop.args = {
  overlay: [<TooltipItem key={1}>Tooltip xlarge</TooltipItem>],
  showArrow: true,
  placement: "top",
  closeDelay: 0,
  offset: 30,
  size: "xlarge",
  title: "title"
};

export const TooltipClickAndLargeBottom: ComponentStory<typeof Tooltip> =
  Template.bind({});
TooltipClickAndLargeBottom.args = {
  overlay: [
    <TooltipItem key={1}>Tooltip Large</TooltipItem>,
    <TooltipItem key={2}>Tooltip 2</TooltipItem>
  ],
  showArrow: true,
  placement: "bottom",
  showOnClick: true,
  closeDelay: 1000,
  size: "large"
};

export const TooltipWithOffsetAndLeft: ComponentStory<typeof Tooltip> =
  Template.bind({});
TooltipWithOffsetAndLeft.args = {
  overlay: [<TooltipItem key={1}>Tooltip With Offset</TooltipItem>],
  placement: "left",
  offset: 15,
  showArrow: true
};

export const TooltipMediumAndRight: ComponentStory<typeof Tooltip> =
  Template.bind({});
TooltipMediumAndRight.args = {
  overlay: [<TooltipItem key={1}>Tooltip Medium</TooltipItem>],
  placement: "right",
  size: "medium",
  showArrow: true
};

export const TooltipSmallAndTopStart: ComponentStory<typeof Tooltip> =
  Template.bind({});
TooltipSmallAndTopStart.args = {
  overlay: [<TooltipItem key={1}>Tooltip Small</TooltipItem>],
  placement: "top-start",
  size: "small",
  showArrow: true
};

export const TooltipWithExceptions: ComponentStory<typeof Tooltip> =
  TemplateWithExceptions.bind({});
TooltipWithExceptions.args = {
  overlay: [<TooltipItem key={1}>Tooltip auto</TooltipItem>],
  clickOutsideExceptions: [".excepion"],
  size: "auto",
  showOnClick: true
};
