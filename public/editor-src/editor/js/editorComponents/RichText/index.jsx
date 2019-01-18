import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import classNames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import ClickOutside from "visual/component/ClickOutside";
import ListBox from "visual/component/Controls/ListBox";
import { getDynamicContentChoices } from "visual/utils/options";
import Quill from "./Quill";
import toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";

class RichText extends EditorComponent {
  static get componentId() {
    return "RichText";
  }

  static defaultValue = defaultValue;

  state = {
    isActiveToolbar: false,
    prepopulation: null,
    population: null,
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

  handleSelectionChange = (formats, selectionCoords) => {
    this.formats = formats;
    this.toolbar.show({
      getProps: this.getToolbarProps
    });

    if (
      this.state.prepopulation !== formats.prepopulation ||
      (selectionCoords && this.state.selectionCoords !== selectionCoords) ||
      formats.population
    ) {
      this.setState({
        prepopulation: formats.prepopulation,
        population: formats.population,
        selectionCoords
      });
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
      prepopulation: null,
      population: null
    });
  };

  handleToolbarOpen = () => {
    this.setState({ isActiveToolbar: true });
  };

  handleToolbarClose = () => {
    this.setState({ isActiveToolbar: false });
  };

  getToolbarProps = () => {
    const onChange = values => {
      // after Quill applies formatting it steals the focus to itself,
      // we try to fight back by remembering the previous focused element
      // and restoring it's focus after Quill steals it
      const prevActive = document.activeElement;

      _.forEach(values, (value, type) => this.quill.format(type, value));

      if (!ReactDOM.findDOMNode(this).contains(prevActive)) {
        prevActive.focus && prevActive.focus();
      }
    };

    return {
      node: ReactDOM.findDOMNode(this),
      offsetTop: 14,
      ...this.makeToolbarPropsFromConfig(
        toolbarConfig({ ...this.formats }, onChange)
      )
    };
  };

  getClassName(v) {
    return classNames("brz-rich-text", v.className);
  }

  renderPopulationHelper() {
    const {
      prepopulation,
      population,
      selectionCoords: { left, top, height }
    } = this.state;
    let currentPattern = population ? population.label : prepopulation;

    const style = {
      width: "130px",
      left,
      top: top + height
    };
    const choices = getDynamicContentChoices("richText") || [];

    // remove first symbol - # && escape string for use in regexp
    const re = new RegExp(
      currentPattern.substr(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    const filteredChoices = choices.filter(({ title }) => re.test(title));

    const content = (
      <ClickOutside onClickOutside={this.handlePopulationClickOutside}>
        <ListBox
          style={style}
          value={filteredChoices}
          onChange={this.handlePopulationSet}
        />
      </ClickOutside>
    );

    return ReactDOM.createPortal(content, document.body);
  }

  renderForEdit(v) {
    const { prepopulation, population, isActiveToolbar } = this.state;
    const { onToolbarEnter, onToolbarLeave } = this.props;

    return (
      <React.Fragment>
        <Toolbar
          ref={this.handleToolbarRef}
          manualControl={true}
          onMouseEnter={onToolbarEnter}
          onMouseLeave={onToolbarLeave}
          onOpen={this.handleToolbarOpen}
          onClose={this.handleToolbarClose}
        >
          <div className={this.getClassName(v)}>
            <Quill
              ref={this.handleQuillRef}
              value={v.text}
              forceUpdate={!isActiveToolbar}
              onSelectionChange={this.handleSelectionChange}
              onTextChange={this.handleTextChange}
            />
          </div>
        </Toolbar>
        {(prepopulation !== null || population) &&
          this.renderPopulationHelper()}
      </React.Fragment>
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
