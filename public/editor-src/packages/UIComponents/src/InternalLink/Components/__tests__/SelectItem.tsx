import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { SelectItem, SelectItemNoResults } from "../SelectItem";

describe("Test SelectItem", () => {
  const onClick = jest.fn();

  describe("Snapshots and Props", () => {
    test("title should be title and children should be span with title", () => {
      const { container } = render(
        <SelectItem onClick={onClick} title="title" />
      );

      const li = container.querySelector<HTMLLIElement>(
        ".brz-ed-control__internalLink__option"
      );
      const span = container?.querySelector<HTMLSpanElement>(
        ".brz-ed-control__internalLink__option-text"
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(li?.title).toBe("title");
      expect(span?.innerHTML).toBe("title");
    });
  });

  describe("Event Handlers", () => {
    test("Check onClick event handler", () => {
      const { container } = render(
        <SelectItem onClick={onClick} title="title" />
      );
      const li = container.querySelector<HTMLLIElement>(
        ".brz-ed-control__internalLink__option"
      );

      li && fireEvent.click(li);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});

describe("Test SelectItemNoResults", () => {
  describe("Snapshots", () => {
    test("WithoutProps", () => {
      const { container } = render(<SelectItemNoResults />);

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
