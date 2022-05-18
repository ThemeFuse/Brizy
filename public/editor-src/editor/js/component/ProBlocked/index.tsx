import React, { ReactElement, MouseEvent, useCallback } from "react";
import classnames from "classnames";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { ThemeIcon } from "visual/component/ThemeIcon";

export interface Props {
  className?: string;
  absolute?: boolean;
  text: string;
  onRemove?: VoidFunction;
}

export const ProBlocked = (props: Props): ReactElement => {
  const { className: _cls, absolute, text, onRemove } = props;
  const className = classnames(
    "brz-element__pro",
    { "brz-element__pro--absolute": absolute },
    _cls
  );

  const handleRemove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      onRemove?.();
    },
    [onRemove]
  );

  return (
    <div className={className}>
      <p className="brz-p brz-element__pro-title">
        <span>{t("Upgrade to PRO to use this")}</span>
        <strong>&nbsp;{text}&nbsp;</strong>
        <span>{t("element")}</span>
      </p>
      {typeof onRemove === "function" && (
        <p className="brz-p brz-element__pro-removed">
          {t("or")}&nbsp;
          <a className="brz-a" href="#" onClick={handleRemove}>
            {t("remove this element")}
          </a>
        </p>
      )}
      <div className="brz-element__pro-lock">
        <ThemeIcon type="editor" name="lock" />
      </div>
      <a
        className="brz-a brz-element__pro-link"
        href={Config.getAll().urls.upgradeToPro}
        rel="noopener noreferrer"
        target="_blank"
      >
        <strong>{t("Get a PRO plan")}</strong>
      </a>
    </div>
  );
};
