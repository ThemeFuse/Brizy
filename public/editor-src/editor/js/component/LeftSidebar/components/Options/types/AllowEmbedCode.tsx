import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { useCallback } from "react";
import { Switch } from "visual/component/Controls/Switch";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { useTranslation } from "visual/providers/I18nProvider";
import { setEmbedCodeConsent } from "visual/utils/elements/embedCode/consentStore";
import { useEmbedCodeConsent } from "visual/utils/elements/embedCode/useEmbedCodeConsent";

export interface Props {
  className?: string;
  icon?: string;
  label?: string;
  title?: string;
}

const AllowEmbedCode = ({
  className: _className,
  icon,
  label,
  title
}: Props): React.JSX.Element => {
  const allowed = useEmbedCodeConsent();
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    if (!allowed) {
      const confirmed = window.confirm(
        t(
          "Please note: with this option enabled, embed code runs directly inside the editor, not just on the published page. Running third-party code in the editor environment carries an extra security risk, so it's off by default — the editor shows a placeholder and the code runs on the published page. We recommend enabling it only if you trust the code being added to your pages."
        )
      );

      if (!confirmed) {
        return;
      }

      setEmbedCodeConsent(true);
      return;
    }

    setEmbedCodeConsent(false);

    ToastNotification.warn(
      t(
        "Embed code is no longer running in the editor. Code that already ran may still be active — reload the page to fully stop it."
      ),
      6
    );
  }, [allowed, t]);

  const className = classnames(
    "brz-ed-sidebar-bottom__option",
    "brz-ed-sidebar__allow-embed-code",
    _className,
    {
      "brz-ed-sidebar__popover__item--active": allowed
    }
  );

  return (
    <div className={className} title={title} onClick={handleClick}>
      {icon && <EditorIcon icon={icon} />}
      {label && <span className="brz-span">{label}</span>}
      {/* The row itself handles the click, the switch only shows the state. */}
      <span className="brz-span brz-ed-sidebar__allow-embed-code__switch">
        <Switch value={allowed} onChange={noop} />
      </span>
    </div>
  );
};

export default AllowEmbedCode;
