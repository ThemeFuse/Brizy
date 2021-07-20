import { mApply } from "visual/utils/value";
import { read } from "visual/utils/cssProps/transform/Rotate";
import { defaultValueValue } from "visual/utils/onChange";
import { Transform } from "visual/utils/cssProps/transform";
import { CSSValue } from "../style2/types";

export const buildTransform = (v: Transform): string => {
  return (
    Object.entries(v).reduce(
      (acc, [k, v]) => acc + `${k}(${v})`,
      "transform: "
    ) + ";"
  );
};

export const cssStyleRotate = (d: CSSValue): string => {
  const value = read(defaultValueValue({ key: "rotate", ...d }));
  return mApply(v => buildTransform({ rotate: `${v}deg` }), value) ?? "";
};
