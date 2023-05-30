import { waitFor } from "@testing-library/react";
import { Choice } from "../types";

export const waitIcon = async (container: HTMLElement) =>
  await waitFor(() =>
    expect(container.querySelector(".brz-icon-svg")).toBeInTheDocument()
  );

export const items: Choice[] = [
  { title: "first", value: 1 },
  { title: "second", value: 2 },
  { title: "third", value: 3 },
  { title: "fourth", value: 4 },
  { title: "fifth", value: 5 },
  { title: "sixth", value: 6 },
  { title: "seventh", value: 7 },
  { title: "eighth", value: 8 },
  { title: "ninth", value: 9 },
  { title: "tenth", value: 10 },
  { title: "eleventh", value: 11 },
  { title: "twelfth", value: 12 },
  { title: "thirteenth", value: 13 },
  { title: "fourteenth", value: 14 },
  { title: "fifteenth", value: 15 }
];
