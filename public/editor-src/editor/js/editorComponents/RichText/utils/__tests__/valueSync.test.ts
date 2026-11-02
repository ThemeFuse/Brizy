import { isExternalValueChange } from "../valueSync";

describe("isExternalValueChange", () => {
  it.each([
    {
      case: "the store equals the editor DOM",
      incoming: "<p>a</p>",
      domValue: "<p>a</p>",
      committedValue: "<p>a</p>",
      out: false
    },
    {
      case: "the store equals the DOM and an older commit is recorded",
      incoming: "<p>ab</p>",
      domValue: "<p>ab</p>",
      committedValue: "<p>a</p>",
      out: false
    },
    {
      case: "the store echoes our last commit while a newer edit is pending",
      incoming: "<p>a</p>",
      domValue: "<p>ab</p>",
      committedValue: "<p>a</p>",
      out: false
    },
    {
      case: "the store reverted to a value we never committed",
      incoming: "<p></p>",
      domValue: "<p>ab</p>",
      committedValue: "<p>ab</p>",
      out: true
    },
    {
      case: "the store advanced to a value we never committed",
      incoming: "<p>abc</p>",
      domValue: "<p>ab</p>",
      committedValue: "<p>ab</p>",
      out: true
    },
    {
      case: "the store changed while a newer edit is pending",
      incoming: "<p>x</p>",
      domValue: "<p>ab</p>",
      committedValue: "<p>a</p>",
      out: true
    }
  ])(
    "returns $out when $case",
    ({ incoming, domValue, committedValue, out }) => {
      expect(
        isExternalValueChange({ incoming, domValue, committedValue })
      ).toBe(out);
    }
  );
});
