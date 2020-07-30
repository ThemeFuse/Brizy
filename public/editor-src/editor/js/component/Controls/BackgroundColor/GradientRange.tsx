import React, { ComponentProps, FC, ReactNode } from "react";
import classNames from "classnames";
import { Handle } from "rc-slider";
import Range from "visual/component/Controls/Range";

type Edge = "start" | "end";

type HandleProps = ComponentProps<typeof Handle> & {
  index: number;
  dragging: boolean;
};

export type Props = {
  start: number;
  end: number;
  hex1: string;
  hex2: string;
  active: Edge;
  onStartChange: (v: number) => void;
  onEndChange: (v: number) => void;
  onActiveChange: (v: Edge) => void;
};

export const GradientRange: FC<Props> = ({
  start,
  end,
  active,
  onStartChange,
  onEndChange,
  onActiveChange,
  hex1,
  hex2
}) => {
  return (
    <Range
      onChange={(v): void => {
        const c = v[0] === start ? onEndChange : onStartChange;
        const _v: number = v[0] === start ? v[1] : v[0];
        c(_v);
      }}
      min={0}
      max={100}
      step={1}
      startPointer={start}
      finishPointer={end}
      railStyle={{
        backgroundImage: `linear-gradient(to right, ${hex1}, ${hex2})`
      }}
      handle={(props): ReactNode => {
        const {
          className,
          index,
          // we need to ignore this prop
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          dragging,
          ...other
        } = props as HandleProps;
        const _active = index === 0 ? "start" : "end";
        const _className = classNames(className, {
          "brz-ed-rc-slider-handle": true,
          "brz-ed-rc-slider-handle--active":
            (index === 0 && active === "start") ||
            (index === 1 && active === "end")
        });
        return (
          <Handle
            {...other}
            key={index}
            className={_className}
            /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
            // @ts-ignore
            onMouseDown={(): void => onActiveChange(_active)}
          />
        );
      }}
    />
  );
};
