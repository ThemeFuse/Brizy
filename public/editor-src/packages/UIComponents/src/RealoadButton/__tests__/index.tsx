import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { ReloadButton } from "../index";

describe("ReloadButton component", () => {
  const onClick = jest.fn();
  describe("Snapshots", () => {
    test("renders correctly", () => {
      const { asFragment } = render(
        <ReloadButton onClick={onClick}>Replay Animation</ReloadButton>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  test("passes the className prop to the Button component", () => {
    const className = "test-class";
    const inputDev = render(
      <ReloadButton className={className} onClick={onClick}>
        Replay Animation
      </ReloadButton>
    );
    const first = inputDev.container.firstChild;

    expect(first).toHaveClass(className);
  });

  test("Check click event", () => {
    const { container } = render(
      <ReloadButton onClick={onClick}>Replay Animation</ReloadButton>
    );
    const nodes = container.querySelectorAll("div");
    const icon = nodes[nodes.length - 1];

    icon && fireEvent.click(icon);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
