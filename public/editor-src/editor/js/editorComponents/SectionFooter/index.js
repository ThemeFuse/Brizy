import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import SectionFooterItems from "./Items";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import PaddingResizer from "visual/component/PaddingResizer";
import { Roles } from "visual/component/Roles";
import { uuid } from "visual/utils/uuid";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import {
  wInBoxedPage,
  wInTabletPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { createGlobalBlock, createSavedBlock } from "visual/redux/actions";
import { globalBlocksSelector } from "visual/redux/selectors";
import { CollapsibleToolbar } from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import {
  sectionStyleClassName,
  bgStyleClassName,
  bgStyleCSSVars,
  itemsStyleClassName,
  itemsStyleCSSVars,
  containerStyleClassName,
  containerStyleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";

class SectionFooter extends EditorComponent {
  static get componentId() {
    return "SectionFooter";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToolbarOpen = () => {
    if (this.containerBorder) {
      this.containerBorder.setActive(true);
    }
  };

  handleToolbarClose = () => {
    if (!this.mounted) {
      return;
    }

    if (this.containerBorder) {
      this.containerBorder.setActive(false);
    }

    this.patchValue({
      tabsState: "tabNormal",
      tabsCurrentElement: "tabCurrentElement",
      tabsColor: "tabOverlay"
    });
  };

  handlePaddingResizerChange = patch => this.patchValue(patch);

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
      desktopW
    };
  }

  renderToolbar(_v) {
    const { globalBlockId } = this.props.meta;
    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig(toolbarConfig)}
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
      shapeTopType,
      shapeBottomType
    } = v;

    const meta = this.getMeta(v);

    const bgProps = {
      className: bgStyleClassName(v),
      imageSrc: bgImageSrc || bgPopulation,
      colorOpacity: bgColorOpacity,
      shapeTopType: shapeTopType !== "none" && shapeTopType,
      shapeBottomType: shapeBottomType !== "none" && shapeBottomType,
      tabletImageSrc: tabletSyncOnChange(v, "bgImageSrc"),
      tabletColorOpacity: tabletSyncOnChange(v, "bgColorOpacity"),
      mobileImageSrc: mobileSyncOnChange(v, "bgImageSrc"),
      mobileColorOpacity: mobileSyncOnChange(v, "bgColorOpacity")
    };

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: itemsStyleClassName(v),
      meta
    });

    return (
      <Background {...bgProps}>
        <PaddingResizer value={v} onChange={this.handlePaddingResizerChange}>
          <div className={containerStyleClassName(v)}>
            <SectionFooterItems {...itemsProps} />
          </div>
        </PaddingResizer>
      </Background>
    );
  }

  renderForEdit(v) {

    const styles = {
      ...bgStyleCSSVars(v),
      ...itemsStyleCSSVars(v),
      ...containerStyleCSSVars(v)
    };

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <footer
          id={this.getId()}
          className={sectionStyleClassName(v)}
          data-block-id={this.props.blockId}
          style={styles}
        >
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
        </footer>
      </CustomCSS>
    );
  }

  renderForView(v) {

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <footer
          id={v.anchorName || this.getId()}
          className={sectionStyleClassName(v)}
          data-uid={this.getId()}
        >
          {this.renderItems(v)}
        </footer>
      </CustomCSS>
    );
  }

  // api
  becomeSaved() {
    const { blockId, reduxDispatch } = this.props;
    const dbValue = this.getDBValue();

    reduxDispatch(
      createSavedBlock({
        id: uuid(),
        data: {
          type: "SectionFooter",
          blockId,
          value: dbValue
        }
      })
    );
  }

  becomeGlobal() {
    const { blockId, reduxDispatch, onChange } = this.props;
    const dbValue = this.getDBValue();
    const globalBlockId = uuid();

    reduxDispatch(
      createGlobalBlock({
        id: globalBlockId,
        data: {
          type: "SectionFooter",
          blockId,
          value: dbValue
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
      reduxState,
      onChange
    } = this.props;
    const globalBlocks = globalBlocksSelector(reduxState);

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

export default SectionFooter;
