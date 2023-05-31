import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { waitIcon } from "../../utils/testUtils";
import { InternalLinkValue } from "../InternalLinkValue";

describe("Test InternalLinkValue", () => {
  describe("Snapshots and Props", () => {
    test("Without Props", () => {
      const button = render(<InternalLinkValue />);

      expect(button.container.firstChild).toMatchSnapshot();
    });

    test("value should be value", () => {
      const { container } = render(<InternalLinkValue value="value" />);

      const span = container.querySelector<HTMLSpanElement>(".brz-span");

      expect(container.firstChild).toMatchSnapshot();

      expect(span?.innerHTML).toBe("value");
    });

    test("className should be className", () => {
      const { container } = render(<InternalLinkValue className="className" />);

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-control__internalLink__value")
      ).toHaveClass("className");
    });
  });

  describe("Event Handlers", () => {
    test("Check onClick event handler", () => {
      const onClick = jest.fn();
      const { container } = render(<InternalLinkValue onClick={onClick} />);

      const div = container.querySelector(
        ".brz-ed-control__internalLink__value"
      );

      div && fireEvent.click(div);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test("Check onRemove event handler", async () => {
      const onRemove = jest.fn();
      const { container } = render(<InternalLinkValue onRemove={onRemove} />);

      await waitIcon(container);

      const icon = container.querySelector(".brz-icon-svg");

      icon && fireEvent.click(icon);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });
});
