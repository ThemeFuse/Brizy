import { mPipe, parseStrict, pass } from "fp-utilities";
import { Rule } from "visual/global/Config/types/Rule";
import { WP } from "visual/global/Config/types/configs/WP";
import { pipe } from "visual/utils/fp";
import * as Arr from "visual/utils/reader/array";
import * as Num from "visual/utils/reader/number";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { throwOnNullish } from "visual/utils/value";
import { parseGlobalBlocks, parsePageCommon } from "./common";

const tParser = parseStrict<unknown, Rule>({
  type: pipe(
    mPipe(
      pass(Obj.isObject),
      Obj.readKey("type"),
      pass((v): v is Rule["type"] => [1, 2].includes(v as number))
    ),
    throwOnNullish("Invalid rule type")
  ),
  entityType: pipe(
    mPipe(
      pass<unknown, Record<string, unknown>>(Obj.isObject),
      Obj.readKey("entityType"),
      Str.read
    ),
    throwOnNullish("Invalid rule entity type")
  ),
  group: pipe(
    mPipe(pass(Obj.isObject), Obj.readKey("group"), Num.read),
    throwOnNullish("Invalid rule group")
  ),
  values: pipe(
    mPipe(
      pass(Obj.isObject),
      Obj.readKey("values"),
      Arr.readWithItemReader<string>(Str.read)
    ),
    throwOnNullish("Invalid rule values")
  )
});

const t = pipe(pass(Array.isArray), throwOnNullish("Err"), (v) =>
  v.map(tParser)
);

export const readConfig = (_config: Record<string, unknown>): WP => {
  const wp = Obj.read(_config.wp) ?? {};

  return {
    ..._config,
    pageData: parsePageCommon(_config.pageData),
    globalBlocks: parseGlobalBlocks(_config.globalBlocks),
    wp: {
      ...wp,
      ruleMatches: t(wp.ruleMatches)
    }
  } as WP;
};
