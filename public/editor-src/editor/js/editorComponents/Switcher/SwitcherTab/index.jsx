import classnames from "classnames";
import React from "react";
import Animation from "visual/component/Animation";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isView } from "visual/providers/RenderProvider";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as toolbarConfig from "./toolbar";

class SwitcherTab extends EditorComponent {
  static defaultProps = {
    meta: {}
  };
  static defaultValue = defaultValue;

  static get componentId() {
    return ElementTypes.SwitcherTab;
  }

  handleLabelChange = (labelText) => {
    this.patchValue({ labelText });
  };

  renderNav(v) {
    const { iconName, iconType, iconFilename, labelText } = v;
    const { active, onChangeNav } = this.props;
    const className = classnames("brz-switcher__nav--item", {
      "brz-switcher__nav--item--active": active
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig)}
        selector=".brz-icon-svg,.brz-span"
      >
        {({ ref }) => (
          <div className={className} onClick={onChangeNav} ref={ref}>
            {iconName && iconType && (
              <ThemeIcon
                name={iconName}
                type={iconType}
                filename={iconFilename}
              />
            )}
            <TextEditor value={labelText} onChange={this.handleLabelChange} />
          </div>
        )}
      </Toolbar>
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
          isView(this.props.renderContext) && (sectionPopup || sectionPopup2)
            ? Infinity
            : 1
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
