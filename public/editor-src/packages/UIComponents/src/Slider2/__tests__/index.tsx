import { fireEvent, render } from "@testing-library/react";
import React from "react";
import _ from "underscore";
import { Slider2 } from "../index";

describe("Test Slider2", () => {
  describe("Snapshots", () => {
    test("value should be 0", () => {
      const { container } = render(<Slider2 onChange={_.noop} value={0} />);

      const input = container.querySelector(".brz-input");

      expect(container.firstChild).toMatchSnapshot();

      expect(input?.getAttribute("value")).toBe("0");
    });
    test("value should be -1", () => {
      const { container } = render(<Slider2 onChange={_.noop} value={-1} />);

      const input = container.querySelector(".brz-input");

      expect(container.firstChild).toMatchSnapshot();

      expect(input?.getAttribute("value")).toBe("-1");
    });
    test("value should be 1", () => {
      const { container } = render(<Slider2 onChange={_.noop} value={1} />);

      const input = container.querySelector(".brz-input");

      expect(container.firstChild).toMatchSnapshot();

      expect(input?.getAttribute("value")).toBe("1");
    });
    test("step should be 5", () => {
      const { container } = render(
        <Slider2 onChange={_.noop} step={5} value={0} />
      );

      const slider2Div = container.querySelector(".brz-ed-control--slider2");

      expect(container.firstChild).toMatchSnapshot();

      expect(slider2Div?.getAttribute("step")).toBe("5");
    });
    test("min should be 0", () => {
      const { container } = render(
        <Slider2 onChange={_.noop} min={0} value={0} />
      );

      const slider2Div = container.querySelector(".brz-ed-control--slider2");

      expect(container.firstChild).toMatchSnapshot();

      expect(slider2Div?.getAttribute("min")).toBe("0");
    });
    test("min should be -5", () => {
      const { container } = render(
        <Slider2 onChange={_.noop} min={-5} value={0} />
      );

      const slider2Div = container.querySelector(".brz-ed-control--slider2");

      expect(container.firstChild).toMatchSnapshot();

      expect(slider2Div?.getAttribute("min")).toBe("-5");
    });
    test("min should be 5", () => {
      const { container } = render(
        <Slider2 onChange={_.noop} min={5} value={0} />
      );

      const slider2Div = container.querySelector(".brz-ed-control--slider2");

      expect(container.firstChild).toMatchSnapshot();

      expect(slider2Div?.getAttribute("min")).toBe("5");
    });
    test("max should be -10", () => {
      const { container } = render(
        <Slider2 onChange={_.noop} max={-10} value={0} />
      );

      const slider2Div = container.querySelector(".brz-ed-control--slider2");

      expect(container.firstChild).toMatchSnapshot();

      expect(slider2Div?.getAttribute("max")).toBe("-10");
    });
    test("max should be 0", () => {
      const { container } = render(
        <Slider2 onChange={_.noop} max={0} value={0} />
      );

      const slider2Div = container.querySelector(".brz-ed-control--slider2");

      expect(container.firstChild).toMatchSnapshot();

      expect(slider2Div?.getAttribute("max")).toBe("0");
    });
    test("max should be 10", () => {
      const { container } = render(
        <Slider2 onChange={_.noop} max={10} value={0} />
      );

      const slider2Div = container.querySelector(".brz-ed-control--slider2");

      expect(container.firstChild).toMatchSnapshot();

      expect(slider2Div?.getAttribute("max")).toBe("10");
    });
    test("className should be className", () => {
      const { container } = render(
        <Slider2 className="className" onChange={_.noop} value={0} />
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(container.querySelector(".brz-ed-control--slider2")).toHaveClass(
        "className"
      );
    });
  });

  describe("Check event handlers", () => {
    test("Check change and mouseup event", () => {
      const onChange = jest.fn();
      const { container } = render(<Slider2 onChange={onChange} value={0} />);
      const input = container.querySelector(".brz-input");
      input && fireEvent.change(input, { target: { value: "1" } });

      expect(onChange).toHaveBeenCalledWith(1, { editing: true });

      input && fireEvent.mouseUp(input, { target: { value: "1" } });

      expect(onChange).toHaveBeenCalledWith(1, { editing: false });
    });
  });
});
