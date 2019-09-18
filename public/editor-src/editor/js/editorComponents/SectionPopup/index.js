import React from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import ThemeIcon from "visual/component/ThemeIcon";
import { CollapsibleToolbar } from "visual/component/Toolbar";
import SortableZIndex from "visual/component/Sortable/SortableZIndex";
import { Roles } from "visual/component/Roles";
import { uuid } from "visual/utils/uuid";
import { stripIds } from "visual/utils/models";
import {
  wInBoxedPage,
  wInTabletPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { getStore } from "visual/redux/store";
import { createGlobalBlock, createSavedBlock } from "visual/redux/actions";
import { globalBlocksAssembled2Selector } from "visual/redux/selectors";
import * as toolbarConfig from "./toolbar";
import * as toolbarExtendConfig from "./extendToolbar";
import {
  styleCloseButton,
  styleBg,
  styleContainer,
  styleContainerWrap
} from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";

export let SectionPopupInstances = new Map();

class SectionPopup extends EditorComponent {
  static get componentId() {
    return "SectionPopup";
  }

  static defaultProps = {
    meta: {}
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
      this.state = {
        isOpened: SectionPopup.tmpGlobal === this.getId()
      };
      SectionPopup.tmpGlobal = null;

      this.mounted = false;
      this.popupRef = React.createRef();
      this.containerBorderRef = React.createRef();
      this.popupsContainer = document.getElementById("brz-popups");
      this.el = document.createElement("div");
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.popupsContainer.appendChild(this.el);
    SectionPopupInstances.set(this.instanceKey, this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateUpdate = this.state.isOpened !== nextState.isOpened;
    return stateUpdate || this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.popupsContainer.removeChild(this.el);
    this.popupsContainer = null;
    this.el = null;

    document.documentElement.classList.remove("brz-ow-hidden");
    SectionPopupInstances.delete(this.instanceKey);
  }

  handleValueChange(newValue, meta) {
    super.handleValueChange(
      newValue,
      Object.assign(meta, {
        SectionPopup: {
          dbId: this.getDBValue()._id,
          domId: this.getId(),
          path: this.getPath()
        }
      })
    );
  }

  handleToolbarOpen = () => {
    if (this.containerBorderRef.current) {
      this.containerBorderRef.current.setActive(true);
    }
  };

  handleToolbarClose = () => {
    if (!this.mounted) {
      return;
    }

    if (this.containerBorderRef.current) {
      this.containerBorderRef.current.setActive(false);
    }

    this.patchValue({
      tabsState: "tabNormal",
      tabsColor: "tabOverlay"
    });
  };

  handleDropClick = () => {
    this.close();
  };

  getMeta(v) {
    const { meta } = this.props;
    const {
      containerSize,
      containerType,
      borderWidthType,
      borderWidth,
      borderLeftWidth,
      borderRightWidth
    } = v;

    const borderWidthW =
      borderWidthType === "grouped"
        ? Number(borderWidth) * 2
        : Number(borderLeftWidth) + Number(borderRightWidth);

    const desktopW =
      containerType === "fullWidth"
        ? wInFullPage - borderWidthW
        : Math.round(
            (wInBoxedPage - borderWidthW) * (containerSize / 100) * 10
          ) / 10;

    const tabletW = wInTabletPage - borderWidthW;
    const mobileW = wInMobilePage - borderWidthW;

    return {
      ...meta,
      tabletW,
      mobileW,
      desktopW,
      sectionPopup: true
    };
  }

  renderToolbar() {
    const { globalBlockId } = this.props.meta;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, {
          allowExtend: false
        })}
        className="brz-ed-collapsible__section brz-ed-collapsible--big"
        animation="rightToLeft"
        badge={Boolean(globalBlockId)}
        onOpen={this.handleToolbarOpen}
        onClose={this.handleToolbarClose}
      />
    );
  }

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const classNameBg = classnames(
      "brz-popup__inner",
      "brz-d-xs-flex",
      "brz-flex-xs-wrap",
      "brz-align-items-xs-center",
      css(
        `${this.constructor.componentId}-Bg`,
        `${this.getId()}-Bg`,
        styleBg(v, vs, vd)
      )
    );
    const classNameContainer = classnames(
      "brz-container",
      v.containerClassName,
      css(
        `${this.constructor.componentId}-container`,
        `${this.getId()}-container`,
        styleContainer(v, vs, vd)
      )
    );
    const classNameContainerWrap = classnames(
      "brz-container__wrap",
      css(
        `${this.constructor.componentId}-containerWrap`,
        `${this.getId()}-containerWrap`,
        styleContainerWrap(v, vs, vd)
      )
    );
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtendConfig, {
          allowExtend: false
        }),
        meta,
        inPopup: true
      }
    });

    return (
      <Background className={classNameBg} value={v} meta={meta}>
        <SortableZIndex zindex={1}>
          <div className={classNameContainerWrap}>
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

    const classNameClose = classnames(
      "brz-popup",
      "brz-popup__editor",
      { "brz-popup--opened": this.state.isOpened },
      className,
      customClassName,
      css(
        `${this.constructor.componentId}-close`,
        `${this.getId()}-close`,
        styleCloseButton(v, vs, vd)
      )
    );

    return ReactDOM.createPortal(
      <CustomCSS selectorName={id} css={v.customCSS}>
        <div
          id={id}
          className={classNameClose}
          data-block-id={this.props.blockId}
        >
          <div className="brz-popup__close" onClick={this.handleDropClick}>
            <ThemeIcon name="close-popup" type="editor" />
          </div>
          <Roles
            allow={["admin"]}
            fallbackRender={() => this.renderItems(v, vs, vd)}
          >
            <ContainerBorder
              ref={this.containerBorderRef}
              borderStyle="none"
              activeBorderStyle="none"
              reactToClick={false}
              showBorders={false}
              path={this.getPath()}
            >
              {this.renderToolbar(v)}
              {this.renderItems(v, vs, vd)}
            </ContainerBorder>
          </Roles>
        </div>
      </CustomCSS>,
      this.el
    );
  }

  renderForView(v, vs, vd) {
    const { className, customClassName } = v;

    const classNameClose = classnames(
      "brz-popup",
      "brz-popup__preview",
      className,
      customClassName,
      css(
        `${this.constructor.componentId}-close`,
        `${this.getId()}-close`,
        styleCloseButton(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={classNameClose} data-brz-popup={this.instanceKey}>
          <div className="brz-popup__close">
            <ThemeIcon name="close-popup" type="editor" />
          </div>
          {this.renderItems(v, vs, vd)}
        </div>
      </CustomCSS>
    );
  }

  open() {
    document.documentElement.classList.add("brz-ow-hidden");
    this.setState({
      isOpened: true
    });
  }

  close() {
    document.documentElement.classList.remove("brz-ow-hidden");
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
    SectionPopup.tmpGlobal = this.getId();

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
    SectionPopup.tmpGlobal = this.getId();

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

export default SectionPopup;
