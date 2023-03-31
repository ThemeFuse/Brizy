import { render } from "@testing-library/react";
import React from "react";
import { MockData } from "../data";
import { Group } from "../index";

describe("Test Group", () => {
  describe("Snapshots", () => {
    test("Render with children with classname", () => {
      const { container } = render(
        <Group className="custom-classname">{MockData}</Group>
      );

      expect(container).toMatchSnapshot();
    });

    test("Render with children w/out classname", () => {
      const { container } = render(<Group>{MockData}</Group>);

      expect(container).toMatchSnapshot();
    });
  });
});
