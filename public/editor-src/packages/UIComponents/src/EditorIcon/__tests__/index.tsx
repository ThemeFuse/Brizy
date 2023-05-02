import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { EditorIcon } from "..";
import { IconsName } from "../../EditorIcon/types";

describe("Test Icon", () => {
  const onClick = jest.fn();
  describe("Snapshots", () => {
    test("Render Default Icon", async () => {
      const icon = render(<EditorIcon icon={IconsName.Duplicate} />);

      await waitFor(() => {
        expect(icon.container.firstChild).toBeInTheDocument();
      });

      expect(icon.container.firstChild).toMatchSnapshot();
    });

    test("Render Ministry Brands Icon", async () => {
      const icon = render(<EditorIcon icon={IconsName["t2-event-calendar"]} />);

      await waitFor(() => {
        expect(icon.container.firstChild).toBeInTheDocument();
      });

      expect(icon.container.firstChild).toMatchSnapshot();
    });
  });

  test("Check click event", async () => {
    const { container } = render(
      <EditorIcon onClick={onClick} icon={IconsName["t2-event-calendar"]} />
    );

    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    const element = container.firstChild;
    element && fireEvent.click(element);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
