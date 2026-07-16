import { render } from "@testing-library/react";
import React, { ReactNode } from "react";
import { Sheet } from "../Sheet";
import { SheetContext } from "../context";
import { useCSS } from "../useCSS";

const DEFAULT_STYLE = "{{WRAPPER}}{display:block;}";
const RULES_STYLE = "{{WRAPPER}}{margin:0;}";
const ELEMENT_STYLE = "{{WRAPPER}}{color:red;}";

interface Props {
  id: string;
  componentId: string;
  css: Array<string>;
}

const Styled = (props: Props): JSX.Element => {
  const className = useCSS(props);

  return <div data-testid={props.id} className={className} />;
};

const renderWithSheet = (sheet: Sheet, children: ReactNode) =>
  render(
    <SheetContext.Provider value={{ sheet, setDoc: jest.fn() }}>
      {children}
    </SheetContext.Provider>
  );

const styleNodes = () => document.head.querySelectorAll("style");

const cssTextOf = (className: string): string | undefined =>
  Array.from(styleNodes()).find((node) =>
    node.textContent?.includes(`.${className}`)
  )?.textContent ?? undefined;

describe("useCSS", () => {
  let sheet: Sheet;

  beforeEach(() => {
    document.head.innerHTML = "";
    sheet = new Sheet({ doc: document });
  });

  // The image-moved-between-columns case: the new instance renders (reusing the
  // cached className) before the old instance unmounts.
  it("keeps the element <style> alive when an element remounts elsewhere", () => {
    const props = {
      id: "image-1",
      componentId: "image",
      css: [DEFAULT_STYLE, RULES_STYLE, ELEMENT_STYLE]
    };

    const oldColumn = renderWithSheet(sheet, <Styled {...props} />);
    const className = oldColumn
      .getByTestId("image-1")
      .getAttribute("class") as string;

    expect(className.split(" ")).toHaveLength(3);
    className.split(" ").forEach((cn) => expect(cssTextOf(cn)).toBeDefined());

    // moved: new instance mounts first, old one unmounts afterwards
    const newColumn = renderWithSheet(sheet, <Styled {...props} />);
    oldColumn.unmount();

    expect(newColumn.getByTestId("image-1").getAttribute("class")).toBe(
      className
    );
    className.split(" ").forEach((cn) => expect(cssTextOf(cn)).toBeDefined());
  });

  it("shares one <style> per bucket between two live owners", () => {
    const props = {
      id: "image-1",
      componentId: "image",
      css: [DEFAULT_STYLE, RULES_STYLE, ELEMENT_STYLE]
    };

    const first = renderWithSheet(sheet, <Styled {...props} />);
    const before = styleNodes().length;
    const second = renderWithSheet(sheet, <Styled {...props} />);

    expect(before).toBe(3);
    expect(styleNodes()).toHaveLength(before);

    // no leak: the last owner leaving tears the nodes down
    first.unmount();
    expect(styleNodes()).toHaveLength(before);

    second.unmount();
    expect(styleNodes()).toHaveLength(0);
    expect(sheet.getClassNamesCounter()).toEqual({});
    expect(sheet.getStyles()).toEqual([]);
  });

  it("does not remove a shared default/rules <style> still used by another element", () => {
    const first = renderWithSheet(
      sheet,
      <Styled
        id="image-1"
        componentId="image"
        css={[DEFAULT_STYLE, RULES_STYLE, ELEMENT_STYLE]}
      />
    );
    const second = renderWithSheet(
      sheet,
      <Styled
        id="image-2"
        componentId="image"
        css={[DEFAULT_STYLE, RULES_STYLE, "{{WRAPPER}}{color:blue;}"]}
      />
    );

    const sharedDefault = (
      second.getByTestId("image-2").getAttribute("class") as string
    ).split(" ")[0];

    // image-2 keeps its own element style and the shared default/rules ones
    first.unmount();

    expect(cssTextOf(sharedDefault)).toBeDefined();
    // default + rules + image-2's own element style; image-1's element style is gone
    expect(styleNodes()).toHaveLength(3);

    second.unmount();
    expect(styleNodes()).toHaveLength(0);
  });
});
