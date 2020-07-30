import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendParentConfig from "./toolbarExtendParent";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import * as toolbarExtendConfig from "./toolbarExtend";
import { calculateMeta } from "./meta";
import { NORMAL } from "visual/utils/stateMode";

const HEAD_ITEM_INDEX = 0;
const ASIDE_ITEM_INDEX = 1;

class Table extends EditorComponent {
  static get componentId() {
    return "Table";
  }
  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  getMeta(v) {
    const { tableAside, rows, columns } = v;
    const { meta } = this.props;
    const { desktopW, tabletW, mobileW } = calculateMeta({
      v,
      meta,
      state: NORMAL
    });

    return {
      ...meta,
      mobileW,
      tabletW,
      desktopW,
      table: {
        rows,
        columns,
        showAside: tableAside === "on"
      }
    };
  }

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParentConfig,
      sidebarExtendParentConfig,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.constructor.componentId}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  renderForEdit(v, vs, vd) {
    const { tableHead } = v;
    const meta = this.getMeta(v);
    const className = classnames(
      "brz-table",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );
    const headProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: HEAD_ITEM_INDEX,
      sliceEndIndex: ASIDE_ITEM_INDEX,
      itemProps: { meta }
    });
    const asideAndBodyProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: ASIDE_ITEM_INDEX,
      itemProps: {
        meta,
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendConfig,
          null,
          { allowExtend: false }
        )
      }
    });

    const head = <EditorArrayComponent {...headProps} />;
    const body = <EditorArrayComponent {...asideAndBodyProps} />;

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <table className={className}>
          {tableHead === "on" && head}
          {body}
        </table>
      </CustomCSS>
    );
  }
}

export default Table;
