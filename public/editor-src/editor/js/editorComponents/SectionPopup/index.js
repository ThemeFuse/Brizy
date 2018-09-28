import React from "react";
import jQuery from "jquery";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Background from "visual/component-new/Background";
import ContainerBorder from "visual/component-new/ContainerBorder";
import EditorIcon from "visual/component-new/EditorIcon";
import ThemeIcon from "visual/component-new/ThemeIcon";
import SortableZIndex from "visual/component-new/Sortable/SortableZIndex";
import { Roles } from "visual/component-new/Roles";
import { getStore } from "visual/redux/store";
import { updateGlobals } from "visual/redux/actionCreators";
import { uuid } from "visual/utils/uuid";
import { stripIds } from "visual/utils/models";
import {
  wInBoxedPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { CollapsibleToolbar } from "visual/component-new/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as toolbarExtendConfig from "./extendToolbar";
import {
  sectionStyleClassName,
  bgStyleClassName,
  bgStyleCSSVars,
  itemsStyleClassName,
  itemsStyleCSSVars,
  containerStyleClassName,
  containerStyleCSSVars,
  sectionStyleCSSVars
} from "./styles";
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

  state = {
    isOpened: false
  };

  componentDidMount() {
    SectionPopupInstances.set(this.getId(), this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateUpdate = this.state.isOpened !== nextState.isOpened;
    return stateUpdate || this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    SectionPopupInstances.delete(this.getId());
    jQuery("html").removeClass("brz-ow-hidden");
  }

  handleToolbarOpen = () => {
    if (this.containerBorder) {
      this.containerBorder.setActive(true);
    }
  };

  handleToolbarClose = () => {
    if (this.containerBorder) {
      this.containerBorder.setActive(false);
    }
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

    const mobileW = wInMobilePage - borderWidthW;

    return {
      ...meta,
      mobileW,
      desktopW,
      sectionPopup: true
    };
  }

  renderToolbar() {
    const { globalBlockId } = this.props.meta;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig(toolbarConfig, {
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

  renderItems(v) {
    const {
      bgImageSrc,
      bgColorOpacity,
      bgPopulation,
      mobileBgImageSrc,
      mobileBgColorOpacity
    } = v;
    let bgProps = {
      className: bgStyleClassName(v),
      imageSrc: bgImageSrc || bgPopulation,
      colorOpacity: bgColorOpacity,
      mobileImageSrc: mobileBgImageSrc,
      mobileColorOpacity: mobileBgColorOpacity
    };
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfig, {
          allowExtend: false
        }),
        meta: this.getMeta(v),
        inPopup: true
      }
    });

    return (
      <Background {...bgProps}>
        <SortableZIndex zindex={1}>
          <div className={containerStyleClassName(v)}>
            <div className={itemsStyleClassName(v)}>
              <EditorArrayComponent {...itemsProps} />
            </div>
          </div>
        </SortableZIndex>
      </Background>
    );
  }

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`
    ]);

    const styles = {
      ...sectionStyleCSSVars(v),
      ...bgStyleCSSVars(v),
      ...itemsStyleCSSVars(v),
      ...containerStyleCSSVars(v)
    };

    return (
      <div
        id={this.getId()}
        className={sectionStyleClassName(v, this.state)}
        style={styles}
        data-block-id={this.props.blockId}
      >
        <div className="brz-popup__close" onClick={this.handleDropClick}>
          <EditorIcon icon="nc-close-popup" />
        </div>
        <Roles allow={["admin"]} fallbackRender={() => this.renderItems(v)}>
          <ContainerBorder
            ref={el => {
              this.containerBorder = el;
            }}
            borderStyle="none"
            activeBorderStyle="none"
            reactToClick={false}
            showBorders={false}
            path={this.getPath()}
          >
            {this.renderToolbar(v)}
            {this.renderItems(v)}
          </ContainerBorder>
        </Roles>
      </div>
    );
  }

  renderForView(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.mobileBgColorPalette && `${_v.mobileBgColorPalette}__mobileBg`
    ]);

    return (
      <div
        className={sectionStyleClassName(v, this.state)}
        data-brz-popup={this.getId()}
      >
        <div className="brz-popup__close">
          <ThemeIcon name="close-popup" type="editor" />
        </div>
        {this.renderItems(v)}
      </div>
    );
  }

  open() {
    jQuery("html").addClass("brz-ow-hidden");
    this.setState({
      isOpened: true
    });
  }

  close() {
    jQuery("html").removeClass("brz-ow-hidden");
    this.setState({
      isOpened: false
    });
  }

  becomeSaved() {
    const { blockId } = this.props;
    const dbValue = this.getDBValue();
    const store = getStore();
    const { savedBlocks = [] } = store.getState().globals.project;

    store.dispatch(
      updateGlobals("savedBlocks", [
        ...savedBlocks,
        {
          type: "SectionPopup",
          blockId,
          value: dbValue
        }
      ])
    );
  }

  becomeGlobal() {
    const { blockId } = this.props;
    const dbValue = this.getDBValue();
    const store = getStore();
    const { globalBlocks = {} } = store.getState().globals.project;
    const globalBlockId = uuid();

    store.dispatch(
      updateGlobals("globalBlocks", {
        ...globalBlocks,
        [globalBlockId]: {
          type: "SectionPopup",
          blockId,
          value: dbValue
        }
      })
    );

    this.props.onChange(
      {
        type: "GlobalBlock",
        blockId,
        value: {
          _id: this.getId(),
          _blockVisibility: "unlisted",
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
    const store = getStore();
    const { globalBlocks = {} } = store.getState().globals.project;
    const { globalBlockId } = this.props.meta;

    const globalsData = stripIds(globalBlocks[globalBlockId]);
    globalsData.value._id = this.getId();

    this.props.onChange(globalsData, {
      intent: "replace_all",
      idOptions: {
        keepExistingIds: true
      }
    });
  }
}

export default SectionPopup;
