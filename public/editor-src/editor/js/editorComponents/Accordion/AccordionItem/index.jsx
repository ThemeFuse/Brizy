import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import { TextEditor } from "visual/component/Controls/TextEditor";
import ItemItems from "./Items";
import defaultValue from "./defaultValue.json";
import * as toolbar from "./toolbar";
import * as sidebar from "./sidebar";
import ThemeIcon from "visual/component/ThemeIcon";
import classnames from "classnames";
import Animation from "visual/component/Animation";

class AccordionItem extends EditorComponent {
  static get componentId() {
    return "AccordionItem";
  }

  static defaultProps = {
    meta: {}
  };

  state = {
    isActive: false
  };

  handleClick = () => {
    this.setState({
      isActive: !this.state.isActive
    });
  };

  static defaultValue = defaultValue;

  handleTextChange = labelText => {
    this.patchValue({ labelText });
  };

  getIcon(activeAccordionItem, navIcon) {
    let icon = activeAccordionItem
      ? `up-arrow-${navIcon}`
      : `down-arrow-${navIcon}`;
    return IS_EDITOR ? (
      <div className="brz-accordion--icon-wrapper">
        <ThemeIcon
          className="brz-accordion__nav--icon"
          type="editor"
          name={icon}
        />
      </div>
    ) : (
      <div className="brz-accordion--icon-wrapper">
        <ThemeIcon
          className="brz-accordion__nav--previewIcon--active"
          type="editor"
          name={`up-arrow-${navIcon}`}
        />
        <ThemeIcon
          className="brz-accordion__nav--previewIcon"
          type="editor"
          name={`down-arrow-${navIcon}`}
        />
      </div>
    );
  }

  renderForEdit(v) {
    const {
      className,
      meta,
      handleAccordion,
      activeAccordionItem,
      navIcon,
      collapsible,
      visibleTag,
      tag,
      animationClassName
    } = this.props;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: "brz-accordion--sortable",
      meta
    });

    if (collapsible === "off") {
      let cls = classnames("brz-accordion__item", tag, {
        "brz-accordion__item--active": this.state.isActive,
        "brz-accordion__hidden": !(
          visibleTag === "All" || tag.includes(visibleTag)
        )
      });
      return (
        <div className={cls}>
          <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
            <div
              className="brz-accordion__nav"
              data-collapsible={collapsible}
              onClick={this.handleClick}
            >
              <TextEditor
                value={v.labelText}
                onChange={this.handleTextChange}
              />
              {navIcon !== "none" && this.getIcon(this.state.isActive, navIcon)}
            </div>
          </Toolbar>
          <Animation
            component={"div"}
            componentProps={{ className: "brz-accordion__content" }}
            animationClass={animationClassName}
          >
            <ItemItems {...itemsProps} />
          </Animation>
        </div>
      );
    }

    return (
      <div className={className}>
        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
          <div
            className="brz-accordion__nav"
            onClick={handleAccordion}
            data-collapsible={collapsible}
          >
            <TextEditor value={v.labelText} onChange={this.handleTextChange} />
            {navIcon !== "none" && this.getIcon(activeAccordionItem, navIcon)}
          </div>
        </Toolbar>
        <Animation
          component={"div"}
          componentProps={{ className: "brz-accordion__content" }}
          animationClass={animationClassName}
        >
          <ItemItems {...itemsProps} />
        </Animation>
      </div>
    );
  }
}

export default AccordionItem;
