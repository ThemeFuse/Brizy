import classnames from "classnames";
import { DangerouslySetHtmlContent } from "@brizy/component/src/common/components/DangerouslySetHtmlContent";
import React from "react";
import Animation from "visual/component/Animation";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Items from "./Items";
import defaultValue from "./defaultValue.json";
import * as toolbarConfig from "./toolbar";

class Tab extends EditorComponent {
  static get componentId() {
    return "Tab";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  handleLabelChange = (labelText) => {
    this.patchValue({ labelText });
  };

  renderNav(v) {
    const { iconName, iconType, labelText } = v;
    const { active, onChangeNav, action } = this.props;
    const className = classnames("brz-tabs__nav--item brz-tabs__nav--desktop", {
      "brz-tabs__nav--active": active
    });

    return (
      <li
        className={className}
        onClick={action === "click" ? onChangeNav : null}
        onMouseEnter={action === "hover" ? onChangeNav : null}
      >
        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
          <div className={classnames("brz-tabs__nav--button")}>
            {iconName && iconType && (
              <ThemeIcon name={iconName} type={iconType} />
            )}
            <TextEditor value={labelText} onChange={this.handleLabelChange} />
          </div>
        </Toolbar>
      </li>
    );
  }

  renderContent(v) {
    const { labelText, customClassName, iconName, iconType } = v;
    const { active, meta, onChangeNav, animationClassName } = this.props;
    const itemsProps = this.makeSubcomponentProps({
      meta,
      animationClassName,
      bindWithKey: "items",
      className: "brz-tab brz-d-xs-flex brz-flex-xs-column"
    });
    const className = classnames("brz-tabs__items", {
      "brz-tabs__items--active": active
    });
    const labelClassName = classnames("brz-tabs__nav--mobile", {
      "brz-tabs__nav--mobile--active": active
    });
    const contentClassName = classnames(
      "brz-tabs__item--content",
      customClassName
    );

    return (
      <div className={className}>
        <div className={labelClassName} onClick={onChangeNav}>
          <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
            <div className={classnames("brz-tabs__nav--button")}>
              {iconName && iconType && (
                <ThemeIcon name={iconName} type={iconType} />
              )}
              <DangerouslySetHtmlContent
                tagName={"span"}
                html={labelText}
                ssr={IS_PREVIEW}
              />
            </div>
          </Toolbar>
        </div>
        <div className={contentClassName}>
          <Animation
            iterationCount={
              IS_PREVIEW && (meta.sectionPopup || meta.sectionPopup2)
                ? Infinity
                : 1
            }
            component={"div"}
            componentProps={{ className: "brz-d-xs-flex brz-flex-xs-column" }}
            animationClass={animationClassName}
          >
            <Items {...itemsProps} />
          </Animation>
        </div>
      </div>
    );
  }

  renderForEdit(v) {
    const { renderType } = this.props;

    return renderType === "content" ? this.renderContent(v) : this.renderNav(v);
  }
}

export default Tab;
