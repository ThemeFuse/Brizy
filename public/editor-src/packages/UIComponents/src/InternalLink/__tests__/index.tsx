import { fireEvent, render } from "@testing-library/react";
import React from "react";
import _ from "underscore";
import { InternalLink } from "../index";
import { Props, Status } from "../types";
import { items, waitIcon } from "../utils/testUtils";

describe("Test InternalLink", () => {
  const value = { id: items[0].value.toString(), title: items[0].title };

  const component = (props?: Partial<Props>) => (
    <InternalLink
      className="className"
      items={items}
      value={undefined}
      status={Status.INITIAL}
      resetValue={_.noop}
      onChange={_.noop}
      onSearch={_.noop}
      isLoading={false}
      {...props}
    />
  );

  const openDropdown = (container: HTMLElement) => {
    const valueEl = container.querySelector(
      ".brz-ed-control__internalLink__value"
    );
    valueEl && fireEvent.click(valueEl);
  };

  describe("Snapshots and Props", () => {
    test("className should be className", () => {
      const { container } = render(component());

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-control__internalLink__value")
      ).toHaveClass("className");
    });

    test(`value should be ${value}`, () => {
      const { container } = render(component({ value }));

      const valueSpan = container.querySelector<HTMLSpanElement>(
        ".brz-ed-control__internalLink__value .brz-span"
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(
          ".brz-ed-control__internalLink__value--placeholder"
        )
      ).not.toBeInTheDocument();
      expect(valueSpan?.innerHTML).toBe(value.title);
    });

    test("default Placeholder should be Type name", () => {
      const { container } = render(component());

      const valueSpan = container.querySelector<HTMLSpanElement>(
        ".brz-ed-control__internalLink__value .brz-span"
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(
          ".brz-ed-control__internalLink__value--placeholder"
        )
      ).toBeInTheDocument();
      expect(valueSpan?.innerHTML).toBe("Type name");
    });

    test("placeholder Should be Type value", () => {
      const { container } = render(component({ placeholder: "Type value" }));

      const valueSpan = container.querySelector<HTMLSpanElement>(
        ".brz-ed-control__internalLink__value .brz-span"
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(
          ".brz-ed-control__internalLink__value--placeholder"
        )
      ).toBeInTheDocument();
      expect(valueSpan?.innerHTML).toBe("Type value");
    });

    test("Items should be rendered as list of selectItem", () => {
      const { container } = render(component());

      openDropdown(container);

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelectorAll(".brz-ed-control__internalLink__option")
      ).toHaveLength(items.length);
    });

    test("if Status is no_result should be rendered selectItemNoResults", () => {
      const { container } = render(component({ status: Status.NO_RESULT }));

      openDropdown(container);

      const selectItem = container.querySelector<HTMLLIElement>(
        ".brz-ed-control__multiSelect2__option"
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(selectItem?.innerHTML).toBe("No results");
    });

    test("if Status isn't no_result should be rendered selectItem", () => {
      const { container } = render(component());

      openDropdown(container);

      const selectItem = container.querySelector<HTMLLIElement>(
        ".brz-ed-control__internalLink__option-text"
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(selectItem?.innerHTML).toBe(items[0].title);
    });
    test("if isn't Loading we shouldn't have brz-ed-control__internalLink__dropdown--search-loading className on dropdown", () => {
      const { container } = render(component());

      openDropdown(container);

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(
          ".brz-ed-control__internalLink__dropdown.brz-ed-control__internalLink__dropdown--search-loading"
        )
      ).not.toBeInTheDocument();
    });
    test("if is Loading we should have brz-ed-control__internalLink__dropdown--search-loading className on dropdown", () => {
      const { container } = render(component({ isLoading: true }));

      openDropdown(container);

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(
          ".brz-ed-control__internalLink__dropdown.brz-ed-control__internalLink__dropdown--search-loading"
        )
      ).toBeInTheDocument();
    });
  });
  describe("Event Handlers", () => {
    const resetValue = jest.fn();
    const onSearch = jest.fn();
    const onChange = jest.fn();

    const c = (props?: Partial<Props>) =>
      component({ ...props, resetValue, onSearch, onChange });
    test("Check resetValue", async () => {
      const { container } = render(c({ value }));

      await waitIcon(container);

      const icon = container.querySelector(".brz-icon-svg");

      icon && fireEvent.click(icon);

      expect(resetValue).toHaveBeenCalledTimes(1);
    });
    test("Check onSearch", () => {
      const { container } = render(c());

      openDropdown(container);

      const input = container.querySelector(".brz-input");

      input && fireEvent.change(input, { target: { value: "value" } });

      expect(onSearch).toHaveBeenCalledWith("value");
    });
    describe("Check onChange on every item", () => {
      test.each(items)("onChange Should be called", (item) => {
        const { container, getByTitle } = render(c());

        openDropdown(container);
        fireEvent.click(getByTitle(item.title));

        expect(onChange).toHaveBeenCalledWith(item);
      });
      test(`onChange Should be called ${items.length} times`, () => {
        expect(onChange).toHaveBeenCalledTimes(items.length);
      });
    });
  });
});
