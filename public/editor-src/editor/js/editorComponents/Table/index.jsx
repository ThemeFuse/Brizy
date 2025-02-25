import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { NORMAL } from "visual/utils/stateMode";
import defaultValue from "./defaultValue.json";
import { calculateMeta } from "./meta";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import { style } from "./styles";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as toolbarExtendParentConfig from "./toolbarExtendParent";

const HEAD_ITEM_INDEX = 0;
const ASIDE_ITEM_INDEX = 1;

class Table extends EditorComponent {
  static defaultProps = {
    meta: {}
  };
  static defaultValue = defaultValue;

  static get componentId() {
    return "Table";
  }

  getMeta(v) {
    const { tableAside, rows, columns } = v;
    const { meta } = this.props;
    const {
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing
    } = calculateMeta({
      v,
      meta,
      state: NORMAL
    });

    return {
      ...meta,
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing,
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
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  renderForEdit(v, vs, vd) {
    const { tableHead, tableAside, widthType } = v;
    const meta = this.getMeta(v);
    const className = classnames(
      "brz-table",
      { "brz-table__disabled-tableHead": tableHead === "off" },
      { "brz-table__disabled-tableAside": tableAside === "off" },
      { "brz-table__custom--width": widthType === "custom" },
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    const headProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: HEAD_ITEM_INDEX,
      sliceEndIndex: ASIDE_ITEM_INDEX,
      itemProps: {
        meta,
        widthType,
        showHead: tableHead === "on",
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendConfig,
          null,
          { allowExtend: true }
        )
      }
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
        {({ ref: cssRef }) => (
          <table className={className} ref={cssRef}>
            {head}
            {body}
          </table>
        )}
      </CustomCSS>
    );
  }
}

export default Table;
