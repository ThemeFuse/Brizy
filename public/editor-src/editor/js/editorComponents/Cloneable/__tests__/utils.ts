import { readItemTypes } from "../utils";

describe("readItemTypes", () => {
  it.each<{ case: string; value: unknown; out: string[] | undefined }>([
    {
      case: "button items",
      value: { items: [{ type: "Button" }, { type: "Button" }] },
      out: ["Button", "Button"]
    },
    {
      case: "icon items",
      value: { items: [{ type: "Icon", value: { _id: "i1" } }] },
      out: ["Icon"]
    },
    { case: "no items", value: { items: [] }, out: [] },
    { case: "a value without items", value: { _id: "c1" }, out: undefined },
    {
      case: "items without a type",
      value: { items: [{ value: {} }] },
      out: undefined
    },
    { case: "undefined", value: undefined, out: undefined }
  ])("reads $case", ({ value, out }) => {
    expect(readItemTypes(value)).toStrictEqual(out);
  });
});
