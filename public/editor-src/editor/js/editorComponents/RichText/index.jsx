import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import ClickOutside from "visual/component/ClickOutside";
import ListBox from "visual/component/Controls/ListBox";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import HotKeys from "visual/component/HotKeys";
import { getDynamicContentChoices } from "visual/utils/options";
import { getStore } from "visual/redux/store";
import { globalBlocksSelector } from "visual/redux/selectors";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import Quill from "./Quill";
import toolbarConfigFn from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";

class RichText extends EditorComponent {
  static get componentId() {
    return "RichText";
  }

  static defaultValue = defaultValue;

  state = {
    formats: {},
    isToolbarOpened: false,
    prepopulation: null,
    population: null,
    selectionCoords: null
  };

  quillRef = React.createRef();

  toolbarRef = React.createRef();

  componentDidMount() {
    // TODO NEED review and exclude ReactDOM.findDOMNode
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);

    node.addEventListener(
      "click",
      event => (event.toolbarHandled = true),
      false
    );
  }

  handleSelectionChange = (formats, selectionCoords) => {
    const newState = {
      formats
    };

    if (
      this.state.prepopulation !== formats.prepopulation ||
      (selectionCoords && this.state.selectionCoords !== selectionCoords) ||
      formats.population
    ) {
      Object.assign(newState, {
        prepopulation: formats.prepopulation,
        population: formats.population,
        selectionCoords
      });
    }

    this.setState(newState, () => this.toolbarRef.current.show());
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
    this.quillRef.current.format("population", value);
    this.quillRef.current.format("prepopulation", null);
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

  handleToolbarChange = values => {
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
        this.quillRef.current.format(key, value);
      }
    }

    // TODO NEED review and exclude ReactDOM.findDOMNode
    // eslint-disable-next-line react/no-find-dom-node
    if (!ReactDOM.findDOMNode(this).contains(prevActive)) {
      prevActive.focus && prevActive.focus();
    }
  };

  handleKeyDown = () => {};
  handleKeyUp = () => {};

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
          ].data;
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
    const { formats, prepopulation, population, isToolbarOpened } = this.state;
    const { meta = {} } = this.props;
    const { popups } = v;
    const inPopup = Boolean(meta.sectionPopup);
    const inPopup2 = Boolean(meta.sectionPopup2);
    const shortcutsTypes = ["copy", "paste", "delete"];
    const toolbarConfig = toolbarConfigFn(
      {
        ...formats,
        popups: this.tmpPopups || v.popups
      },
      this.handleToolbarChange
    );
    const showPopulationHelper =
      !getCurrentTooltip() && (prepopulation !== null || population);

    return (
      <React.Fragment>
        <HotKeys
          shortcutsTypes={shortcutsTypes}
          id={this.getId()}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
        >
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarConfig,
                sidebarConfig
              )}
              ref={this.toolbarRef}
              manualControl={true}
              onOpen={this.handleToolbarOpen}
              onClose={this.handleToolbarClose}
            >
              <div className={this.getClassName(v)}>
                <Quill
                  ref={this.quillRef}
                  value={v.text}
                  forceUpdate={!isToolbarOpened}
                  onSelectionChange={this.handleSelectionChange}
                  onTextChange={this.handleTextChange}
                  initDelay={inPopup || inPopup2 || IS_GLOBAL_POPUP ? 1000 : 0}
                />
              </div>
            </Toolbar>
          </CustomCSS>
        </HotKeys>
        {showPopulationHelper && this.renderPopulationHelper()}
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
