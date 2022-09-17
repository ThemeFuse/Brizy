import { Entries, makeFormEncode } from "../utils";

describe("testing API Utils", () => {
  test.each<[Record<string, Entries>, Record<string, string>]>([
    [{}, {}],
    [
      {
        version: 10
      },
      { version: "10" }
    ],
    [
      {
        data: [
          {
            name: "test",
            id: 1
          },
          {
            name: "test2",
            id: 2
          }
        ]
      },
      {
        "data[0][name]": "test",
        "data[0][id]": "1",
        "data[1][name]": "test2",
        "data[1][id]": "2"
      }
    ],
    [
      {
        fields: [1, 2, 3, "4"]
      },
      {
        "fields[0]": "1",
        "fields[1]": "2",
        "fields[2]": "3",
        "fields[3]": "4"
      }
    ],

    [
      {
        test: "1",
        data: undefined
      },
      {
        test: "1"
      }
    ]
  ])("makeFormEncode nr %#", (form, resolve) => {
    expect(makeFormEncode(form)).toStrictEqual(resolve);
  });
});
