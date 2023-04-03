import { render } from "@testing-library/react";
import React from "react";
import { Button } from "../../Button";
import { IconsName } from "../../EditorIcon/types";
import { Column } from "../Column";
import { Grid } from "../index";

describe("Test Grid", () => {
  const onClick = jest.fn();

  describe("Snapshots", () => {
    test("Grid with at least 2 columns with 1fr with className", () => {
      const grid = render(
        <Grid grid={[1, 1]} className="test-classname" showSeparator={false}>
          <Column align="start">Column with text align start</Column>
          <Column align="start">Column with text align start</Column>
        </Grid>
      );

      expect(grid.container).toMatchSnapshot();
    });

    test("Grid with at least 2 columns with 1fr w/out className", () => {
      const grid = render(
        <Grid grid={[1, 1]} showSeparator={false}>
          <Column align="start">Column with text align start</Column>
          <Column align="start">Column with text align start</Column>
        </Grid>
      );

      expect(grid.container).toMatchSnapshot();
    });

    test("Grid with at least 2 columns with 1fr with separator", () => {
      const grid = render(
        <Grid grid={[1, 1]} showSeparator={true}>
          <Column align="start">Column with text align start</Column>
          <Column align="start">Column with text align start</Column>
        </Grid>
      );

      expect(grid.container).toMatchSnapshot();
    });

    test("Grid with at least 2 columns:first one 'auto', second one 1fr w/out separator", () => {
      const grid = render(
        <Grid grid={["auto", 1]} showSeparator={false}>
          <Column align="start">Column with text align start</Column>
          <Column align="start">Column with text align start</Column>
        </Grid>
      );

      expect(grid.container).toMatchSnapshot();
    });

    test("Grid with at least 2 columns with align center with 1fr w/out separator", () => {
      const grid = render(
        <Grid grid={[1, 1]} showSeparator={false}>
          <Column align="center">Column with text align center</Column>
          <Column align="center">Column with text align center</Column>
        </Grid>
      );

      expect(grid.container).toMatchSnapshot();
    });

    test("Grid with at least 2 columns with align end with 1fr w/out separator", () => {
      const grid = render(
        <Grid grid={[1, 1]} showSeparator={false}>
          <Column align="end">Column with text align end</Column>
          <Column align="end">Column with text align end</Column>
        </Grid>
      );

      expect(grid.container).toMatchSnapshot();
    });

    test("Grid with at least 2 columns with align end with 1fr w/out separator with custom button component", () => {
      const grid = render(
        <Grid grid={[1, 1]} showSeparator={false}>
          <Column align="end">Column with text align end</Column>
          <Column align="end">
            <Button
              onClick={onClick}
              align="right"
              icon={IconsName.Duplicate}
              reverse={false}
            >
              Text
            </Button>
          </Column>
        </Grid>
      );

      expect(grid.container).toMatchSnapshot();
    });
  });
});
