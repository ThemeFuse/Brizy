import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import * as toolbarExtendConfigIcon from "./extendToolbarIcon";
import * as toolbarExtendConfigText from "./extendToolbarText";
import * as toolbarExtendConfigButton from "./extendToolbarButton";
import { styleClassName, styleCSSVars } from "./styles";
import defaultValue from "./defaultValue.json";
import * as parentToolbarExtend from "./parentExtendToolbar";

const ICON_ITEM_INDEX = 0;
const TEXT_ITEM_INDEX = 1;
const BUTTONS_ITEM_INDEX = 2;

class IconText extends EditorComponent {
  static get componentId() {
    return "IconText";
  }

  static defaultValue = defaultValue;

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig(parentToolbarExtend, {
      allowExtend: false,
      filterExtendName: `${this.constructor.componentId}_parent`
    });
    this.props.extendParentToolbar(toolbarExtend);
  }

  renderForEdit(v) {
    const { onToolbarEnter, onToolbarLeave } = this.props;

    const meta = { ...this.props.meta, inIconText: true };

    const iconProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: ICON_ITEM_INDEX,
      sliceEndIndex: TEXT_ITEM_INDEX,
      itemProps: {
        meta,
        toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfigIcon),
        onToolbarEnter,
        onToolbarLeave
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
              toolbarExtend: this.makeToolbarPropsFromConfig(
                toolbarExtendConfigText,
                {
                  allowExtend: false
                }
              ),
              onToolbarEnter,
              onToolbarLeave
            };
            break;
          case BUTTONS_ITEM_INDEX:
            props = {
              className: "brz-ed-dd-cancel",
              meta,
              toolbarExtend: this.makeToolbarPropsFromConfig(
                toolbarExtendConfigButton
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

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={styleClassName(v)} style={styleCSSVars(v)}>
          {icon}
          <div className="brz-text-btn">{textAndButtons}</div>
        </div>
      </CustomCSS>
    );
  }
}

export default IconText;
