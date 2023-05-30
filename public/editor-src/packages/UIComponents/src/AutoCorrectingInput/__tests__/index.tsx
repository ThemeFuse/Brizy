import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import { AutoCorrectingInput } from "../index";

const MockComponent = ({ currentValue }: { currentValue?: number }) => {
  const [value, setValue] = useState<number>(currentValue ?? 0);
  return (
    <AutoCorrectingInput
      value={value}
      onChange={setValue}
      max={100}
      min={0}
      step={1}
    />
  );
};

describe("Test AutoCorrectingInput", () => {
  const onChange = jest.fn();
  const emptyFn = jest.fn();

  describe("Snapshots", () => {
    test("Render with all required properties", () => {
      const { container } = render(
        <AutoCorrectingInput
          value={0}
          onChange={onChange}
          max={100}
          min={0}
          step={1}
        />
      );

      expect(container).toMatchSnapshot();
    });

    test("Render with all possible properties", () => {
      const { container } = render(
        <AutoCorrectingInput
          value={0}
          onChange={onChange}
          max={100}
          min={0}
          step={1}
          size={100}
          className="custom-classname"
          onBlur={emptyFn}
          onFocus={emptyFn}
          onMouseEnter={emptyFn}
          onMouseLeave={emptyFn}
          onTextChange={emptyFn}
        />
      );

      expect(container).toMatchSnapshot();
    });

    test("Checking onChange", () => {
      render(<MockComponent />);

      const component = screen.getByDisplayValue(0);
      fireEvent.change(component, { target: { value: 90 } });
      expect(component).toHaveValue(90);
    });

    test("Checking only numbers", async () => {
      render(<MockComponent currentValue={55} />);

      const component = screen.getByDisplayValue(55);

      expect(component).toBeInTheDocument();

      fireEvent.change(component, { target: { value: "khnbn" } });

      await waitFor(() => {
        expect(component).toHaveValue(55);
      });

      expect(component).toMatchSnapshot();
    });

    test("Changing value", async () => {
      render(<MockComponent currentValue={42} />);

      const component = screen.getByDisplayValue(42);

      expect(component).toBeInTheDocument();

      fireEvent.change(component, { target: { value: 78 } });

      await waitFor(() => {
        expect(component).toHaveValue(78);
      });

      expect(component).toMatchSnapshot();
    });

    test("Checking max value and min value", async () => {
      render(<MockComponent currentValue={11} />);
      const component = screen.getByDisplayValue(11);
      expect(component).toBeInTheDocument();

      // max value
      fireEvent.change(component, { target: { value: 11111 } });
      await waitFor(() => {
        expect(component).toHaveValue(100);
      });
      expect(component).toMatchSnapshot();

      //min value
      fireEvent.change(component, { target: { value: -1900000 } });
      await waitFor(() => {
        expect(component).toHaveValue(0);
      });
      expect(component).toMatchSnapshot();
    });
  });
});
