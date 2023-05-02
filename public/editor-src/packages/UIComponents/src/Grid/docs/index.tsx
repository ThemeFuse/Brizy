import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Button } from "../../Button";
import { IconsName } from "../../EditorIcon/types";
import { Column } from "../Column";
import { Grid as GridControl } from "../index";
import "../style/index.scss";

export default {
  title: "Layout and structure/Grid",
  component: GridControl,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof GridControl>;

const Template: ComponentStory<typeof GridControl> = (args) => (
  <div style={{ height: "50px" }}>
    <GridControl {...args} />
  </div>
);

export const Grid: ComponentStory<typeof GridControl> = Template.bind({});
Grid.args = {
  className: "grid-control-test",
  grid: [1, 1, 1],
  showSeparator: false,
  children: [
    <Column key={0} align="start">
      Column with text align start
    </Column>,
    <Column key={1} align="center">
      Column with text align center
    </Column>,
    <Column key={2} align="end">
      <Button
        onClick={() => {}}
        align="right"
        icon={IconsName.Duplicate}
        reverse={false}
      >
        Text
      </Button>
    </Column>
  ]
};
