import React, { useCallback } from "react";
import { Switch } from "visual/component/Controls/Switch";
import { OptionLabel } from "visual/component/OptionLabel";
import { OptionWrapper } from "visual/component/OptionWrapper";
import { t } from "visual/utils/i18n";
import { FCC } from "visual/utils/react/types";
import { OnChange } from "../types";
import { EffectProps } from "../types/EffectProps";
import { Flip as V } from "../types/Flip";

export const Flip: FCC<EffectProps<V>> = ({ value, onChange }) => {
  const onSwitchChangeFlipHorizontal = useCallback<OnChange<boolean>>(
    (flipHorizontal) => onChange({ ...value, flipHorizontal }),
    [value, onChange]
  );

  const onSwitchChangeFlipVertical = useCallback<OnChange<boolean>>(
    (flipVertical) => onChange({ ...value, flipVertical }),
    [value, onChange]
  );

  return (
    <>
      <OptionWrapper className="brz-ed-option">
        <OptionLabel label={t("Flip Horizontal")} />
        <Switch
          value={value.flipHorizontal}
          onChange={onSwitchChangeFlipHorizontal}
        />
      </OptionWrapper>
      <OptionWrapper className="brz-ed-option">
        <OptionLabel label={t("Flip Vertical")} />
        <Switch
          value={value.flipVertical}
          onChange={onSwitchChangeFlipVertical}
        />
      </OptionWrapper>
    </>
  );
};
