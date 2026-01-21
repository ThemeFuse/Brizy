import { m2 } from "../2";

describe("Testing PostTitle migration of sourceType and sourceID", () => {
  test("Test 1", () => {
    const v = {
      sourceType: "",
      sourceID: ""
    };

    expect(
      m2.cb({ v, vs: v, vd: v, renderContext: "editor" as const })
    ).toStrictEqual({
      ...v,
      textPopulationEntityType: "",
      textPopulationEntityId: ""
    });
  });

  test("Test 2", () => {
    const v = {
      sourceType: "post",
      sourceID: ""
    };

    expect(
      m2.cb({ v, vs: v, vd: v, renderContext: "editor" as const })
    ).toStrictEqual({
      ...v,
      textPopulationEntityType: "post",
      textPopulationEntityId: ""
    });
  });

  test("Test 3", () => {
    const v = {
      sourceType: "",
      sourceID: "123"
    };

    expect(
      m2.cb({ v, vs: v, vd: v, renderContext: "editor" as const })
    ).toStrictEqual({
      ...v,
      textPopulationEntityType: "",
      textPopulationEntityId: "123"
    });
  });

  test("Test 4", () => {
    const v = {
      sourceType: "post",
      sourceID: "123"
    };

    expect(
      m2.cb({ v, vs: v, vd: v, renderContext: "editor" as const })
    ).toStrictEqual({
      ...v,
      textPopulationEntityType: "post",
      textPopulationEntityId: "123"
    });
  });

  test("Test 5", () => {
    const v = {
      asd: 123,
      asd2: 1234
    };

    expect(
      m2.cb({ v, vs: v, vd: v, renderContext: "editor" as const })
    ).toStrictEqual({
      ...v,
      textPopulationEntityType: "",
      textPopulationEntityId: ""
    });
  });
});
