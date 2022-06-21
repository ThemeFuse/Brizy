import { renderStyles } from "visual/utils/cssStyle";
import { Value } from "./index";
export function style(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {};

  return renderStyles({ v, vs, vd, styles });
}
