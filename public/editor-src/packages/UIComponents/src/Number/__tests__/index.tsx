import { fireEvent, render } from "@testing-library/react";
import React from "react";
import _ from "underscore";
import { Size } from "../../types/attributes";
import { Number } from "../index";

describe("Test Number", () => {
  describe("Snapshots", () => {
    test("By default showArrows should be true and size auto", () => {
      const { container } = render(
        <Number
          onChange={_.noop}
          onDecrease={_.noop}
          onIncrease={_.noop}
          value={undefined}
        />
      );

      const numberDiv = container.querySelector(".brz-ed-control__number");
      const arrows = numberDiv?.querySelector(
        ".brz-ed-control__number--arrows"
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(numberDiv).toHaveClass("brz-ed-control__number--auto");
      expect(arrows).toBeInTheDocument();
    });
    test.each([0, 1, -1])("value should be %s", (value) => {
      const { container } = render(
        <Number
          onChange={_.noop}
          onDecrease={_.noop}
          onIncrease={_.noop}
          value={value}
        />
      );

      const input = container.querySelector(".brz-input");

      expect(container.firstChild).toMatchSnapshot();

      expect(input?.getAttribute("value")).toBe(value.toString());
    });
    test.each<Size>(["auto", "short", "medium", "large"])(
      "size should be %s",
      (size) => {
        const { container } = render(
          <Number
            onChange={_.noop}
            onDecrease={_.noop}
            onIncrease={_.noop}
            size={size}
            value={undefined}
          />
        );

        const numberDiv = container.querySelector(".brz-ed-control__number");

        expect(container.firstChild).toMatchSnapshot();

        expect(numberDiv).toHaveClass(`brz-ed-control__number--${size}`);
      }
    );
    test("className should be className", () => {
      const { container } = render(
        <Number
          className="className"
          onChange={_.noop}
          onDecrease={_.noop}
          onIncrease={_.noop}
          value={undefined}
        />
      );
      const numberDiv = container.querySelector(".brz-ed-control__number");

      expect(container.firstChild).toMatchSnapshot();

      expect(numberDiv).toHaveClass("className");
    });
  });

  describe("Check event handlers", () => {
    test("Check change event", () => {
      const onChange = jest.fn();
      const { container } = render(
        <Number
          onChange={onChange}
          onDecrease={_.noop}
          onIncrease={_.noop}
          showArrows
          value={0}
        />
      );
      const input = container.querySelector(".brz-input");
      input && fireEvent.change(input, { target: { value: "1" } });

      expect(onChange).toHaveBeenCalledWith(1);
    });
    test("Check decrease event", () => {
      const onDecrease = jest.fn();
      const { container } = render(
        <Number
          onChange={_.noop}
          onDecrease={onDecrease}
          onIncrease={_.noop}
          showArrows
          value={0}
        />
      );
      const ArrowDown = container?.querySelector(
        ".brz-ed-control__number--down"
      );
      ArrowDown && fireEvent.click(ArrowDown);

      expect(onDecrease).toHaveBeenCalledTimes(1);
    });
    test("Check increase event", () => {
      const onIncrease = jest.fn();
      const { container } = render(
        <Number
          onChange={_.noop}
          onDecrease={_.noop}
          onIncrease={onIncrease}
          showArrows
          value={0}
        />
      );
      const ArrowUp = container?.querySelector(".brz-ed-control__number--up");
      ArrowUp && fireEvent.click(ArrowUp);

      expect(onIncrease).toHaveBeenCalledTimes(1);
    });
  });
});
