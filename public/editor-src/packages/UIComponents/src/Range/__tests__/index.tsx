import { fireEvent, render, screen } from "@testing-library/react";
import classNames from "classnames";
import { Handle } from "rc-slider";
import React, { ReactNode, useState } from "react";
import { Range } from "../index";
import { HandleProps } from "../types";

const MockComponent = () => {
  const [value, setValue] = useState({
    startPointer: 0,
    finishPointer: 100,
    active: "start"
  });

  const onStartChange = (startPointer: number): void => {
    setValue((prevState) => ({ ...prevState, startPointer }));
  };

  const onEndChange = (finishPointer: number): void => {
    setValue((prevState) => ({ ...prevState, finishPointer }));
  };

  const onChange = (v: number[]): void => {
    const c = v[0] === value.startPointer ? onEndChange : onStartChange;
    const _v: number = v[0] === value.startPointer ? v[1] : v[0];
    c(_v);
  };

  // only for custom classnames for thumbs when one of them is active
  const onActiveChange = (active: string): void => {
    setValue((prevState) => ({ ...prevState, active }));
  };

  // for custom classname when one of the thumbs is active
  const handle = (props: HandleProps): ReactNode => {
    const { className, index, ...other } = props;
    const _active = index === 0 ? "start" : "end";
    const _className = classNames(className, {
      "brz-ed-rc-slider-handle": true,
      "brz-ed-rc-slider-handle--active":
        (index === 0 && value.active === "start") ||
        (index === 1 && value.active === "end")
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
    <Range
      min={0}
      max={100}
      step={1}
      handle={handle}
      startPointer={value.startPointer}
      finishPointer={value.finishPointer}
      onChange={onChange}
      className="custom-classname"
      railStyle={{
        backgroundImage: `linear-gradient(to right, #ebdb34, #3aeb34)`
      }}
    />
  );
};

describe("Test Range", () => {
  describe("Snapshots", () => {
    test("Render Range", () => {
      const { container } = render(<MockComponent />);

      expect(container).toMatchSnapshot();
    });

    test("Check onChange", () => {
      render(<MockComponent />);

      window.HTMLElement.prototype.getBoundingClientRect = () =>
        ({
          bottom: 44,
          height: 24,
          left: 10,
          right: 200,
          top: 20,
          width: 200
        } as DOMRect);

      const range = screen.getAllByRole("slider");

      expect(range[0]).toHaveClass("brz-ed-rc-slider-handle--active");

      fireEvent.mouseDown(range[1]);
      expect(range[1]).toHaveClass("brz-ed-rc-slider-handle--active");

      fireEvent.mouseDown(range[0], { clientX: 0, clientY: 0 });
      expect(range[0]).toHaveClass("brz-ed-rc-slider-handle--active");
    });
  });
});
