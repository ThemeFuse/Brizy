import { mPipe, match, optional, parse, pass } from "fp-utilities";
import {
  AllData,
  HelperFn,
  InputData,
  SearchData,
  SelectData,
  SwitchData
} from "visual/component/Prompts/common/GlobalApps/StepsView/Fields/types";
import * as Arr from "visual/utils/array";
import * as Bool from "visual/utils/bool";
import { pipe } from "visual/utils/fp";
import { prop } from "visual/utils/object/get";
import { readWithParser } from "visual/utils/reader/readWithParser";
import * as Str from "visual/utils/string/specs";

type RecordNever = Record<string, never>;

const isStringOrNull = (v: unknown): boolean => {
  if (typeof v === "string") {
    return true;
  }
  return v === null;
};

const isValidHelper = (v: unknown): boolean => {
  if (typeof v === "function") {
    return true;
  }
  return isStringOrNull(v);
};

const readInput = readWithParser<Record<string, unknown>, InputData>({
  type: (r) => {
    return r.type === "input" || r.type === undefined ? "input" : undefined;
  },
  value: pipe(
    prop("value"),
    pass((v): v is string | null => isStringOrNull(v))
  ),
  title: mPipe(prop("title"), Str.read),
  name: mPipe(prop("name"), Str.read),
  required: optional(pipe(prop("required"), pass(Bool.is))),
  helper: optional(
    pipe(
      prop("helper"),
      pass((v): v is string | null | HelperFn => isValidHelper(v))
    )
  )
});

const readSelect = parse<Record<string, unknown>, SelectData>({
  type: (r) => (r.type === "select" ? "select" : undefined),
  choices: mPipe(prop("choices"), (v) => Arr.toArray(v)),
  value: pipe(
    prop("value"),
    pass((v): v is string | null => typeof v === "string" || v === null)
  ),
  title: mPipe(prop("title"), Str.read),
  name: mPipe(prop("name"), Str.read),
  required: optional(pipe(prop("required"), pass(Bool.is))),
  helper: optional(
    pipe(
      prop("helper"),
      pass((v): v is string | null | HelperFn => isValidHelper(v))
    )
  )
});

const readSwitch = parse<Record<string, unknown>, SwitchData>({
  type: (r) => (r.type === "switch" ? "switch" : undefined),
  title: mPipe(prop("title"), Str.read),
  value: pipe(prop("value"), (v): boolean => (Bool.is(v) ? v : false)),
  name: mPipe(prop("name"), Str.read),
  required: optional(pipe(prop("required"), pass(Bool.is))),
  helper: optional(
    pipe(
      prop("helper"),
      pass((v): v is string | null | HelperFn => isValidHelper(v))
    )
  )
});

const readSearch = parse<Record<string, unknown>, SearchData>({
  type: (r) => (r.type === "search" ? "search" : undefined),
  choices: mPipe(prop("choices"), (v) => Arr.toArray(v)),
  value: pipe(
    prop("value"),
    pass((v): v is string | null => isStringOrNull(v))
  ),
  title: mPipe(prop("title"), Str.read),
  name: mPipe(prop("name"), Str.read),
  required: optional(pipe(prop("required"), pass(Bool.is))),
  helper: optional(
    pipe(
      prop("helper"),
      pass((v): v is string | null | HelperFn => isValidHelper(v))
    )
  ),
  multiple: pipe(prop("multiple"), Bool.is)
});

const isInput = (r: Record<string, unknown>): r is { type: "input" } =>
  r.type === "input" || r.type === undefined;
const isSelect = (r: Record<string, unknown>): r is { type: "select" } =>
  r.type === "select";
const isSwitch = (r: Record<string, unknown>): r is { type: "switch" } =>
  r.type === "switch";
const isSearch = (r: Record<string, unknown>): r is { type: "search" } =>
  r.type === "search";

type T = AllData | RecordNever;

const read: (r: T) => AllData | undefined = match(
  [isInput, readInput],
  [isSelect, readSelect],
  [isSwitch, readSwitch],
  [isSearch, readSearch],
  [
    //@ts-expect-error: 'r' is declared but its value is never read.
    (r: Record<string, unknown>): r is Record<string, never> => true,
    () => undefined
  ]
);

export const readApiKey = (t: Record<string, unknown>): AllData | undefined => {
  return read(t as T);
};

// Open window AuthConnect

const makeDimensions = (): string => {
  const windowWidth = 600;
  const windowHeight = 600;
  const left = screen.width / 2 - windowWidth / 2;
  const top = 100;

  return `width=${windowWidth},height=${windowHeight},top=${top},left=${left}`;
};

export function authWindow(url: string): Promise<void> {
  return new Promise((resolve) => {
    const win = window.open(url, "", makeDimensions());
    const timer = setInterval(() => {
      if (win?.closed) {
        clearInterval(timer);
        resolve();
      }
    }, 500);
  });
}
