import React from "react";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import EditorIcon from "visual/component/EditorIcon";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { updateUI } from "visual/redux/actions2";
import { getStore } from "visual/redux/store";
import { getFontStyles } from "visual/utils/fonts";
import Select from "./Select";

class FontStyle extends Select {
  handleSidebarOpen() {
    getStore().dispatch(
      updateUI("leftSidebar", {
        isOpen: true,
        drawerContentType: LeftSidebarOptionsIds.globalStyle
      })
    );
  }

  renderChoices() {
    return [{ id: "", title: "Custom" }, ...getFontStyles()].map(
      ({ id, title }) => (
        <SelectItem key={id} value={id}>
          {title}
        </SelectItem>
      )
    );
  }

  renderAfterSelect() {
    return (
      <div
        className="brz-ed-option__select__after"
        onClick={this.handleSidebarOpen}
      >
        <EditorIcon icon="nc-cog" />
      </div>
    );
  }
}

export default FontStyle;
