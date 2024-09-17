import React, { useCallback } from "react";
import { RadioGroup2 } from "visual/component/Controls/RadioGroup2";
import { Item } from "visual/component/Controls/RadioGroup2/Item";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { t } from "visual/utils/i18n";
import { FCC } from "visual/utils/react/types";
import { OnChange } from "../types";
import { AnchorPoint as V } from "../types/AnchorPoint";
import { EffectPropsWithAnchor } from "../types/EffectProps";

type XAligns = [
  { value: "left"; icon: "nc-transform-align-left" },
  { value: "center"; icon: "nc-transform-align-middle" },
  { value: "right"; icon: "nc-transform-align-right" }
];

type YAligns = [
  { value: "top"; icon: "nc-transform-align-top" },
  { value: "center"; icon: "nc-transform-align-center" },
  { value: "bottom"; icon: "nc-transform-align-bottom" }
];

const xAligns: XAligns = [
  { value: "left", icon: "nc-transform-align-left" },
  { value: "center", icon: "nc-transform-align-middle" },
  { value: "right", icon: "nc-transform-align-right" }
];

const yAligns: YAligns = [
  { value: "top", icon: "nc-transform-align-top" },
  { value: "center", icon: "nc-transform-align-center" },
  { value: "bottom", icon: "nc-transform-align-bottom" }
];

export const AnchorPoint: FCC<EffectPropsWithAnchor<V>> = ({
  value,
  onChange
}) => {
  const onXChange = useCallback<OnChange<V["x"]>>(
    (x) => onChange({ ...value, x }),
    [value, onChange]
  );
  const onYChange = useCallback<OnChange<V["y"]>>(
    (y) => onChange({ ...value, y }),
    [value, onChange]
  );

  return (
    <>
      <OptionWrapper display="inline" className="brz-ed-option">
        <OptionLabel label={t("X Anchor Point")} />
        <RadioGroup2 onChange={onXChange}>
          {xAligns.map(({ value: x, icon }) => (
            <Item<typeof x>
              key={x}
              icon={icon}
              value={x}
              active={x === value.x}
            />
          ))}
        </RadioGroup2>
      </OptionWrapper>
      <OptionWrapper display="inline" className="brz-ed-option">
        <OptionLabel label={t("Y Anchor Point")} />
        <RadioGroup2 onChange={onYChange}>
          {yAligns.map(({ value: y, icon }) => (
            <Item<typeof y>
              key={y}
              icon={icon}
              value={y}
              active={y === value.y}
            />
          ))}
        </RadioGroup2>
      </OptionWrapper>
    </>
  );
};
