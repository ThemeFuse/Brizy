import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import ClickOutside from "visual/component/ClickOutside";
import Link from "visual/component/Link";
import ListBox from "visual/component/Controls/ListBox";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import HotKeys from "visual/component/HotKeys";
import {
  getDynamicContentByPlaceholder,
  getDynamicContentChoices
} from "visual/utils/options";
import { getStore } from "visual/redux/store";
import { blocksDataSelector } from "visual/redux/selectors";
import { IS_GLOBAL_POPUP, IS_STORY } from "visual/utils/models";
import Quill from "./Quill";
import toolbarConfigFn from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { Wrapper } from "../tools/Wrapper";
import BoxResizer from "visual/component/BoxResizer";
import { css } from "visual/utils/cssStyle";
import { style, styleDC } from "./styles";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

const resizerPoints = ["centerLeft", "centerRight"];

class RichText extends EditorComponent {
  static get componentId() {
    return "RichText";
  }

  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  handleResizerChange = patch => this.patchValue(patch);

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
        prepopulation: formats.prepopulation || null,
        population: formats.population || null,
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
    const dcOption = getDynamicContentByPlaceholder(
      this.context.dynamicContent.config,
      DCTypes.richText,
      value
    );

    if (dcOption) {
      this.quillRef.current.formatPopulation({
        label: dcOption.label,
        display: dcOption.display ?? "inline",
        placeholder: value
      });
    }

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

  handleChange = values => {
    // after Quill applies formatting it steals the focus to itself,
    // we try to fight back by remembering the previous focused element
    // and restoring it's focus after Quill steals it
    const prevActive = document.activeElement;

    // this is a hack to somehow make RichText be able to save
    // popups inside it's value
    if (values.popups) {
      this.tmpPopups = values.popups;
    }

    // TODO NEED review and exclude ReactDOM.findDOMNode
    // eslint-disable-next-line react/no-find-dom-node
    if (!ReactDOM.findDOMNode(this).contains(prevActive)) {
      prevActive.focus && prevActive.focus();
    }

    this.quillRef.current.formatMultiple(values);
  };

  handleKeyDown = () => {};
  handleKeyUp = () => {};

  getClassName(v, vs, vd) {
    const cssDCStyle =
      v.textPopulation &&
      css(
        "dc" + this.constructor.componentId,
        "dc" + this.getId(),
        styleDC(v, vs, vd)
      );

    return classNames(
      "brz-rich-text",
      { notranslate: IS_EDITOR },
      v.className,
      css(this.constructor.componentId, this.getId(), style(v, vs, vd)),
      cssDCStyle
    );
  }

  patchValue(patch, meta) {
    super.patchValue(patch, meta);

    // when we change DC to usual RichText, first Toolbar renders and than Quill.
    // We should send to Toolbar correct v, but we don't know it, because Quill
    // wasn't mounted yet(Quill generate correct v). This way we hide toolbar
    if ("textPopulation" in patch && patch.textPopulation === "") {
      this.toolbarRef.current.hide();
    }
  }

  getValue2() {
    const { v, vs, vd } = super.getValue2();
    if (v.textPopulation) {
      return { v, vs, vd };
    }

    return {
      v: { ...v, ...this.state.formats },
      vs,
      vd
    };
  }

  renderPopulationHelper() {
    const {
      prepopulation,
      population,
      selectionCoords: { left, top, height }
    } = this.state;
    let currentPattern = population ? population.label : prepopulation;

    const style = {
      left,
      width: "130px",
      top: top + height
    };
    const choices =
      getDynamicContentChoices(
        this.context.dynamicContent.config,
        DCTypes.richText
      ) || [];

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
          choices={filteredChoices}
          onChange={this.handlePopulationSet}
        />
      </ClickOutside>
    );

