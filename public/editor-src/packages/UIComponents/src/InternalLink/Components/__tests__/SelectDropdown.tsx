import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { SelectDropdown } from "../SelectDropdown";

describe("Test SelectDropdown", () => {
  describe("Snapshots and Props", () => {
    test("children should be children and loading className shouldn't be", () => {
      const { container } = render(
        <SelectDropdown>
          <p className="children">children</p>
        </SelectDropdown>
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(
          ".brz-ed-control__internalLink__dropdown div:not(.brz-ed-control__internalLink__search) .children"
        )
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          ".brz-ed-control__internalLink__dropdown--search-loading"
        )
      ).not.toBeInTheDocument();
    });

    test("when is Search Loading className for loading should be", () => {
      const { container } = render(
        <SelectDropdown isSearchLoading>
          <>children</>
        </SelectDropdown>
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(
          ".brz-ed-control__internalLink__dropdown--search-loading"
        )
      ).toBeInTheDocument();
    });

    test('style should contain "backgroundColor: red"', () => {
      const { container } = render(
        <SelectDropdown style={{ backgroundColor: "red" }}>
          <>children</>
        </SelectDropdown>
      );

      const dropdown = container.querySelector<HTMLDivElement>(
        ".brz-ed-control__internalLink__dropdown"
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(dropdown).toHaveStyle("backgroundColor: red");
    });
  });

  describe("Event Handlers", () => {
    test("Check click event", () => {
      const onSearchChange = jest.fn();
      const { container } = render(
        <SelectDropdown onSearchChange={onSearchChange}>
          <>children</>
        </SelectDropdown>
      );
      const input = container.querySelector(".brz-input");

      input && fireEvent.change(input, { target: { value: "value" } });

      expect(onSearchChange).toHaveBeenCalledWith("value");
    });
  });
});
