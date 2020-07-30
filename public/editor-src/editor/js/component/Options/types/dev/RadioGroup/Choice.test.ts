import { testReader } from "visual/utils/types/Type.test";
import { Choice, read } from "visual/component/Options/types/dev/RadioGroup/Choice";

describe("Testing Choices reader", () => {
  const valid: Choice[] = [
    { icon: "nc-icon", value: "" },
    { icon: "nc-icon", value: "1" },
    { icon: "nc-icon", value: 1 }
  ];

  const invalid = [
    { icon: "", value: "" },
    { icon: "", value: "1" },
    { icon: "", value: 1 },
    { icon: null, value: "" },
    { icon: undefined, value: "1" },
    { icon: "nc-icon", value: null },
    { icon: "nc-icon", value: undefined },
    { icon: "nc-icon", value: [] }
  ];

  testReader(read, valid, invalid);
});
