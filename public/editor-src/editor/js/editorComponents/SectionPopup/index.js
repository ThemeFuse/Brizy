import classnames from "classnames";
import React from "react";
import ReactDOM from "react-dom";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import { ContextMenuDisabled } from "visual/component/ContextMenu";
import CustomCSS from "visual/component/CustomCSS";
import { Roles } from "visual/component/Roles";
import { currentUserRole } from "visual/component/Roles";
import { SortableZIndex } from "visual/component/Sortable/SortableZIndex";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { CollapsibleToolbar } from "visual/component/Toolbar";
import {
  wInBoxedPage,
  wInFullPage,
  wInMobilePage,
  wInTabletPage
} from "visual/config/columns";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import { deviceModeSelector } from "visual/redux/selectors";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { getContainerW } from "visual/utils/meta";
import { defaultValueValue } from "visual/utils/onChange";
import { attachRefs } from "visual/utils/react";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import defaultValue from "./defaultValue.json";
import { SectionPopupInstances as Instances } from "./instances";
import * as sidebar from "./sidebar";
import { styleCloseButton, styleContainer, styleContainerWrap } from "./styles";
import * as toolbar from "./toolbar";
import * as toolbarExtend from "./toolbarExtend";

/**
 * @deprecated use import {SectionPopupInstances} from "visual/editorComponents/SectionPopup/instances";
 * @type {Map<any, any>}
 */
export let SectionPopupInstances = Instances;

class SectionPopup extends EditorComponent {
  static defaultProps = {
    meta: {},
    onOpen: () => {},
    onClose: () => {}
  };
  static defaultValue = defaultValue;

  constructor(...args) {
    super(...args);

    this.instanceKey = this.props.instanceKey || this.getId();

    if (isEditor(this.props.renderContext)) {
      this.state = {
        isOpened: this.props.isOpened
      };

      this.mounted = false;
      this.popupsContainer = document.getElementById("brz-popups");
      this.el = document.createElement("div");
    }
  }

  static get componentId() {
    return ElementTypes.SectionPopup;
  }

  componentDidMount() {
    this.mounted = true;
    Instances.set(this.instanceKey, this);

    if (this.popupsContainer) {
      this.popupsContainer.appendChild(this.el);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateUpdate = this.state.isOpened !== nextState.isOpened;
    return stateUpdate || this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    this.mounted = false;
    document.documentElement.classList.remove("brz-ow-hidden");
    Instances.delete(this.instanceKey);

    if (this.popupsContainer) {
      this.popupsContainer.removeChild(this.el);
      this.popupsContainer = null;
      this.el = null;
    }
  }

  handleValueChange(newValue, meta) {
    super.handleValueChange(
      newValue,
      Object.assign(meta, {
        SectionPopup: {
          dbId: this.getDBValue()._id,
          domId: this.getId()
        }
      })
    );
  }

  handleDropClick = () => {
    this.close();
  };

  dvv = (key, device) => {
    const v = this.getValue();
    return defaultValueValue({ v, key, device });
  };

  getMeta(v) {
    const { meta } = this.props;

    const device = deviceModeSelector(this.getReduxState());
    const containerType = this.dvv("containerType", device);

    const size = this.dvv("containerSize", DESKTOP);
    const tabletSize = this.dvv("containerSize", TABLET);
    const mobileSize = this.dvv("containerSize", MOBILE);

    const { w: desktopW, wNoSpacing: desktopWNoSpacing } = getContainerW({
      v,
      w: containerType === "fullWidth" ? wInFullPage : wInBoxedPage,
      wNoSpacing: containerType === "fullWidth" ? wInFullPage : wInBoxedPage,
      width: size,
      device: "desktop"
    });
    const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getContainerW({
      v,
      w: wInTabletPage,
      wNoSpacing: wInTabletPage,
      width: tabletSize,
      device: "tablet"
    });
    const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getContainerW({
      v,
      w: wInMobilePage,
      wNoSpacing: wInMobilePage,
      width: mobileSize,
      device: "mobile"
    });

    return {
      ...meta,
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing,
      sectionPopup: true
    };
  }

  renderToolbar() {
    const { globalBlockId } = this.props.meta;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbar, sidebar, {
          allowExtend: false,
          allowExtendFromThirdParty: true
        })}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
        global={!!globalBlockId}
      />
    );
  }

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const classNameContainer = classnames(
      "brz-container",
      v.containerClassName,
      this.css(
        `${this.getComponentId()}-container`,
        `${this.getId()}-container`,
        styleContainer({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    const classNameContainerWrap = classnames(
      "brz-container__wrap",
      this.css(
        `${this.getComponentId()}-containerWrap`,
        `${this.getId()}-containerWrap`,
        styleContainerWrap({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend, null, {
          allowExtend: false
        }),
        meta,
        inPopup: true
      }
    });

    return (
      <Background value={v} meta={meta}>
        <SortableZIndex zIndex={1} renderContext={this.props.renderContext}>
          <div className={classNameContainerWrap}>
            <div className={classNameContainer}>
              <ContextMenuDisabled>
                <EditorArrayComponent {...itemsProps} />
              </ContextMenuDisabled>
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
    const { className: _className, blockId } = this.props;

    const classNameClose = classnames(
      "brz-popup",
      "brz-popup__editor",
      { "brz-popup--opened": this.state.isOpened },
      _className,
      className,
      customClassName,
      this.css(
        `${this.getComponentId()}-close`,
        `${this.getId()}-close`,
        styleCloseButton({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return ReactDOM.createPortal(
      <ContainerBorder
        type="popup"
        hiddenInResponsive={true}
        activateOnContentClick={false}
      >
        {({ ref: containerBorderRef, attr: containerBorderAttr }) => (
          <CustomCSS selectorName={id} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <div
                ref={(el) => attachRefs(el, [containerBorderRef, cssRef])}
                id={id}
                className={classNameClose}
                {...makeDataAttr({ name: "block-id", value: blockId })}
                {...containerBorderAttr}
              >
                <div
                  className="brz-popup__close"
                  onClick={this.handleDropClick}
                >
                  <ThemeIcon name="close-popup" type="editor" />
                </div>
                <Roles
                  currentRole={currentUserRole(this.getGlobalConfig())}
                  allow={["admin"]}
                  fallbackRender={() => this.renderItems(v, vs, vd)}
                >
                  {this.renderToolbar()}
                  {this.renderItems(v, vs, vd)}
                </Roles>
              </div>
            )}
          </CustomCSS>
        )}
      </ContainerBorder>,
      this.el
    );
  }

  renderForView(v, vs, vd) {
    const { className, customClassName, customCSS, popupId } = v;
    const { className: _className } = this.props;
    const classNameClose = classnames(
      "brz-popup",
      "brz-popup__preview",
      _className,
      className,
      customClassName,
      this.css(
        `${this.getComponentId()}-close`,
        `${this.getId()}-close`,
        styleCloseButton({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div
          className={classNameClose}
          id={popupId}
          {...makeDataAttr({ name: "popup", value: popupId })}
        >
          <div className="brz-popup__close">
            <ThemeIcon name="close-popup" type="editor" />
          </div>
          {this.renderItems(v, vs, vd)}
        </div>
      </CustomCSS>
    );
  }

  open = () => {
    document.documentElement.classList.add("brz-ow-hidden");
    this.props.onOpen();
    this.setState({
      isOpened: true
    });
  };

  close = () => {
    document.documentElement.classList.remove("brz-ow-hidden");
    this.props.onClose();
    this.setState({
      isOpened: false
    });
  };
}

export default SectionPopup;
