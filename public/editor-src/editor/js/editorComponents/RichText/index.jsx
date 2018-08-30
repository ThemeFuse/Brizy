import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import classNames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component-new/Toolbar";
import ClickOutside from "visual/component-new/ClickOutside";
import ListBox from "visual/component/controls/ListBox";
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

  handleSelectionChange = ({ prepopulation, population }, selectionCoords) => {
    this.toolbar.show({
      getProps: this.getToolbarProps
    });

    if (
      this.state.prepopulation !== prepopulation ||
      (selectionCoords && this.state.selectionCoords !== selectionCoords) ||
      population
    ) {
      this.setState({ prepopulation, population, selectionCoords });
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

    // remove first symbol - #
    const re = new RegExp(currentPattern.substr(1), "i");
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
    const { prepopulation, population } = this.state;
    const {
      meta: { globalBlockId: isGlobalBlock },
      onToolbarEnter,
      onToolbarLeave
    } = this.props;
    const { historyTravelling } = this.getReduxState();

    return (
      <React.Fragment>
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
