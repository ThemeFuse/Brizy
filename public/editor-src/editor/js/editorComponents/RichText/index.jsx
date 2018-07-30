import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import classNames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component-new/Toolbar";
import Quill from "./Quill";
import { hexToRgba } from "visual/utils/color";
import toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";

class RichText extends EditorComponent {
  static get componentId() {
    return "RichText";
  }

  static defaultValue = defaultValue;

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);

    node.addEventListener(
      "click",
      event => (event.toolbarHandled = true),
      false
    );
  }

  handleToolbarRef = el => {
    this.toolbar = el;
  };

  handleQuillRef = el => {
    this.quill = el;
  };

  handleSelectionChange = () => {
    this.toolbar.show({
      getProps: this.getToolbarProps
    });
  };

  handleTextChange = text => {
    this.patchValue({ text });
  };

  getToolbarProps = () => {
    const formats = this.quill.getSelectionFormat();
    const onChange = values => {
      _.forEach(values, (value, type) => this.quill.format(type, value));
    };

    return {
      node: ReactDOM.findDOMNode(this),
      offsetTop: 14,
      ...this.makeToolbarPropsFromConfig(toolbarConfig(formats, onChange))
    };
  };

  getClassName(v) {
    return classNames("brz-rich-text", v.className);
  }

  renderForEdit(v) {
    const {
      meta: { globalBlockId: isGlobalBlock },
      onToolbarEnter,
      onToolbarLeave
    } = this.props;
    const { historyTravelling } = this.getReduxState();

    return (
      <Toolbar
        ref={this.handleToolbarRef}
        manualControl={true}
        onMouseEnter={onToolbarEnter}
        onMouseLeave={onToolbarLeave}
      >
        <div className={this.getClassName(v)}>
          <Quill
            ref={this.handleQuillRef}
            value={v.text}
            forceUpdate={isGlobalBlock || historyTravelling}
            onSelectionChange={this.handleSelectionChange}
            onTextChange={this.handleTextChange}
          />
        </div>
      </Toolbar>
    );
  }

  renderForView(v) {
    return (
      <div
        className={this.getClassName(v)}
        dangerouslySetInnerHTML={{ __html: v.text }}
      />
    );
  }
}

export default RichText;
