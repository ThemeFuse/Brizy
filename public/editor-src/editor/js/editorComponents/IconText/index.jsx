import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import classnames from "classnames";
import { noop } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { css } from "visual/utils/cssStyle";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as toolbarExtendIcon from "./toolbarExtendIcon";
import * as sidebarExtendIcon from "./sidebarExtendIcon";
import * as toolbarExtendText from "./toolbarExtendText";
import * as sidebarExtendText from "./sidebarExtendText";
import * as toolbarExtendButton from "./toolbarExtendButton";
import * as sidebarExtendButton from "./sidebarExtendButton";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";

const ICON_ITEM_INDEX = 0;
const TEXT_ITEM_INDEX = 1;
const BUTTONS_ITEM_INDEX = 2;

class IconText extends EditorComponent {
  static get componentId() {
    return "IconText";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: noop
  };

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.constructor.componentId}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  renderForEdit(v, vs, vd) {
    const meta = { ...this.props.meta, inIconText: true };

    const iconProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: ICON_ITEM_INDEX,
      sliceEndIndex: TEXT_ITEM_INDEX,
      itemProps: {
        meta,
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendIcon,
          sidebarExtendIcon,
          {
            allowExtend: false
          }
        )
      }
    });
    const icon = <EditorArrayComponent {...iconProps} />;

    const textAndButtonsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: TEXT_ITEM_INDEX,
      itemProps: (itemData, itemIndex) => {
        let props;
        switch (itemIndex) {
          case TEXT_ITEM_INDEX:
            props = {
              meta,
              toolbarExtend: this.makeToolbarPropsFromConfig2(
                toolbarExtendText,
                sidebarExtendText,
                {
                  allowExtend: false
                }
              )
            };
            break;
          case BUTTONS_ITEM_INDEX:
            props = {
              className: "brz-ed-dd-cancel",
              meta,
              toolbarExtend: this.makeToolbarPropsFromConfig2(
                toolbarExtendButton,
                sidebarExtendButton,
                {
                  allowExtend: false
                }
              ),
              showBorder: false
            };
            break;
          default:
            throw new Error(`IconText unexpected index ${itemIndex}`);
        }

        return props;
      }
    });
    const textAndButtons = <EditorArrayComponent {...textAndButtonsProps} />;

    const className = classnames(
      "brz-icon-text",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={className}>
          {icon}
          <div className="brz-text-btn">{textAndButtons}</div>
        </div>
      </CustomCSS>
    );
  }
}

export default IconText;
