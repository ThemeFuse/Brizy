import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import { Stepper } from "../index";

const MockStepper = ({ startValue }: { startValue: number }) => {
  const [value, setValue] = useState(startValue);

  const onChange = (newValue: number) => {
    setValue(newValue);
  };

  return <Stepper value={value} onChange={onChange} min={0} max={100} />;
};

describe("Test Stepper", () => {
  describe("Snapshots", () => {
    test("Render Stepper", async () => {
      const { container } = render(<MockStepper startValue={0} />);

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
    });
  });

  test("Changing Stepper value", async () => {
    const { container } = render(<MockStepper startValue={0} />);

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    const input = screen.getByDisplayValue(0);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 50 } });
    expect(input).toHaveValue(50);
  });

  test("Max and min value", async () => {
    const { container } = render(<MockStepper startValue={0} />);

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    const input = screen.getByDisplayValue(0);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 200 } });

    await waitFor(() => {
      expect(input).toHaveValue(100);
    });

    fireEvent.change(input, { target: { value: -200 } });

    await waitFor(() => {
      expect(input).toHaveValue(0);
    });
  });

  test("Arrows changing value + maximum and minimum boundary", async () => {
    const { container } = render(<MockStepper startValue={0} />);

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    const input = screen.getByDisplayValue(0);
    expect(input).toBeInTheDocument();

    const arrowUp = container.getElementsByClassName(
      "brz-ed-control__stepper--up"
    )[0];
    const arrowDown = container.getElementsByClassName(
      "brz-ed-control__stepper--down"
    )[0];

    // 0 + 1 = 1
    fireEvent.mouseDown(arrowUp);
    expect(input).toHaveValue(1);

    // 0 - 1 = 0
    fireEvent.mouseDown(arrowDown);
    expect(input).toHaveValue(0);

    // = 100
    fireEvent.change(input, { target: { value: 100 } });
    expect(input).toHaveValue(100);

    // 100 + 1 = 100 --> max: 100
    fireEvent.mouseDown(arrowUp);
    expect(input).toHaveValue(100);

    // = 0
    fireEvent.change(input, { target: { value: 0 } });
    expect(input).toHaveValue(0);

    // 0 - 1 = 0 --> min: 0
    fireEvent.mouseDown(arrowDown);
    expect(input).toHaveValue(0);
  });
});
