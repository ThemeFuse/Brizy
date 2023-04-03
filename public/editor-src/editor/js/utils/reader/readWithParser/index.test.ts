import { parseStrict } from "fp-utilities";
import { mPipe, pipe } from "visual/utils/fp";
import * as Positive from "visual/utils/math/Positive";
import * as Num from "visual/utils/math/number";
import { prop } from "visual/utils/object/get";
import * as Str from "visual/utils/string/specs";
import { onNullish } from "visual/utils/value";
import { optional, or, readWithParser, strict } from "./index";

describe("Testing 'readWithParser' function", function () {
  type User = {
    userName: string;
    userAge: string;
    email: string | null;
  };

  type Person = {
    name: string;
    age: Positive.Positive;
    email: string | null;
  };

  test("If object passes all parsers, return values", () => {
    expect(
      readWithParser<User, Person>(
        {
          name: mPipe(prop("userName"), Str.read),
          age: mPipe(prop("userAge"), Num.read, Positive.fromNumber),
          email: (v) => v.email
        },
        { userName: "Tom", userAge: "23", email: null }
      )
    ).toEqual({ name: "Tom", age: 23, email: null });
  });

  test("If object does not pass at least one parser, return undefined", () => {
    expect(
      readWithParser<User, Person>(
        {
          name: mPipe(prop("userName"), Str.read),
          age: mPipe(prop("userAge"), Num.read, Positive.fromNumber),
          email: (v) => v.email
        },
        { userName: "Tom", userAge: "-44", email: null }
      )
    ).toBe(undefined);
  });

  test("If the `optional` parser is used, return the parsed object, even if the parser return undefined", () => {
    type User = {
      userName: string;
      userAge: string;
    };

    type Person = {
      name: string;
      age?: number;
    };

    const parser = readWithParser<User, Person>({
      name: (v) => v.userName,
      age: optional((v) => Num.read(v.userAge))
    });

    expect(parser({ userName: "Test", userAge: "test" })).toStrictEqual({
      name: "Test",
      age: undefined
    });
  });

  test("If the `strict` parser is used, return undefined, even if parsed key is optional", () => {
    type User = {
      userName: string;
      userAge: string;
    };

    type Person = {
      name: string;
      age?: number;
    };

    const parser = readWithParser<User, Person>({
      name: (v) => v.userName,
      age: strict((v) => Num.read(v.userAge))
    });

    expect(parser({ userName: "Test", userAge: "test" })).toBe(undefined);
  });
});

describe("Testing 'parseStrict' function", function () {
  type User = {
    userName: string;
    userAge: string;
  };

  type Person = {
    name: string;
    age: Positive.Positive;
  };

  test("If object passes all parsers, return values", () => {
    expect(
      parseStrict<User, Person>(
        {
          name: (v) => v.userName,
          age: pipe(
            prop("userAge"),
            mPipe(Num.read, Positive.fromNumber),
            onNullish(Positive.unsafe(45))
          )
        },
        { userName: "Tom", userAge: "23" }
      )
    ).toEqual({ name: "Tom", age: 23 });
  });

  test("If the `optional` parser is used, return the parsed object, even if the parser return undefined", () => {
    type User = {
      userName: string;
      userAge: string;
    };

    type Person = {
      name: string;
      age?: number;
    };

    const parser = parseStrict<User, Person>({
      name: (v) => v.userName,
      age: optional((v) => Num.read(v.userAge))
    });

    expect(parser({ userName: "Test", userAge: "test" })).toStrictEqual({
      name: "Test",
      age: undefined
    });
  });
});

describe("Testing 'or' function", () => {
  test("Always return result of the first successfully parser", () => {
    type A = { a: number };
    type B = { b: number };
    type C = { c: number };

    const parseC = readWithParser<A | B, C>({
      c: or([(v) => (v as A).a, (v) => (v as B).b])
    });

    expect(parseC({ a: 34, b: 53 })).toStrictEqual({ c: 34 });
    expect(parseC({ b: 53 })).toStrictEqual({ c: 53 });
  });

  test("Parse union types", () => {
    type A = { a: number };
    type B = { b: string };
    type C = A | B;

    const parseA = readWithParser<unknown, A>({ a: Num.read });
    const parseB = readWithParser<unknown, B>({ b: Str.read });
    const parseC = or<unknown, C>([parseA, parseB]);

    expect(parseC(34)).toStrictEqual({ a: 34 });
    expect(parseC("test")).toStrictEqual({ b: "test" });
  });
});
