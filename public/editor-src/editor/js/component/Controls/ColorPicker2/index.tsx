import { throttle } from "es-toolkit";
import React, { ReactElement, useRef } from "react";
import {
  HSLAChange,
  HSVAChange
} from "visual/component/Controls/ColorPicker2/types";
import { GlobalMeta } from "visual/component/Options/Type";
import { hexToRgba, isHex } from "visual/utils/color";
import Brizy from "./Brizy";

const DEFAULT_HEX = "#000000";
const DEFAULT_OPACITY = 1;

interface Value {
  hex: string;
  opacity: number;
}

interface ChangeValue extends Value {
  isChanged: "hex" | "opacity";
  isChanging: boolean;
}

export interface Props {
  value: Value;
  onChange?: (v: ChangeValue) => void;
  disableOpacity?: boolean;
}

function ColorPicker2({
  value,
  disableOpacity,
  onChange
}: Props): ReactElement {
  const ref = useRef<Window | null>(null);
  const getContentWindow = (): Window | null => ref.current;

  // use "throttle" from "underscore" instead of our custom hook because custom hook create problems
  // https://github.com/bagrinsergiu/blox-editor/issues/19261
  const throttleOnChange =
    onChange &&
    throttle(onChange, 500, {
      edges: ["trailing"]
    });

  const hex = !isHex(value.hex) ? DEFAULT_HEX : value.hex;
  const opacity = isNaN(Number(value.opacity))
    ? DEFAULT_OPACITY
    : value.opacity;

  const handleChange = (
    value: HSVAChange | HSLAChange,
    meta?: GlobalMeta
  ): void => {
    const { hex = "", rgb, wasChanged } = value;

    const newHex = hex?.toLowerCase();
    throttleOnChange?.({
      hex: newHex,
      opacity: Number(Number(rgb?.a).toFixed(2)),
      isChanged: wasChanged === "opacity" ? "opacity" : "hex",
      isChanging: !!meta?.isChanging
    });
  };

  return (
    <Brizy
      domRef={(r: HTMLDivElement | null): void => {
        if (r) {
          ref.current = r.ownerDocument.defaultView ?? null;
        }
      }}
      color={hexToRgba(hex, opacity)}
      opacity={opacity}
      disableOpacity={disableOpacity}
      contentWindow={getContentWindow}
      onChange={handleChange}
    />
  );
}

export default ColorPicker2;
