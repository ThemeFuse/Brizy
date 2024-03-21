import { FromElementModelGetter } from "visual/component/Options/Type";
import { capByPrefix } from "visual/utils/string";

export const wrap =
  (prefix: string) =>
  (f: FromElementModelGetter): FromElementModelGetter =>
  (s): ReturnType<FromElementModelGetter> =>
    f(capByPrefix(prefix, s));
