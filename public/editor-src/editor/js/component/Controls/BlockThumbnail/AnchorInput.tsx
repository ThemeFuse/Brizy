import { t } from "visual/utils/i18n";
import EditorIcon from "visual/component/EditorIcon";
import React, { JSX, ChangeEvent, useCallback, useState } from "react";
import { AnchorInputProps } from "./types";

export const AnchorInput = ({
  value,
  onChange,
  id
}: AnchorInputProps): JSX.Element => {
  const [input, setInput] = useState(value);
  const inputID = `anchor-${id}`;

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const newValue = e.target.value;
      setInput(newValue);
      onChange(newValue);
    },
    [setInput, onChange]
  );

  const handleContainerClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className="brz-ed-option__block-thumbnail-anchor"
      onClick={handleContainerClick}
    >
      <span className="brz-span">#</span>
      <input
        className="brz-input"
        type="text"
        autoComplete="off"
        placeholder={t("Block Name")}
        value={input}
        onChange={handleInputChange}
        id={inputID}
      />
      <label className="brz-label" htmlFor={inputID}>
        <EditorIcon icon="nc-pen" />
      </label>
    </div>
  );
};
