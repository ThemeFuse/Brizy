import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Items from "./items";
import defaultValue from "./defaultValue.json";
import { TextEditor } from "visual/component/Controls/TextEditor";
import Toolbar from "visual/component/Toolbar";
import Animation from "visual/component/Animation";

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
    const { labelText } = v;
    const { active, onChangeNav, toolbarExtend } = this.props;
    const className = classnames("brz-switcher__nav--item", {
      "brz-switcher__nav--item--active": active
    });

    return (
      <Toolbar {...toolbarExtend}>
        <div className={className} onClick={onChangeNav}>
          <TextEditor value={labelText} onChange={this.handleLabelChange} />
        </div>
      </Toolbar>
    );
  }

  renderContent() {
    const { meta, active, animationClassName } = this.props;
    const className = classnames("brz-switcher__content--tab", {
      "brz-switcher__content--tab--active": active
    });
    const itemsProps = this.makeSubcomponentProps({
      meta,
      bindWithKey: "items"
    });

    return (
      <Animation
        component={"div"}
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
