import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import ClickOutside from "visual/component/ClickOutside";
import ListBox from "visual/component/Controls/ListBox";
import HotKeys from "visual/component/HotKeys";
import { getDynamicContentChoices } from "visual/utils/options";
import { getStore } from "visual/redux/store";
import { globalBlocksSelector } from "visual/redux/selectors";
import Quill from "./Quill";
import toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";

class RichText extends EditorComponent {
  static get componentId() {
    return "RichText";
  }

  static defaultValue = defaultValue;

  state = {
    isToolbarOpened: false,
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
    let popups;

    // making use of the popups hack
    if (this.tmpPopups) {
      popups = this.tmpPopups;
      this.tmpPopups = null;
    }

    this.patchValue({
      text,
      ...(popups ? { popups } : {})
    });
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
    this.setState({ isToolbarOpened: true });
  };

  handleToolbarClose = () => {
    this.setState({ isToolbarOpened: false });
  };

  handleKeyDown(e, { keyName, id }) {}
  handleKeyUp() {}

  getToolbarProps = () => {
    const v = this.getValue();
    const onChange = values => {
      // after Quill applies formatting it steals the focus to itself,
      // we try to fight back by remembering the previous focused element
      // and restoring it's focus after Quill steals it
      const prevActive = document.activeElement;

      // this is a hack to somehow make RichText be able to save
      // popups inside it's value
      if (values.popups) {
        this.tmpPopups = values.popups;
      }

      for (const [key, value] of Object.entries(values)) {
        if (key !== "popups") {
          this.quill.format(key, value);
        }
      }

      if (!ReactDOM.findDOMNode(this).contains(prevActive)) {
        prevActive.focus && prevActive.focus();
      }
    };

    return {
      node: ReactDOM.findDOMNode(this),
      offsetTop: 14,
      ...this.makeToolbarPropsFromConfig(
        toolbarConfig(
          { ...this.formats, popups: this.tmpPopups || v.popups },
          onChange
        )
      ),
      onMouseEnter: this.props.onToolbarEnter,
      onMouseLeave: this.props.onToolbarLeave,
      onOpen: this.handleToolbarOpen,
      onClose: this.handleToolbarClose
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

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let isGlobal = false;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          itemData = globalBlocksSelector(getStore().getState())[
            itemData.value.globalBlockId
          ];
          isGlobal = true;
        }

        const {
          blockId,
          value: { popupId }
        } = itemData;

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : isGlobal
            ? `global_${popupId}`
            : popupId
        };
      }
    });

    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v) {
    const { prepopulation, population, isToolbarOpened } = this.state;
    const { meta = {} } = this.props;
    const { popups } = v;
    const inPopup = Boolean(meta.sectionPopup);
    const shortcutsTypes = ["copy", "paste", "delete"];

    return (
      <React.Fragment>
        <HotKeys
          shortcutsTypes={shortcutsTypes}
          id={this.getId()}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
        >
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <Toolbar ref={this.handleToolbarRef} manualControl={true}>
              <div className={this.getClassName(v)}>
                <Quill
                  ref={this.handleQuillRef}
                  value={v.text}
                  forceUpdate={!isToolbarOpened}
                  onSelectionChange={this.handleSelectionChange}
                  onTextChange={this.handleTextChange}
                  initDelay={inPopup ? 1000 : 0}
                />
              </div>
            </Toolbar>
          </CustomCSS>
        </HotKeys>
        {(prepopulation !== null || population) &&
          this.renderPopulationHelper()}
        {popups.length > 0 && this.renderPopups()}
      </React.Fragment>
    );
  }

  renderForView(v) {
    const { popups } = v;

    return (
      <Fragment>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div
            className={this.getClassName(v)}
            dangerouslySetInnerHTML={{ __html: v.text }}
          />
        </CustomCSS>
        {popups.length > 0 && this.renderPopups()}
      </Fragment>
    );
  }
}

export default RichText;
