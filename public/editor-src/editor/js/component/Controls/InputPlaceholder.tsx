import { noop } from "es-toolkit";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

type InputPlaceholderProps = {
  type?: string;
  value: string;
  title?: string;
  icon?: string;
  required?: boolean;
  loading?: boolean;
  description?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickIcon?: (e: React.MouseEvent<SVGElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const InputPlaceholder = (props: InputPlaceholderProps): JSX.Element => {
  const {
    title = "",
    value = "",
    icon = "",
    type = "text",
    description,
    required = false,
    loading = false,
    onChange = noop,
    onKeyDown = noop,
    onClickIcon = noop
  } = props;

  return (
    <div className="brz-input__placeholder">
      <div className="brz-input__placeholder__control">
        <label className="brz-label">
          <input
            required
            className="brz-input"
            name={title}
            type={type}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <p className="brz-p">
            <strong className="brz-strong">
              {title}
              {required && <span className="brz-span">({t("required")})</span>}
            </strong>
          </p>
        </label>
        {icon && (
          <div className="brz-input__placeholder-icon">
            {loading ? (
              <EditorIcon
                icon="nc-circle-02"
                className="brz-ed-animated--spin"
              />
            ) : (
              <EditorIcon icon={icon} onClick={onClickIcon} />
            )}
          </div>
        )}
      </div>
      {description && (
        <p className="brz-p brz-input__placeholder__description">
          {description}
        </p>
      )}
    </div>
  );
};

export default InputPlaceholder;
