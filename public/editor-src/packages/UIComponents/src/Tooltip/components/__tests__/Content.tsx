import { render } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
import { ContentProps, Placement, Size } from "../../types";
import { getToolbar, placements, sizes } from "../../utils/testUtils";
import { TooltipContent } from "../Content";

describe("Test TooltipContent", () => {
  describe("Snapshots Simple render", () => {
    test("Should have children and by default shouldn't have arrow", () => {
      const { container } = render(
        <TooltipContent placement="top">
          <p className="children">children</p>
        </TooltipContent>
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip__overlay .children")
      ).toBeInTheDocument();
      expect(container.querySelector(".brz-ed-arrow")).not.toBeInTheDocument();
    });

    test("className should be className", () => {
      const { container } = render(
        <TooltipContent className="className" placement="top">
          Children
        </TooltipContent>
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(container.querySelector(".brz-ed-tooltip__overlay")).toHaveClass(
        "className"
      );
    });

    test("when show Arrow should have children with className:brz-ed-arrow", () => {
      const { container } = render(
        <TooltipContent showArrow={true} placement="top">
          Children
        </TooltipContent>
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(container.querySelector(".brz-ed-arrow")).toBeInTheDocument();
    });

    test.each<Size>(sizes)("Should have size:%s", (size) => {
      const { container } = render(
        <TooltipContent size={size} placement="top">
          children
        </TooltipContent>
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(`.brz-ed-tooltip--${size}`)
      ).toBeInTheDocument();
    });

    test.each<Placement>(placements)(
      "Should have placement:%s",
      (placement) => {
        const { container } = render(
          <TooltipContent placement={placement} showArrow>
            children
          </TooltipContent>
        );

        expect(container.firstChild).toMatchSnapshot();

        expect(
          container.querySelector(`.brz-ed-arrow--${placement}`)
        ).toBeInTheDocument();
      }
    );
  });
  describe("Snapshots render in Toolbar", () => {
    const component = ({
      children,
      ...props
    }: PropsWithChildren<ContentProps>) => (
      <TooltipContent {...props} toolbar={getToolbar()}>
        {children ?? "children"}
      </TooltipContent>
    );
    test("Should have children and by default should be closed", () => {
      const { container } = render(
        component({
          children: <p className="children">children</p>,
          placement: "top"
        })
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(".brz-ed-tooltip__overlay .children")
      ).toBeInTheDocument();
      expect(container.querySelector(".brz-invisible")).toBeInTheDocument();
    });

    test("className should be className", () => {
      const { container } = render(
        component({ className: "className", placement: "top" })
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(container.querySelector(".brz-ed-tooltip__overlay")).toHaveClass(
        "className"
      );
    });

    test("when isn't show Arrow shouldn't have children with className:brz-ed-arrow", () => {
      const { container } = render(
        component({ showArrow: false, placement: "top" })
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(container.querySelector(".brz-ed-arrow")).not.toBeInTheDocument();
    });

    test("when show Arrow should have children with className:brz-ed-arrow", () => {
      const { container } = render(
        component({ showArrow: true, placement: "top" })
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(container.querySelector(".brz-ed-arrow")).toBeInTheDocument();
    });

    test.each<Size>(sizes)("Should have size:%s", (size) => {
      const { container } = render(component({ size, placement: "top" }));

      expect(container.firstChild).toMatchSnapshot();

      expect(
        container.querySelector(`.brz-ed-tooltip--${size}`)
      ).toBeInTheDocument();
    });

    test("when isOpen shouldn't have className:brz-invisible", () => {
      const { container } = render(
        component({ isOpen: true, placement: "top" })
      );

      expect(container.firstChild).toMatchSnapshot();

      expect(container.querySelector(".brz-invisible")).not.toBeInTheDocument();
    });
  });
});
