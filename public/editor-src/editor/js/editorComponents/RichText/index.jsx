import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import classNames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component-new/Toolbar";
import ClickOutside from "visual/component-new/ClickOutside";
import Downshift from "visual/component/controls/Downshift";
import { getDynamicChoices } from "visual/utils/options";
import Quill from "./Quill";
import toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";

class RichText extends EditorComponent {
  static get componentId() {
    return "RichText";
  }

  static defaultValue = defaultValue;

  state = {
    prepopulation: null,
    selectionCoords: null
  };

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

  handleSelectionChange = ({ prepopulation }, selectionCoords) => {
    this.toolbar.show({
      getProps: this.getToolbarProps
    });

    if (
      this.state.prepopulation !== prepopulation ||
      (selectionCoords && this.state.selectionCoords !== selectionCoords)
    ) {
      this.setState({ prepopulation, selectionCoords });
    }
  };

  handleTextChange = text => {
    this.patchValue({ text });
  };

  handlePopulationSet = value => {
    this.quill.format("population", value);
    this.quill.format("prepopulation", null);
  };
  handlePopulationClickOutside = () => {
    this.setState({
      prepopulation: null
    });
  };

  getToolbarProps = () => {
    const formats = this.quill.getSelectionFormat();
    const onChange = values => {
      _.forEach(values, (value, type) => this.quill.format(type, value));
    };

    return {
      node: ReactDOM.findDOMNode(this),
      offsetTop: 14,
      ...this.makeToolbarPropsFromConfig(
        toolbarConfig({ ...formats }, onChange)
      )
    };
  };

  getClassName(v) {
    return classNames("brz-rich-text", v.className);
  }

  renderPopulationHelper() {
    const {
      prepopulation,
      selectionCoords: { left, top, height }
    } = this.state;

    const style = {
      width: "130px",
      left,
      top: top + height
    };
    const choices = getDynamicChoices("richText") || [];

    const filteredChoices = choices.filter(
      ({ title }) =>
        title.toLowerCase().indexOf(prepopulation.toLowerCase()) === 0
    );

    const content = (
      <ClickOutside onClickOutside={this.handlePopulationClickOutside}>
        <Downshift
          style={style}
          value={filteredChoices}
          onChange={this.handlePopulationSet}
        />
      </ClickOutside>
    );

    return ReactDOM.createPortal(content, document.body);
  }

  renderForEdit(v) {
    const { prepopulation } = this.state;
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
          {prepopulation !== null && this.renderPopulationHelper()}
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
