import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Textarea } from "../index";

describe("Test Textarea", () => {
  const onChange = jest.fn();

  describe("Snapshots", () => {
    test("Render textarea with value 'test'", () => {
      const { container } = render(
        <Textarea value="test" onChange={onChange} />
      );

      expect(container).toMatchSnapshot();
    });

    test("Render textarea with 10 rows", () => {
      const { container } = render(
        <Textarea value="10 rows" rows={10} onChange={onChange} />
      );

      expect(container).toMatchSnapshot();
    });

    test("Render textarea with placeholder 'test'", () => {
      const { container } = render(
        <Textarea placeholder="test" value="" onChange={onChange} />
      );

      expect(container).toMatchSnapshot();
    });

    test("Type text into textarea", () => {
      let state = "value";

      const onChange = (e: string) => {
        state = e;
      };

      render(<Textarea placeholder="test" value={state} onChange={onChange} />);

      const textarea = screen.getByPlaceholderText("test");

      expect(textarea).toBeInTheDocument();

      fireEvent.change(textarea, { target: { value: "1" } });

      expect(state).toBe("1");
    });
  });
});
