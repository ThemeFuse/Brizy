import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import { InputHex } from "..";

const MockComponent = ({ currentValue }: { currentValue?: string }) => {
  const [value, setValue] = useState<string>(currentValue ?? "#000000");
  return <InputHex value={value} onChange={setValue} />;
};

describe("InputHex", () => {
  const onChangeMock = jest.fn();

  afterEach(() => {
    onChangeMock.mockReset();
  });
  describe("Snapshots", () => {
    test("renders without errors", () => {
      const { container } = render(
        <InputHex value="#000000" onChange={onChangeMock} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test("Changing value", async () => {
      render(<MockComponent currentValue={"#ffffff"} />);

      const component = screen.getByDisplayValue("#ffffff");

      expect(component).toBeInTheDocument();

      fireEvent.change(component, { target: { value: "#eeeeee" } });

      await waitFor(() => {
        expect(component).toHaveValue("#eeeeee");
      });

      expect(component).toMatchSnapshot();
    });
  });
});
