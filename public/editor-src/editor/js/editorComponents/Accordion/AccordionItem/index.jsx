import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import ThemeIcon from "visual/component/ThemeIcon";
import Animation from "visual/component/Animation";
import Toolbar from "visual/component/Toolbar";
import { TextEditor } from "visual/component/Controls/TextEditor";
import ItemItems from "./Items";
import defaultValue from "./defaultValue.json";
import * as toolbar from "./toolbar";
import * as sidebar from "./sidebar";
import { expend, collapse } from "../utils";

class AccordionItem extends EditorComponent {
  static get componentId() {
    return "AccordionItem";
  }
  static defaultValue = defaultValue;

  static defaultProps = {
    meta: {},
    collapsible: "",
    navIcon: "",
    tag: "",
    animDuration: 0,
    animationClassName: "",
    activeAccordionItem: false,
    visibleTag: false
  };

  content = React.createRef();

  state = {
    active: false,
    height: 0
  };

  componentDidMount() {
    const { collapsible, activeAccordionItem } = this.props;

    if (collapsible === "on" && activeAccordionItem) {
      this.handleCollapse();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { collapsible, activeAccordionItem } = this.props;
    const { active } = this.state;

    if (prevProps.collapsible !== collapsible) {
      if (collapsible === "on") {
        if (activeAccordionItem) {
          this.handleCollapse();
        } else {
          this.handleExpend();
        }
      } else {
        this.setState({ active: false });
      }
      return;
    }

    if (prevProps.activeAccordionItem !== activeAccordionItem) {
      if (prevProps.activeAccordionItem) {
        this.handleExpend();
      } else {
        this.handleCollapse();
      }
    }

    if (prevState.active !== active) {
      if (prevState.active) {
        this.handleExpend();
      } else {
        this.handleCollapse();
      }
    }
  }

  handleCollapse = () => {
    const node = this.content.current;

    if (node) {
      const { height } = node.children[0]?.getBoundingClientRect();
      const duration = this.props.animDuration;

      collapse(node, { height, duration: duration * 1000 });
    }
  };

  handleExpend = () => {
    const node = this.content.current;

    if (node) {
      const { height } = node.children[0]?.getBoundingClientRect();
      const duration = this.props.animDuration;

      expend(node, { height, duration: duration * 1000 });
    }
  };

  handleClick = () => {
    const { collapsible, handleAccordion } = this.props;

    if (collapsible === "off") {
      this.setState({
        active: !this.state.active
      });
    } else {
      handleAccordion();
    }
  };

  handleTextChange = labelText => {
    this.patchValue({ labelText });
  };

  getIcon(active, navIcon) {
    const icon = active ? `up-arrow-${navIcon}` : `down-arrow-${navIcon}`;
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

  renderNav(v) {
    const { navIcon, collapsible, activeAccordionItem, tagName } = this.props;
    const activeIcon =
      collapsible === "off" ? this.state.active : activeAccordionItem;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <div
          className="brz-accordion__nav"
          data-collapsible={collapsible}
          onClick={this.handleClick}
        >
          <TextEditor
            value={v.labelText}
            tagName={tagName}
            onChange={this.handleTextChange}
          />
          {navIcon !== "none" && this.getIcon(activeIcon, navIcon)}
        </div>
      </Toolbar>
    );
  }

  renderItems() {
    const {
      meta,
      animationClassName,
      meta: { sectionPopup, sectionPopup2 }
    } = this.props;

    const itemsProps = this.makeSubcomponentProps({
      meta,
      bindWithKey: "items",
      className: "brz-accordion--sortable brz-d-xs-flex brz-flex-xs-column"
    });

    return (
      <Animation
        ref={this.content}
        iterationCount={
          IS_PREVIEW && (sectionPopup || sectionPopup2) ? Infinity : 1
        }
        component={"div"}
        componentProps={{
          className: "brz-accordion__content brz-d-xs-flex brz-flex-xs-column"
        }}
        animationClass={animationClassName}
      >
        <ItemItems {...itemsProps} />
      </Animation>
    );
  }

  renderForEdit(v) {
    const { activeAccordionItem, collapsible, visibleTag, tag } = this.props;
    const active =
      collapsible === "off" ? this.state.active : activeAccordionItem;

    const className = classnames("brz-accordion__item", tag, {
      "brz-accordion__item--active": active,
      "brz-accordion__hidden": !(
        visibleTag === "All" || tag.includes(visibleTag)
      )
    });

    return (
      <div className={className}>
        {this.renderNav(v)}
        {this.renderItems(active)}
      </div>
    );
  }
}

export default AccordionItem;
