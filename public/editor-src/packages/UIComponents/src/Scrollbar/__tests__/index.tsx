import { render } from "@testing-library/react";
import React from "react";
import { Scrollbar } from "..";
import { children } from "../mock/children";

describe("Test Scrollbar", () => {
  describe("Snapshots", () => {
    test("Scrollbar with dark theme", () => {
      const { container } = render(
        <Scrollbar theme="dark"> {children}</Scrollbar>
      );

      const scrollTheme = container.querySelector(".brz-scrollColor__dark");

      expect(scrollTheme).toBeInTheDocument();
      expect(container.firstChild).toMatchSnapshot();
    });
    test("Scrollbar with light theme", () => {
      const { container } = render(
        <Scrollbar theme="light"> {children}</Scrollbar>
      );

      const scrollTheme = container.querySelector(".brz-scrollColor__light");

      expect(scrollTheme).toBeInTheDocument();
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
