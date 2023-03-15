import classNames from "classnames";
import React, { FC, ReactNode, useCallback, useState } from "react";
import ClickOutside from "visual/component/ClickOutside";
import { InputHex } from "visual/component/Controls/InputHex";
import EditorIcon from "visual/component/EditorIcon";
import { EyeDropper } from "visual/component/EyeDropper";
import { OnChange } from "visual/component/Options/Type";
import Config from "visual/global/Config";
import { pipe } from "visual/utils/fp";
import { isStory } from "visual/utils/models";

export type Props = {
  value: string;
  onChange: OnChange<string>;
  children?: ReactNode;
};

export const ColorPickerInputs: FC<Props> = ({ value, onChange, children }) => {
  const [eyeDropperStatus, setEyeDropperStatus] = useState(false);
  const handleDropper = useCallback(
    pipe(onChange, () => setEyeDropperStatus(false)),
    [onChange]
  );
  const onEyeDropClick = useCallback(
    () => !eyeDropperStatus && setEyeDropperStatus(true),
    [eyeDropperStatus]
  );
  const handleOutsideClick = useCallback(() => setEyeDropperStatus(false), []);

  return (
    <div className="brz-ed-control__color-picker-inputs">
      <div className="brz-ed-control__color-picker-inputs__hex-container">
        {isStory(Config.getAll()) ? null : (
          <EditorIcon
            className={classNames(
              "brz-ed-control__color-picker-inputs__eye-dropper",
              {
                "brz-ed-control__color-picker-inputs__eye-dropper--active":
                  eyeDropperStatus
              }
            )}
            icon="eye-dropper"
            onClick={onEyeDropClick}
          />
        )}
        <InputHex value={value} onChange={onChange} />
      </div>
      {eyeDropperStatus && (
        <ClickOutside onClickOutside={handleOutsideClick}>
          <EyeDropper onPick={handleDropper} />
        </ClickOutside>
      )}
      {children}
    </div>
  );
};
