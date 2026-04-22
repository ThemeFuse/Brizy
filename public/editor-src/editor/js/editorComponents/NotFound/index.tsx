import React, { type ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

const toolbarConfig = {
  getItems: () => [] as ToolbarItemType[]
};
const toolbarExtendFilter = (items: ToolbarItemType[]): ToolbarItemType[] =>
  items.filter((item) => item.id === "remove"); // leave only delete

interface NotFoundProps {
  componentId: string;
}

export class NotFound extends EditorComponent<ElementModel, NotFoundProps> {
  static get componentId(): string {
    return "NotFound";
  }

  static defaultValue = {};

  renderForEdit(): ReactNode {
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

  renderForView(): ReactNode {
    return null;
  }
}
