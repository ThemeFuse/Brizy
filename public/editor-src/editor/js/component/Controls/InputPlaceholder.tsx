import React from "react";
import { noop } from "underscore";
import { t } from "visual/utils/i18n";
import EditorIcon from "visual/component/EditorIcon";

type InputPlaceholderProps = {
  type?: string;
  value: string;
  title?: string;
  icon?: string;
  required?: boolean;
  loading?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickIcon?: (e: React.MouseEvent<SVGElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const InputPlaceholder: React.FC<InputPlaceholderProps> = props => {
  const {
    title = "",
    value = "",
    icon = "",
    type = "text",
    required = false,
    loading = false,
    onChange = noop,
    onKeyDown = noop,
    onClickIcon = noop
  } = props;

  return (
    <div className="brz-input__placeholder">
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
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          ) : (
            <EditorIcon icon={icon} onClick={onClickIcon} />
          )}
        </div>
      )}
    </div>
  );
};

export default InputPlaceholder;
