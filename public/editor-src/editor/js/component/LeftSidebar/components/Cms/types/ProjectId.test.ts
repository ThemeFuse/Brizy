import { fromNumber, fromString, is, ProjectId, toId } from "./ProjectId";
import { isT } from "fp-utilities";

const idGen = (n: number): number[] => Array(n).map((_, i) => i + 1);

describe("Testing 'is' function", function() {
  test("ProjectId value has `/data/ID` signature", () => {
    const ids = idGen(20).map(t => `/data/${t}`);

    ids.forEach(id => expect(is(id)).toBe(true));
  });

  test("'/data/0' is not a valid id", () => {
    expect(is("/data/0")).toBe(false);
  });

  test("'/data/-10' is not a valid id", () => {
    expect(is("/data/-10")).toBe(false);
  });

  test("'/data/10.5' is not a valid id", () => {
    expect(is("/data/10.5")).toBe(false);
  });

  test("'/data/NaN' is not a valid id", () => {
    expect(is("/data/NaN")).toBe(false);
  });

  describe("String value should contain only projectId id", function() {
    test("'test/data/1' is not a valid id", () =>
      expect(is("test/data/1")).toBe(false));
    test("'/data/1/data' is not a valid id", () =>
      expect(is("/data/1/test")).toBe(false));
    test("'/data/1data' is not a valid id", () =>
      expect(is("/data/1test")).toBe(false));
  });
});

describe("Testing 'fromString' function", function() {
  test("Any string that passes `is` is a ProjectId", () => {
    const ids = idGen(20).map(t => `/data/${t}`);

    ids.forEach(id => expect(fromString(id)).toBe(id));
  });

  test("Any string that does not pass `is` isn't a ProjectId", () => {
    const ids = [
      "/data/0",
      "/data/-1",
      "/data/10.5",
      "/data/NaN",
      "test/data/1",
      "/data/1/test",
      "/data/1test"
    ];

    ids.forEach(id => expect(fromString(id)).toBe(undefined));
  });
});

describe("Testing 'fromId' function", function() {
  const seed = idGen(20).map((t): [number, string] => [t, `/data/${t}`]);

  test.each(seed)("Expect %d to be '%s'", (id, str) =>
    expect(fromNumber(id)).toBe(str)
  );
});

describe("Testing 'toId' function", function() {
  const seed = idGen(20).map((t): [ProjectId, number] => [
    `/data/${t}` as ProjectId,
    t
  ]);

  test.each(seed)("Expect '%s' to be %d", (projectId, id) =>
    expect(toId(projectId)).toBe(id)
  );
});

describe("fromId and toId are isomorphic", function() {
  test("compose(fromId, toId) === id", () => {
    idGen(20).forEach(id => expect(toId(fromNumber(id))).toBe(id));
  });

  test("compose(toId, fromId) === projectId", () => {
    idGen(20)
      .map(id => `/data/${id}`)
      .map(fromString)
      .filter(isT)
      .forEach(id => expect(fromNumber(toId(id))).toBe(id));
  });
});
