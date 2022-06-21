import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Items from "./items";
import defaultValue from "./defaultValue.json";
import { TextEditor } from "visual/component/Controls/TextEditor";
import Toolbar from "visual/component/Toolbar";
import Animation from "visual/component/Animation";
import * as toolbarConfig from "./toolbar";

class SwitcherTab extends EditorComponent {
  static get componentId() {
    return "SwitcherTab";
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
    const { active, onChangeNav } = this.props;
    const className = classnames("brz-switcher__nav--item", {
      "brz-switcher__nav--item--active": active
    });

    return (
      <div className={className} onClick={onChangeNav}>
        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
          <div className="brz-switcher__nav--button">
            {iconName && iconType && (
              <ThemeIcon name={iconName} type={iconType} />
            )}
            <TextEditor value={labelText} onChange={this.handleLabelChange} />
          </div>
        </Toolbar>
      </div>
    );
  }

  renderContent() {
    const {
      meta,
      active,
      animationClassName,
      meta: { sectionPopup, sectionPopup2 }
    } = this.props;
    const className = classnames(
      "brz-switcher__content--tab",
      "brz-flex-xs-column",
      { "brz-switcher__content--tab--active": active }
    );
    const itemsProps = this.makeSubcomponentProps({
      meta,
      bindWithKey: "items",
      className: "brz-d-xs-flex brz-flex-xs-column"
    });

    return (
      <Animation
        iterationCount={
          IS_PREVIEW && (sectionPopup || sectionPopup2) ? Infinity : 1
        }
        component="div"
        componentProps={{ className }}
        animationClass={animationClassName}
      >
        <Items {...itemsProps} />
      </Animation>
    );
  }

  renderForEdit(v) {
    const { renderType } = this.props;

    return renderType === "content" ? this.renderContent(v) : this.renderNav(v);
  }
}

export default SwitcherTab;
