import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import PaddingResizer from "visual/component/PaddingResizer";
import SortableZIndex from "visual/component/Sortable/SortableZIndex";
import SectionMegaMenuItems from "./items";
import {
  wInBoxedPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
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

class SectionMegaMenu extends EditorComponent {
  static get componentId() {
    return "SectionMegaMenu";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

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

    const mobileW = wInMobilePage - borderWidthW;

    return {
      ...meta,
      mobileW,
      desktopW
    };
  }

  renderToolbar(_v) {
    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig(toolbarConfig)}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
      />
    );
  }

  renderItems(v) {
    const meta = this.getMeta(v);
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: itemsStyleClassName(v),
      meta
    });

    return (
      <Background className={bgStyleClassName(v)} value={v} meta={meta}>
        <PaddingResizer value={v} onChange={this.handlePaddingResizerChange}>
          <div className={containerStyleClassName(v)}>
            <SectionMegaMenuItems {...itemsProps} />
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
      <SortableZIndex zindex={1}>
        <div className={sectionStyleClassName(v)} style={styles}>
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
        </div>
      </SortableZIndex>
    );
  }

  renderForView(v) {
    return (
      <div id={this.getId()} className={sectionStyleClassName(v)}>
        {this.renderItems(v)}
      </div>
    );
  }
}

export default SectionMegaMenu;
