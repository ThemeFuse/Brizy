import { fireEvent, render, waitFor } from "@testing-library/react";
import React, { RefObject, useState } from "react";
import { ClickOutside } from "..";
import { Exception } from "../types";

interface MockProps {
  onClick: () => void;
  exceptions?: Exception[];
}

const MockComponent = ({ onClick, exceptions }: MockProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <ClickOutside<HTMLDivElement>
        onClickOutside={() => setIsOpen(false)}
        exceptions={exceptions}
      >
        {(ref: RefObject<HTMLDivElement>) => (
          <div style={{ width: 120 }} ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)}>Open dropwdown</button>
            {isOpen && (
              <div
                style={{ backgroundColor: "white", padding: 20 }}
                className="dropdown"
              >
                Dropdown
              </div>
            )}
          </div>
        )}
      </ClickOutside>

      <div className="exception" onClick={onClick}>
        Exception test
      </div>
    </>
  );
};

describe("Test ClickOutside", () => {
  const onClick = jest.fn();

  test("Check click outside", () => {
    const { container } = render(<MockComponent onClick={onClick} />);

    const exceptionElement = container.querySelector(".exception");

    exceptionElement && fireEvent.click(exceptionElement);

    expect(onClick).toHaveBeenCalled();
    const dropwdown = container.querySelector(".dropdown");
    waitFor(() => {
      expect(dropwdown).not.toBeInTheDocument();
    });
  });

  test("Check click outside exception", () => {
    const { container } = render(
      <MockComponent onClick={onClick} exceptions={[".exception"]} />
    );

    const exceptionElement = container.querySelector(".exception");

    exceptionElement && fireEvent.click(exceptionElement);

    expect(onClick).toHaveBeenCalled();
    const dropwdown = container.querySelector(".dropdown");
    expect(dropwdown).toBeInTheDocument();
  });
});
