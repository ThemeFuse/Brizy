import { M, hasMembership } from "./index";

describe("Testing 'hasMembership' constant", function() {
  test("Return true if element has membership = 'on' and at least one item in list", () => {
    [
      { m: "on", mRoles: '["Admin","Contributor"]' },
      { m: "on", mRoles: '["Admin","Editor","asdasdasdasd"]' },
      { m: "on", mRoles: '["User1","User2"]' }
    ].map(a => expect(hasMembership(a.m as M, a.mRoles)).toBe(true));
  });

  test("Return false if values not valid", () => {
    [
      { m: "off", mRoles: '["Admin","Editor","asdasdasdasd"]' },
      { m: "off", mRoles: "[]" },
      { m: "on", mRoles: "[]" },
      { m: "on", mRoles: "asd" },
      { m: "on", mRoles: '["Admin]' },
      { m: "on", mRoles: "1234" }
    ].map(a => expect(hasMembership(a.m as M, a.mRoles)).toBe(false));
  });
});
