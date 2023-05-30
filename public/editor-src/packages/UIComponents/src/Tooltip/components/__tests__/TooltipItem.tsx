import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { TooltipItem } from "../TooltipItem";

describe("Test TooltipItem", () => {
  describe("Snapshots", () => {
    test("Should have children", () => {
      const { container } = render(
        <TooltipItem>
          <p className="children">children</p>
        </TooltipItem>
      );

      expect(container.firstChild).toMatchSnapshot();
      expect(
        container.querySelector(".brz-ed-tooltip__item .children")
      ).toBeInTheDocument();
    });

    test("className should be className", () => {
      const { container } = render(
        <TooltipItem className="className">Children</TooltipItem>
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(container.querySelector(".brz-ed-tooltip__item")).toHaveClass(
        "className"
      );
    });
  });

  test("Check click event", () => {
    const onClick = jest.fn();
    const { container } = render(
      <TooltipItem onClick={onClick}>Children</TooltipItem>
    );
    const div = container.querySelector(".brz-ed-tooltip__item");

    div && fireEvent.click(div);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
