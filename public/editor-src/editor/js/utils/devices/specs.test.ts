import { testReader } from "visual/utils/types/Type.test";
import { Device, DeviceType, eq, read } from "./specs";
import { testMonoid } from "visual/utils/types/Monoid.test";
import { testEq } from "visual/utils/types/Eq.test";

describe("Testing 'read' function", function() {
  testReader(
    read,
    ["all", "desktop", "responsive"],
    [undefined, null, {}, [], 1, "test"]
  );
});

describe("Testing monoid behaviour function", function() {
  testMonoid<Device>(DeviceType, ["all", "desktop", "responsive"]);
});

describe("Testing Device Eq implementation", function() {
  testEq(eq, "all", "all", "responsive");
});
