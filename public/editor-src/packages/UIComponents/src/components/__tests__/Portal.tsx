import { render } from "@testing-library/react";
import React from "react";
import { Portal } from "../Portal";

describe("Test Portal", () => {
  test("className should be classname,children should be children and all should be children of node", () => {
    const node = document.createElement("div");
    document.body.appendChild(node);
    render(
      <Portal node={node} className="className">
        Children
      </Portal>
    );

    expect(node.firstChild).toMatchSnapshot();

    expect(node.querySelector(".className")).toBeInTheDocument();
    expect(node.innerHTML).toContain("Children");
  });
});
