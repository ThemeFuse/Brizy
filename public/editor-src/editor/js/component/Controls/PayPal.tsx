import React, {
  ChangeEventHandler,
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";
import { PromptFrame } from "visual/component/Prompts/common/PromptFrame";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";

export interface Props {
  label: ReactNode;
  onChange: (s: string) => void;
  value: string | undefined;
  onSave: () => Promise<void>;
  onCancel: () => Promise<void>;
}

export const PayPal = ({
  onChange,
  value,
  onCancel,
  onSave,
  label
}: Props): ReactElement | null => {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => onChange(e.target.value),
    [onChange]
  );

  return (
    <PromptFrame
      img={assetUrl("editor/img/paypal-224.jpg")}
      label={label}
      onSave={onSave}
      onCancel={onCancel}
      description={t(
        "Allow Brizy to access your PayPal account via API access"
      )}
    >
      <InputPlaceholder
        value={value ?? ""}
        title={t("API KEY")}
        onChange={handleChange}
        required={true}
      />
    </PromptFrame>
  );
};
