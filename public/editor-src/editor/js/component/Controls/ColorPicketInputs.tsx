import classNames from "classnames";
import React, { ReactNode, useCallback, useState } from "react";
import ClickOutside from "visual/component/ClickOutside";
import { InputHex } from "visual/component/Controls/InputHex";
import EditorIcon from "visual/component/EditorIcon";
import { EyeDropper } from "visual/component/EyeDropper";
import { OnChange } from "visual/component/Options/Type";
import { isStory, useEditorMode } from "visual/providers/EditorModeProvider";
import { Hex } from "visual/utils/color/Hex";

export type Props = {
  value: string;
  onChange: OnChange<Hex>;
  children?: ReactNode;
};

export const ColorPickerInputs = ({
  value,
  onChange,
  children
}: Props): JSX.Element => {
  const [eyeDropperStatus, setEyeDropperStatus] = useState(false);
  const handleDropper = useCallback(
    (hex: Hex) => {
      onChange(hex);
      setEyeDropperStatus(false);
    },
    [onChange]
  );
  const onEyeDropClick = useCallback(
    () => !eyeDropperStatus && setEyeDropperStatus(true),
    [eyeDropperStatus]
  );
  const handleOutsideClick = useCallback(() => {
    setEyeDropperStatus(false);
  }, []);
  const { mode } = useEditorMode();

  return (
    <div className="brz-ed-control__color-picker-inputs">
      <div className="brz-ed-control__color-picker-inputs__hex-container">
        {isStory(mode) ? null : (
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
          {({ ref }) => <EyeDropper onPick={handleDropper} ref={ref} />}
        </ClickOutside>
      )}
      {children}
    </div>
  );
};
