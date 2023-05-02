import { fireEvent, render } from "@testing-library/react";
import React, { useState } from "react";
import { Tabs } from "../index";
import {
  tabChildrenMap,
  tabChildrenSingle,
  tabChildrenTop
} from "../utils/TabChilren";

const children = tabChildrenMap(tabChildrenTop);
const singleChildren = tabChildrenMap(tabChildrenSingle);

const MockComponent = () => {
  const [value, onChange] = useState("currentShortcodeIconTab");

  return (
    <Tabs
      value={value}
      onChange={onChange}
      align="center"
      position="top"
      showSingle={true}
    >
      {children}
    </Tabs>
  );
};

describe("Test Tabs", () => {
  const onChange = jest.fn();

  describe("Snapshots", () => {
    test("Tabs on top center", () => {
      const { container } = render(
        <Tabs
          align="center"
          onChange={onChange}
          position="top"
          showSingle={true}
          value="currentShortcodeIconTab"
        >
          {children}
        </Tabs>
      );

      const ul = container.querySelector("ul");

      expect(ul).toHaveClass(
        "brz-justify-content-xs-center brz-ed-control__tabs__top"
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    test("Tabs on left end", () => {
      const { container } = render(
        <Tabs
          align="end"
          onChange={onChange}
          position="left"
          showSingle={true}
          value="currentShortcodeIconTab"
        >
          {children}
        </Tabs>
      );

      const ul = container.querySelector("ul");

      expect(ul).toHaveClass(
        "brz-justify-content-xs-end brz-ed-control__tabs__left"
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    test("Check showSingle true", () => {
      const { container } = render(
        <Tabs
          align="center"
          onChange={onChange}
          position="top"
          showSingle={true}
          value="currentShortcodeIconTab"
        >
          {singleChildren}
        </Tabs>
      );

      const tab = container.querySelector(".brz-ed-control__tabs");

      expect(tab).toBeInTheDocument();
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  test("Tabs on top start", () => {
    const { container } = render(
      <Tabs
        align="start"
        onChange={onChange}
        position="top"
        showSingle={true}
        value="currentShortcodeIconTab"
      >
        {children}
      </Tabs>
    );

    const ul = container.querySelector("ul");

    expect(ul).toHaveClass(
      "brz-justify-content-xs-start brz-ed-control__tabs__top"
    );
  });

  test("Check showSingle false", () => {
    const { container } = render(
      <Tabs
        align="center"
        onChange={onChange}
        position="top"
        showSingle={false}
        value="currentShortcodeIconTab"
      >
        {singleChildren}
      </Tabs>
    );

    const tab = container.querySelector(".brz-ed-control__tabs");

    expect(tab).not.toBeInTheDocument();
  });

  test("Check click event", () => {
    const { container } = render(<MockComponent />);

    const current = container.querySelector("li");

    if (current) {
      fireEvent.click(current, {
        target: { value: "currentShortcodeTab" }
      });
    }
    expect(current).not.toBeNull();
    expect(current).toHaveClass("active");
  });
});
