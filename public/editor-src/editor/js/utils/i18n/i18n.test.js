import { translate } from "./translate";

test("translate", () => {
  expect(translate({}, "key")).toBe("key");
  expect(translate({ key: "cheie" }, "key")).toBe("cheie");
});