    return ReactDOM.createPortal(content, document.body);
  }

  renderPopups(v) {
    const { popups } = v;

    // we disabled this optimization here, because we know nothing about
    // formats during compilation time, so this condition won't work
    // const { linkType, linkPopup } = this.state.formats;
    // if (popups.length > 0 && linkType !== "popup" && linkPopup !== "") {
    //   return null;
    // }

    const normalizePopups = popups.reduce((acc, popup) => {
      let itemData = popup;

      if (itemData.type === "GlobalBlock") {
        // TODO: some kind of error handling
        itemData = blocksDataSelector(getStore().getState())[
          itemData.value._id
        ];
      }

      return itemData ? [...acc, itemData] : acc;
    }, []);

    if (normalizePopups.length === 0) {
      return null;
    }

    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let {
          blockId,
          value: { popupId }
        } = itemData;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const blockData = blocksDataSelector(getStore().getState())[
            itemData.value._id
          ];

          popupId = blockData.value.popupId;
        }

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : itemData.type === "GlobalBlock"
            ? `global_${popupId}`
            : popupId
        };
      }
    });

    return <EditorArrayComponent {...popupsProps} />;
  }

  renderLink(v) {
    const {
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkExternalType,
      linkPopup,
      linkUpload,
      text
    } = v;

    const hrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload
    };

    let content = (
      <div className="placeholder-is-empty">
        <Placeholder icon="wp-title" />
      </div>
    );

    if (this._dc?.lastCache?.text || IS_PREVIEW) {
      const className = IS_PREVIEW ? "" : "brz-blocked";

      content = <span className={className}>{text}</span>;
    }

    if (hrefs[linkType] !== "") {
      return (
        <Link
          className="brz-ed-content-dc-link"
          type={linkType}
          href={hrefs[linkType]}
          target={linkExternalBlank}
          rel={linkExternalRel}
        >
          {content}
        </Link>
      );
    }

    return content;
  }

  renderForEdit(v, vs, vd) {
    const { prepopulation, population, isToolbarOpened } = this.state;
    const { meta = {} } = this.props;
    const inPopup = Boolean(meta.sectionPopup);
    const inPopup2 = Boolean(meta.sectionPopup2);
    const shortcutsTypes = ["copy", "paste", "delete"];

    const newV = {
      ...v,
      popups: this.tmpPopups || v.popups
    };
    const toolbarConfig = toolbarConfigFn(newV, this.handleChange);

    const showPopulationHelper =
      !getCurrentTooltip() && (prepopulation !== null || population);

    const restrictions = {
      width: {
        "%": {
          min: 5,
          max: 100
        }
      }
    };

    let content = (
      <Quill
        ref={this.quillRef}
        componentId={this.getId()}
        value={v.text}
        forceUpdate={!isToolbarOpened}
        onSelectionChange={this.handleSelectionChange}
        onTextChange={this.handleTextChange}
        initDelay={inPopup || inPopup2 || IS_GLOBAL_POPUP ? 1000 : 0}
      />
    );
    let toolbarOptions = {
      manualControl: true,
      onOpen: this.handleToolbarOpen,
      onClose: this.handleToolbarClose,
      repositionOnUpdates: true
    };
    if (v.textPopulation) {
      toolbarOptions = {};

      content = this.renderLink(v);
    }

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
              {...toolbarOptions}
            >
              <Wrapper
                {...this.makeWrapperProps({
                  className: this.getClassName(v, vs, vd)
                })}
              >
                {IS_STORY ? (
                  <BoxResizer
                    points={resizerPoints}
                    meta={{
                      ...meta,
                      horizontalAlign: "left"
                    }}
                    value={v}
                    onChange={this.handleResizerChange}
                    restrictions={restrictions}
                  >
                    {content}
                  </BoxResizer>
                ) : (
                  content
                )}
              </Wrapper>
            </Toolbar>
          </CustomCSS>
        </HotKeys>
        {showPopulationHelper && this.renderPopulationHelper()}
        {this.renderPopups(v)}
      </React.Fragment>
    );
  }

  getExtraClassNames($elem) {
    const extraClassNames = [];

    if ($elem.is("*[class*='brz-tp__dc-block']")) {
      extraClassNames.push("brz-tp__dc-block");
    }

    if ($elem.is("*[class*='brz-tp__dc-block-st1']")) {
      extraClassNames.push("brz-tp__dc-block-st1");
    }

    return extraClassNames;
  }

  renderForView(v, vs, vd) {
    let content = <Quill value={v.text} />;

    if (v.textPopulation) {
      content = this.renderLink(v);
    }

    return (
      <Fragment>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className: this.getClassName(v, vs, vd)
            })}
          >
            {content}
          </Wrapper>
        </CustomCSS>
        {this.renderPopups(v)}
      </Fragment>
    );
  }
}

export default RichText;
