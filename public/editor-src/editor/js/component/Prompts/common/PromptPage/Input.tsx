import React, { ChangeEvent, ReactElement, useCallback } from "react";
import { t } from "visual/utils/i18n";
import { Field } from "visual/component/Prompts/common/PromptPage/Field";

interface Props {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}

export const Input = ({
  value,
  onChange: _onChange,
  placeholder
}: Props): ReactElement => {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => _onChange(e.target.value),
    [_onChange]
  );

  return (
    <Field label={t("Page Title")} required={true}>
      <input
        className="brz-input"
        required
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </Field>
  );
};
