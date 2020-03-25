import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";

const toolbarConfig = {
  getItemsForDesktop: () => [],
  getItemsForTablet: () => [],
  getItemsForMobile: () => []
};
const toolbarExtendFilter = items => items.filter(item => item.id === "remove"); // leave only delete

export class NotFound extends EditorComponent {
  static get componentId() {
    return "NotFound";
  }

  static defaultProps = {
    message: t("Missing Element")
  };

  static defaultValue = {};

  renderForEdit() {
    const { componentId } = this.props;
    const style = {
      height: "50px",
      lineHeight: "50px",
      padding: "0 10px",
      backgroundColor: "lightgrey"
    };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig(toolbarConfig, null, {
          parentItemsFilter: toolbarExtendFilter
        })}
      >
        <div style={style}>
          {t("Could not find")} <b>{componentId}</b> {t("component")}
        </div>
      </Toolbar>
    );
  }

  renderForView() {
    return null;
  }
}
