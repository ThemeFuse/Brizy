import React, {
  ChangeEventHandler,
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";
import {
  PromptFrame,
  Validator
} from "visual/component/Prompts/common/PromptFrame";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";

export interface Props {
  label: ReactNode;
  onChange: (s: string) => void;
  value: string | undefined;
  config: ConfigCommon;
  onSave: () => Promise<void>;
  onCancel: () => Promise<void>;
  validator: Validator;
}

export const PayPal = ({
  onChange,
  value,
  onCancel,
  onSave,
  label,
  config,
  validator
}: Props): ReactElement | null => {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => onChange(e.target.value),
    [onChange]
  );

  return (
    <PromptFrame
      img={assetUrl("editor/img/paypal-224.jpg", config)}
      label={label}
      value={value}
      onSave={onSave}
      onCancel={onCancel}
      validator={validator}
      description={t("Please add your PayPal email address")}
    >
      <InputPlaceholder
        value={value ?? ""}
        title={t("EMAIL")}
        onChange={handleChange}
        required={true}
      />
    </PromptFrame>
  );
};
