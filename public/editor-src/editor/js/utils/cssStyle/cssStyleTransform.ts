import { mApply, MValue } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { read } from "visual/utils/cssProps/transform/Rotate";
import { defaultValueValue } from "visual/utils/onChange";
import { Transform } from "visual/utils/cssProps/transform";

type Data = {
  v: { [k in string]: MValue<Literal> };
  device: ResponsiveMode;
  state: State;
};

export const buildTransform = (v: Transform): string => {
  return (
    Object.entries(v).reduce(
      (acc, [k, v]) => acc + `${k}(${v})`,
      "transform: "
    ) + ";"
  );
};

export const cssStyleRotate = (d: Data): string => {
  const value = read(defaultValueValue({ key: "rotate", ...d }));
  return mApply(v => buildTransform({ rotate: `${v}deg` }), value) ?? "";
};
