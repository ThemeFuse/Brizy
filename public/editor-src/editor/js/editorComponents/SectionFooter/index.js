import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import CustomTag from "visual/component/CustomTag";
import classnames from "classnames";
import SectionFooterItems from "./Items";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import PaddingResizer from "visual/component/PaddingResizer";
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
import { CollapsibleToolbar, ToolbarExtend } from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import {
  styleSection,
  styleBg,
  styleContainer,
  styleContainerWrap
} from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import { getContainerW } from "visual/utils/meta";
import {
  styleElementSectionContainerType,
  styleSizeContainerSize
} from "visual/utils/style2";

class SectionFooter extends EditorComponent {
  static get componentId() {
    return "SectionFooter";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  mounted = false;

  collapsibleToolbarRef = React.createRef();

  componentDidMount() {
    this.mounted = true;
  }

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToolbarClose = () => {
    if (!this.mounted) {
      return;
    }

    this.patchValue({
      tabsState: "tabNormal",
      tabsCurrentElement: "tabCurrentElement",
      tabsColor: "tabOverlay"
    });
  };

  handleToolbarEscape = () => {
    this.collapsibleToolbarRef.current.open();
  };

  handlePaddingResizerChange = patch => this.patchValue(patch);

  getMeta(v) {
    const { meta } = this.props;
    const containerType = styleElementSectionContainerType({ v });
    const size = styleSizeContainerSize({ v, device: "desktop" });
    const tabletSize = styleSizeContainerSize({ v, device: "tablet" });
    const mobileSize = styleSizeContainerSize({ v, device: "mobile" });
    const desktopW = getContainerW({
      v,
      w: containerType === "fullWidth" ? wInFullPage : wInBoxedPage,
      width: size,
      device: "desktop"
    });
    const tabletW = getContainerW({
      v,
      w: wInTabletPage,
      width: tabletSize,
      device: "tablet"
    });
    const mobileW = getContainerW({
      v,
      w: wInMobilePage,
      width: mobileSize,
      device: "mobile"
    });

    return {
      ...meta,
      tabletW,
      mobileW,
      desktopW
    };
  }

  getAttributes = customAttributes => {
    let myAttributes = customAttributes
      .split(" ")
      .join("")
      .split(":")
      .join(" ")
      .split("\n")
      .join(" ");

    let atributesToObj = [];
    let atributesToMas = myAttributes.split(" ");

    for (let i = 0; i < atributesToMas.length; i += 2) {
      atributesToObj[atributesToMas[i]] = atributesToMas[i + 1];
    }

    return Object.assign({}, atributesToObj);
  };

  renderToolbar() {
    const { globalBlockId } = this.props.meta;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.collapsibleToolbarRef}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
        badge={Boolean(globalBlockId)}
        onClose={this.handleToolbarClose}
      />
    );
  }

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const classNameBg = classnames(
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
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
      className: classNameContainer,
      meta
    });

    return (
      <Background className={classNameBg} value={v} meta={meta}>
        <PaddingResizer value={v} onChange={this.handlePaddingResizerChange}>
          <div className={classNameContainerWrap}>
            <SectionFooterItems {...itemsProps} />
          </div>
        </PaddingResizer>
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    const {
      className,
      customClassName,
      cssClassPopulation,
      customAttributes
    } = v;

    const classNameSection = classnames(
      "brz-footer",
      className,
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      css(
        `${this.constructor.componentId}-section`,
        `${this.getId()}-section`,
        styleSection(v, vs, vd)
      )
    );
    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <footer
          id={this.getId()}
          className={classNameSection}
          data-block-id={this.props.blockId}
          {...this.getAttributes(customAttributes)}
        >
          <Roles
            allow={["admin"]}
            fallbackRender={() => this.renderItems(v, vs, vd)}
          >
            <ContainerBorder showBorder={false} activateOnContentClick={false}>
              {this.renderToolbar(v)}
              <ToolbarExtend onEscape={this.handleToolbarEscape}>
                {this.renderItems(v, vs, vd)}
              </ToolbarExtend>
            </ContainerBorder>
          </Roles>
        </footer>
      </CustomCSS>
    );
  }

  renderForView(v, vs, vd) {
    const {
      className,
      tagName,
      customClassName,
      cssIDPopulation,
      cssClassPopulation,
      customAttributes
    } = v;

    const classNameSection = classnames(
      "brz-footer",
      className,
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      css(
        `${this.constructor.componentId}-section`,
        `${this.getId()}-section`,
        styleSection(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <CustomTag
          tagName={tagName}
          id={
            cssIDPopulation === ""
              ? v.anchorName || this.getId()
              : cssIDPopulation
          }
          className={classNameSection}
          data-uid={this.getId()}
          {...this.getAttributes(customAttributes)}
        >
          {this.renderItems(v, vs, vd)}
        </CustomTag>
      </CustomCSS>
    );
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
    const {
      meta: { globalBlockId },
      onChange
    } = this.props;
    const globalBlocks = globalBlocksAssembled2Selector(getStore().getState());

    const globalsData = stripIds(globalBlocks[globalBlockId]).data;
    globalsData.value._id = this.getId();

    onChange(globalsData, {
      intent: "replace_all",
      idOptions: {
        keepExistingIds: true
      }
    });
  }
}

export default SectionFooter;
