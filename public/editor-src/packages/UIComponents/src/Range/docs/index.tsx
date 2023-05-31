import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import classNames from "classnames";
import { Handle } from "rc-slider";
import React, { ReactNode } from "react";
import { Range as Control } from "../index";
import "../style/index.scss";
import { HandleProps } from "../types";

export default {
  title: "Selection and Input/Range",
  component: Control,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof Control>;

const Template: ComponentStory<typeof Control> = (args) => {
  const [{ startPointer, finishPointer, active = "start" }, updateArgs] =
    useArgs();

  const onStartChange = (startPointer: number): void => {
    updateArgs({ ...args, startPointer });
  };

  const onEndChange = (finishPointer: number): void => {
    updateArgs({ ...args, finishPointer });
  };

  const onChange = (v: number[]): void => {
    const c = v[0] === args.startPointer ? onEndChange : onStartChange;
    const _v: number = v[0] === args.startPointer ? v[1] : v[0];
    c(_v);
  };

  // only for custom classnames for handles when one of them is active
  const onActiveChange = (active: string): void => {
    updateArgs({ ...args, active });
  };

  // for custom classname when one of the handles is active
  const handle = (props: HandleProps): ReactNode => {
    const { className, index, dragging, ...other } = props;
    const _active = index === 0 ? "start" : "end";
    const _className = classNames("brz-ed-rc-slider-handle", className, {
      "brz-ed-rc-slider-handle--active":
        (index === 0 && active === "start") || (index === 1 && active === "end")
    });

    return (
      <Handle
        {...other}
        key={index}
        className={_className}
        // @ts-expect-error: missing props onMouseDown in ts
        onMouseDown={(): void => onActiveChange(_active)}
      />
    );
  };

  return (
    <Control
      {...args}
      onChange={onChange}
      startPointer={startPointer}
      finishPointer={finishPointer}
      step={args.step}
      handle={handle}
      min={args.min}
      max={args.max}
      railStyle={args.railStyle}
      className={args.className}
    />
  );
};

export const Range: ComponentStory<typeof Control> = Template.bind({});
Range.args = {
  className: "",
  startPointer: 0,
  finishPointer: 100,
  railStyle: {
    backgroundImage: `linear-gradient(to right, #ebdb34, #3aeb34)`
  }
};
