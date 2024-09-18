import { DangerouslySetHtmlContent } from "@brizy/component/src/common/components/DangerouslySetHtmlContent";
import classnames from "classnames";
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
    const { iconName, iconType, iconFilename, labelText } = v;
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
              <ThemeIcon
                name={iconName}
                type={iconType}
                filename={iconFilename}
              />
            )}
            <TextEditor value={labelText} onChange={this.handleLabelChange} />
          </div>
        </Toolbar>
      </li>
    );
  }

  renderContent(v) {
    const { labelText, iconName, iconType, iconFilename } = v;
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

    return (
      <div className={className}>
        <div className={labelClassName} onClick={onChangeNav}>
          <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
            <div className={classnames("brz-tabs__nav--button")}>
              {iconName && iconType && (
                <ThemeIcon
                  name={iconName}
                  type={iconType}
                  filename={iconFilename}
                />
              )}
              <DangerouslySetHtmlContent
                tagName={"span"}
                html={labelText}
                ssr={IS_PREVIEW}
              />
            </div>
          </Toolbar>
        </div>
        <Animation
          iterationCount={
            IS_PREVIEW && (meta.sectionPopup || meta.sectionPopup2)
              ? Infinity
              : 1
          }
          component={"div"}
          componentProps={{
            className:
              "brz-tabs__item--content brz-d-xs-flex brz-flex-xs-column"
          }}
          animationClass={animationClassName}
        >
          <Items {...itemsProps} />
        </Animation>
      </div>
    );
  }

  renderForEdit(v) {
    const { renderType } = this.props;

    return renderType === "content" ? this.renderContent(v) : this.renderNav(v);
  }
}

export default Tab;
