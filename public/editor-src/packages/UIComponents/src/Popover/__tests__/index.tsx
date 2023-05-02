import { fireEvent, render, waitFor } from "@testing-library/react";
import React, { ReactNode } from "react";
import { Popover } from "../index";

type Props = {
  onOpen: () => void;
  onClose: () => void;
  clickOutsideExceptions: string[];
  children: ReactNode;
  className: string;
};

const renderPopover = ({
  onOpen,
  onClose,
  clickOutsideExceptions,
  children,
  className
}: Partial<Props>) => {
  const { container, getByText } = render(
    <>
      <Popover
        size="small"
        placement="top"
        trigger={<div className="trigger">trigger</div>}
        onOpen={onOpen}
        onClose={onClose}
        clickOutsideExceptions={clickOutsideExceptions}
        className={className}
      >
        {children}
      </Popover>
      {clickOutsideExceptions?.length && (
        <div className="exception">exception</div>
      )}
    </>
  );

  return { container, getByText };
};

describe("Test Popover", () => {
  describe("Snapshots", () => {
    test("Render popover with small tooltip and className", async () => {
      const { container, getByText } = renderPopover({
        className: "test-classname"
      });

      const trigger = getByText("trigger");
      const popover = container.querySelector(".brz-ed-control__popover");

      fireEvent.click(trigger);

      const tooltipOverlay = container.querySelector(
        ".brz-ed-tooltip__overlay"
      );

      await waitFor(() => {
        expect(tooltipOverlay).toHaveClass("brz-ed-tooltip--small");
        expect(popover).toHaveClass("test-classname");
        expect(container).toMatchSnapshot();
      });
    });

    test("Render opened popover", async () => {
      const { container, getByText } = renderPopover({
        children: "children"
      });

      const trigger = getByText("trigger");

      fireEvent.click(trigger);

      const popoverContent = getByText("children");

      await waitFor(() => {
        expect(popoverContent).toBeInTheDocument();
        expect(container).toMatchSnapshot();
      });

      fireEvent.click(trigger);

      await waitFor(() => {
        expect(popoverContent).not.toBeInTheDocument();
      });
    });
  });

  test("Check onOpen, onClose", () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();

    const { getByText } = renderPopover({ onOpen, onClose });

    const trigger = getByText("trigger");

    fireEvent.click(trigger);

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(0);

    fireEvent.click(trigger);

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("Check clickOutsideExceptions", async () => {
    const { getByText } = renderPopover({
      clickOutsideExceptions: [".exception"],
      children: "children"
    });

    const trigger = getByText("trigger");
    const exception = getByText("exception");

    fireEvent.click(trigger);

    const popoverContent = getByText("children");

    await waitFor(() => {
      expect(popoverContent).toBeInTheDocument();
    });

    fireEvent.click(exception);

    await waitFor(() => {
      expect(popoverContent).toBeInTheDocument();
    });
  });
});
