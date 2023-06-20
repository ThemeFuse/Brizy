import React, { Component } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar } from "visual/component/Scrollbar";
import { t } from "visual/utils/i18n";

export default class Drawer extends Component {
  static defaultProps = {
    headerText: "",
    withHelpIcon: false
  };

  render() {
    const { headerText, renderExtraHeader, children, withHelpIcon, ...props } =
      this.props;

    return (
      <>
        <div className="brz-ed-sidebar__header">
          <h3 className="brz-h3 brz-ed-sidebar__header__title">{headerText}</h3>
          {withHelpIcon && (
            <span title={t("Help")}>
              <EditorIcon
                icon="nc-alert-circle-que"
                className="brz-icon brz-ed-sidebar__header__help"
              />
            </span>
          )}
          {typeof renderExtraHeader === "function" && renderExtraHeader()}
        </div>
        <div className="brz-ed-sidebar__main">
          {children && (
            <Scrollbar theme="dark">
              {React.cloneElement(children, props)}
            </Scrollbar>
          )}
        </div>
      </>
    );
  }
}
