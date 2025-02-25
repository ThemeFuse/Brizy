import React from "react";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { t } from "visual/utils/i18n";

const toolbarConfig = {
  getItems: () => []
};
const toolbarExtendFilter = (items) =>
  items.filter((item) => item.id === "remove"); // leave only delete

export class NotFound extends EditorComponent {
  static get componentId() {
    return "NotFound";
  }

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
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, null, {
          parentItemsFilter: toolbarExtendFilter
        })}
      >
        {({ ref }) => (
          <div style={style} ref={ref}>
            {t("Could not find")} <b>{componentId}</b> {t("component")}
          </div>
        )}
      </Toolbar>
    );
  }

  renderForView() {
    return null;
  }
}
