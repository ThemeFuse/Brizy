import { render, waitFor } from "@testing-library/react";
import React from "react";
import { Literal } from "../../types/literal";
import { IconToggle } from "../index";
import { children } from "../utils/IconToggleChildren";

describe("Test IconToggle", () => {
  const onChange = jest.fn();

  describe("Snapshots", () => {
    test("Render left Icon", async () => {
      const iconToggle = render(
        <IconToggle<Literal> onChange={onChange} value="left">
          {children}
        </IconToggle>
      );

      await waitFor(() => {
        expect(iconToggle.container.firstChild).toBeInTheDocument();
      });
      expect(iconToggle.container.firstChild).toMatchSnapshot();
    });
    test("Render Center Icon", async () => {
      const iconToggle = render(
        <IconToggle<Literal> onChange={onChange} value="center">
          {children}
        </IconToggle>
      );

      await waitFor(() => {
        expect(iconToggle.container.firstChild).toBeInTheDocument();
      });
      expect(iconToggle.container.firstChild).toMatchSnapshot();
    });
    test("Render Right Icon", async () => {
      const iconToggle = render(
        <IconToggle<Literal> onChange={onChange} value="right">
          {children}
        </IconToggle>
      );
      await waitFor(() => {
        expect(iconToggle.container.firstChild).toBeInTheDocument();
      });
      expect(iconToggle.container.firstChild).toMatchSnapshot();
    });
  });
});
