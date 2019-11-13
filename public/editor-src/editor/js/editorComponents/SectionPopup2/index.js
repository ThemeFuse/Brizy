import React from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import ThemeIcon from "visual/component/ThemeIcon";
import EditorIcon from "visual/component/EditorIcon";
import Toolbar, { CollapsibleToolbar } from "visual/component/Toolbar";
import SortableZIndex from "visual/component/Sortable/SortableZIndex";
import { Roles } from "visual/component/Roles";
import HotKeys from "visual/component/HotKeys";
import { uuid } from "visual/utils/uuid";
import { stripIds } from "visual/utils/models";
import {
  wInTabletPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { getStore } from "visual/redux/store";
import { createGlobalBlock, createSavedBlock } from "visual/redux/actions";
import { globalBlocksAssembled2Selector } from "visual/redux/selectors";
import { globalBlocksSelector, triggersSelector } from "visual/redux/selectors";
import Config from "visual/global/Config";
import * as toolbarConfig from "./toolbar";
import { style } from "./styles";
import * as toolbarExtendConfig from "./extendToolbar";
import * as toolbarConfigClose from "./toolbarClose";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";

export let SectionPopup2Instances = new Map();

const { isGlobalPopup: IS_GLOBAL_POPUP } = Config.get("wp") || {};

class SectionPopup2 extends EditorComponent {
  static get componentId() {
    return "SectionPopup2";
  }

  static defaultProps = {
    meta: {},
    onOpen: () => {},
    onClose: () => {}
  };

  static defaultValue = defaultValue;

  // this is a used as a hack to reopen the
  // popup after it is unmounted when switching
  // from Global to normal
  static tmpGlobal = null;

  constructor(...args) {
    super(...args);

    this.instanceKey = this.props.instanceKey || this.getId();

    if (IS_EDITOR) {
      const isOpened =
        this.props.isOpened || SectionPopup2.tmpGlobal === this.getId();

      this.state = { isOpened };

      isOpened && document.documentElement.classList.add("brz-ow-hidden");
      SectionPopup2.tmpGlobal = null;

      this.popupRef = React.createRef();
      this.popupsContainer = document.getElementById("brz-popups");
      this.el = document.createElement("div");
    }
  }

  componentDidMount() {
    this.popupsContainer.appendChild(this.el);
    SectionPopup2Instances.set(this.instanceKey, this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateUpdate = this.state.isOpened !== nextState.isOpened;
    return stateUpdate || this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    this.popupsContainer.removeChild(this.el);
    this.popupsContainer = null;
    this.el = null;

    document.documentElement.classList.remove("brz-ow-hidden");
    SectionPopup2Instances.delete(this.instanceKey);
  }

  handleValueChange(newValue, meta) {
    super.handleValueChange(
      newValue,
      Object.assign(meta, {
        SectionPopup2: {
          dbId: this.getDBValue()._id,
          domId: this.getId(),
          path: this.getPath()
        }
      })
    );
  }

  handleDropClick = () => {
    this.close();
  };
  getMeta(v) {
    const { meta } = this.props;
    const { widthSuffix, width } = v;

    const desktopW =
      widthSuffix === "px" ? width : Math.round((wInFullPage / 100) * width);
    const tabletW = wInTabletPage;
    const mobileW = wInMobilePage;

    return {
      ...meta,
      tabletW,
      mobileW,
      desktopW,
      sectionPopup2: true
    };
  }

  renderToolbar() {
    const { globalBlockId } = this.props.meta;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, {
          allowExtend: false
        })}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
        badge={Boolean(globalBlockId)}
      />
    );
  }

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const { containerClassName } = v;

    const classNameBg = classnames(
      "brz-popup2__inner",
      "brz-d-xs-flex",
      "brz-flex-xs-wrap",
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd)
      )
    );

    const classNameContainer = classnames("brz-container", containerClassName);

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtendConfig, {
          allowExtend: false
        }),
        meta
      }
    });

    const className = classnames(
      "brz-popup2__close",
      IS_PREVIEW
        ? {
            "brz-hidden": v.showCloseButtonAfter
          }
        : {}
    );

    return (
      <Background className={classNameBg} value={v} meta={meta}>
        <SortableZIndex zindex={1}>
          <div className="brz-container__wrap">
            <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfigClose)}>
              <div className={className}>
                <ThemeIcon name="close-popup" type="editor" />
              </div>
            </Toolbar>

            <div className={classNameContainer}>
              <EditorArrayComponent {...itemsProps} />
            </div>
          </div>
        </SortableZIndex>
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    if (!this.state.isOpened) {
      return null;
    }

    const { className, customClassName } = v;
    const id = this.getId();

    const classNamePopup = classnames(
      "brz-popup2",
      "brz-popup2__editor",
      { "brz-popup2--opened": this.state.isOpened },
      className,
      customClassName
    );

    let content = (
      <CustomCSS selectorName={id} css={v.customCSS}>
        <div
          id={id}
          className={classNamePopup}
          data-block-id={this.props.blockId}
        >
          {!IS_GLOBAL_POPUP && (
            <button
              className="brz-popup2__button-go-to-editor"
              onClick={this.handleDropClick}
            >
              <EditorIcon
                icon="nc-arrow-left"
                className="brz-popup2__icon-go-to-editor"
              />
              Go Back
            </button>
          )}
          <Roles
            allow={["admin"]}
            fallbackRender={() => this.renderItems(v, vs, vd)}
          >
            <ContainerBorder showBorder={false} activateOnContentClick={false}>
              {this.renderToolbar()}
              {this.renderItems(v, vs, vd)}
            </ContainerBorder>
          </Roles>
        </div>
      </CustomCSS>
    );

    if (!IS_GLOBAL_POPUP) {
      content = (
        <HotKeys
          keyNames={["esc"]}
          id="key-helper-prompt-esc"
          onKeyUp={this.handleDropClick}
        >
          {content}
        </HotKeys>
      );
    }

    return ReactDOM.createPortal(content, this.el);
  }

  renderForView(v, vs, vd) {
    const { className, customClassName } = v;

    const triggers = triggersSelector(getStore().getState());

    let attr = {};
    if (IS_GLOBAL_POPUP) {
      const encodeIdsList = [
        "scrolling",
        "showing",
        "devices",
        "referrer",
        "loggedIn"
      ];
      const encodeData = data => encodeURIComponent(JSON.stringify(data));
      const decodeData = data => JSON.parse(decodeURIComponent(data));
      const convertString = name =>
        name.replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`);

      attr = triggers.reduce((acc, item) => {
        if (item.active) {
          const convertedKey = `data-${convertString(item.id)}`;
          if (encodeIdsList.includes(item.id)) {
            acc[convertedKey] = acc[convertedKey]
              ? encodeData([...decodeData(acc[convertedKey]), item.value])
              : encodeData([item.value]);
          } else {
            acc[convertedKey] = item.value;
          }
        }

        return acc;
      }, {});
    }

    if (v.scrollPage === "on") {
      attr["data-scroll_page"] = "true";
    }
    if (v.clickOutsideToClose === "on") {
      attr["data-click_outside_to_close"] = "true";
    }
    if (v.showCloseButtonAfter) {
      attr["data-show-close-button-after"] = v.showCloseButtonAfter;
    }

    const classNamePopup = classnames(
      "brz-popup2",
      "brz-popup2__preview",
      {
        "brz-conditions-popup": IS_GLOBAL_POPUP
      },
      className,
      customClassName
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div
          className={classNamePopup}
          data-brz-popup={this.instanceKey}
          {...attr}
        >
          {this.renderItems(v, vs, vd)}
        </div>
      </CustomCSS>
    );
  }

  open() {
    document.documentElement.classList.add("brz-ow-hidden");
    this.props.onOpen();
    this.setState({
      isOpened: true
    });
  }

  close() {
    document.documentElement.classList.remove("brz-ow-hidden");
    this.props.onClose();
    this.setState({
      isOpened: false
    });
  }

  // api
  becomeSaved() {
    const { blockId } = this.props;
    const dbValue = this.getDBValue();
    const dispatch = getStore().dispatch;

    dispatch(
      createSavedBlock({
        id: uuid(),
        data: {
          type: this.constructor.componentId,
          blockId,
          value: dbValue
        },
        meta: {
          sourceBlockId: this.getId()
        }
      })
    );
  }

  becomeGlobal() {
    SectionPopup2.tmpGlobal = this.getId();

    const { blockId, onChange } = this.props;
    const dbValue = this.getDBValue();
    const globalBlockId = uuid();
    const dispatch = getStore().dispatch;

    dispatch(
      createGlobalBlock({
        id: globalBlockId,
        data: {
          type: this.constructor.componentId,
          blockId,
          value: dbValue
        },
        meta: {
          sourceBlockId: this.getId()
        }
      })
    );

    onChange(
      {
        type: "GlobalBlock",
        blockId,
        value: {
          _id: this.getId(),
          globalBlockId
        }
      },
      {
        intent: "replace_all",
        idOptions: {
          keepExistingIds: true
        }
      }
    );
  }

  becomeNormal() {
    SectionPopup2.tmpGlobal = this.getId();

    const {
      meta: { globalBlockId },
      onChange
    } = this.props;
    const globalBlocks = globalBlocksAssembled2Selector(getStore().getState());

    const globalsData = stripIds(globalBlocks[globalBlockId]);
    globalsData.value._id = this.getId();

    onChange(globalsData, {
      intent: "replace_all",
      idOptions: {
        keepExistingIds: true
      }
    });
  }
}

export default SectionPopup2;
