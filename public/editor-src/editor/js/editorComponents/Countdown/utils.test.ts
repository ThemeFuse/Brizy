import { getTime as getTime2 } from "../Countdown2/utils";
import { getTime } from "./utils";

// `isValidDate` is private; it is driven here through `getTime`, which returns
// the epoch when the date does not validate and a real target time when it does.
// Countdown and Countdown2 carry byte-identical copies of it, so both run the
// same table.
describe.each([
  { component: "Countdown", getTime },
  { component: "Countdown2", getTime: getTime2 }
])("$component getTime", ({ getTime }) => {
  // Reading the result back through the same timezone offset the implementation
  // subtracted makes these assertions independent of the machine's timezone and
  // of DST: the offset cancels exactly.
  const partsOf = (time: number): [number, number, number] => {
    const d = new Date(time + new Date().getTimezoneOffset() * 60 * 1000);

    return [d.getMonth(), d.getDate(), d.getFullYear()];
  };

  it.each([
    { case: "a valid m/d/Y date", date: "03/15/2026", out: [2, 15, 2026] },
    { case: "a valid m-d-Y date", date: "03-15-2026", out: [2, 15, 2026] },
    { case: "single-digit month and day", date: "3/5/2026", out: [2, 5, 2026] },
    { case: "a real leap day", date: "02/29/2024", out: [1, 29, 2024] }
  ])("resolves $case", ({ date, out }) => {
    expect(partsOf(getTime(date, "10 PM", "30"))).toEqual(out);
  });

  // A rejected date yields the epoch itself, with no offset subtracted, so it
  // is compared as a raw timestamp rather than through `partsOf`: shifting 0 by
  // the machine's offset would land on 31 December 1969 east of UTC.
  it.each([
    { case: "a month past 12", date: "13/01/2026" },
    { case: "a day past the month's end", date: "02/30/2024" },
    { case: "a leap day in a common year", date: "02/29/2023" },
    { case: "a two-digit year", date: "1/1/26" },
    { case: "a dotted separator", date: "03.15.2026" },
    { case: "text that is not a date", date: "not-a-date" }
  ])("rejects $case", ({ date }) => {
    expect(getTime(date, "10 PM", "30")).toBe(0);
  });
});
