import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Background from "visual/component/Background";
import Toolbar from "visual/component/Toolbar";
import ThemeIcon from "visual/component/ThemeIcon";
import { TextEditor } from "visual/component/Controls/TextEditor";
import Items from "./Items";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";
import Animation from "visual/component/Animation";

class Tab extends EditorComponent {
  static get componentId() {
    return "Tab";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  handleLabelChange = labelText => {
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
      bindWithKey: "items",
      className: "brz-tab"
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
                <ThemeIcon name={iconName} type={iconType} />
              )}
              {labelText}
            </div>
          </Toolbar>
        </div>
        <div className="brz-tabs__item--content">
          <Background key="content" className={customClassName} value={v}>
            <Animation
              component={"div"}
              componentProps={{}}
              animationClass={animationClassName}
            >
              <Items {...itemsProps} />
            </Animation>
          </Background>
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
