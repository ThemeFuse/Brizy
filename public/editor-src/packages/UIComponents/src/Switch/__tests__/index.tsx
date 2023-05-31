import { fireEvent, render, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import { Switch } from "..";

const MockComponent = () => {
  const [value, onChange] = useState(false);

  return <Switch value={value} onChange={onChange} />;
};

describe("Test Switch", () => {
  const onChange = jest.fn();
  describe("Snapshots", () => {
    test("Render default switch", async () => {
      const { container } = render(<Switch value={true} onChange={onChange} />);

      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });

      expect(container.firstChild).toMatchSnapshot();
    });

    test("Render light switch", async () => {
      const { container } = render(
        <Switch
          className="brz-ed-control__switch--light"
          value={true}
          onChange={onChange}
        />
      );

      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });

      expect(container.firstChild).toMatchSnapshot();
    });
    test("With switch on", () => {
      const { container } = render(<Switch value={true} onChange={onChange} />);

      const switchOnClass = container.querySelector(
        ".brz-ed-control__switch--on"
      );
      expect(switchOnClass).toBeInTheDocument();
    });
    test("With switch off", () => {
      const { container } = render(
        <Switch value={false} onChange={onChange} />
      );

      const switchOnClass = container.querySelector(
        ".brz-ed-control__switch--on"
      );
      expect(switchOnClass).not.toBeInTheDocument();
    });
  });
  test("Check if switch has on class after click", () => {
    const { container } = render(<MockComponent />);

    const element = container.firstElementChild;

    if (element) {
      fireEvent.click(element, true);
    }
    const switchOnClass = container.querySelector(
      ".brz-ed-control__switch--on"
    );

    expect(switchOnClass).toBeInTheDocument();
  });
});
