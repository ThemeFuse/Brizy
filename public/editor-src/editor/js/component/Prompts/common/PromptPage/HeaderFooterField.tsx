import React from "react";
import { Switch } from "visual/component/Controls/Switch";
import { Field } from "visual/component/Prompts/common/PromptPage/Field";
import { t } from "visual/utils/i18n";
import { FCC } from "visual/utils/react/types";

interface Props {
  value: boolean;
  onChange: (s: boolean) => void;
}

export const HeaderFooterField: FCC<Props> = ({ value, onChange }) => (
  <Field
    className="brz-ed-popup-integrations-step__fields-option-header-footer"
    label={t("Theme Header & Footer")}
    required={true}
  >
    <Switch value={value} onChange={onChange} />
  </Field>
);
