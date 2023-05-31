import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { waitIcon } from "../../utils/testUtils";
import { Search } from "../Search";

describe("Test Search", () => {
  describe("Snapshots and Props", () => {
    test("loading shouldn't be", async () => {
      const { container } = render(<Search />);

      await waitIcon(container);

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(
          ".brz-ed-control__internalLink__spinner--hidden"
        )
      ).toBeInTheDocument();
      expect(
        container.querySelector(".brz-ed-animated--spin")
      ).not.toBeInTheDocument();
    });

    test("isLoading should be true", async () => {
      const { container } = render(<Search isLoading />);

      expect(container.firstChild).toMatchSnapshot();

      await waitIcon(container);

      expect(
        container.querySelector(
          ".brz-ed-control__internalLink__spinner--hidden"
        )
      ).not.toBeInTheDocument();
      expect(
        container.querySelector(".brz-ed-animated--spin")
      ).toBeInTheDocument();
    });
  });

  describe("Event Handlers", () => {
    test("Check onChange event handler", () => {
      const onChange = jest.fn();
      const { container } = render(<Search onChange={onChange} />);
      const input = container.querySelector(".brz-input");

      input && fireEvent.change(input, { target: { value: "value" } });

      expect(onChange).toHaveBeenCalledWith("value");
    });
  });
});
