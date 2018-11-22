import React from "react";
import _ from "underscore";
import { mergeIn } from "timm";
import Isotope from "isotope-layout";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Items from "./items";
import * as parentToolbarExtend from "./parentExtendToolbar";
import defaultValue from "./defaultValue.json";
import { styleClassName, styleCSSVars } from "./styles";

class ImageGallery extends EditorComponent {
  static get componentId() {
    return "ImageGallery";
  }

  static defaultValue = defaultValue;

  node = null;

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig(parentToolbarExtend, {
      allowExtend: false
    });
    this.props.extendParentToolbar(toolbarExtend);

    this.initIsotope();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.dbValue.items.length !== this.props.dbValue.items.length) {
      this.destroyIsotope();
      this.initIsotope();
    }
  }

  handleRef = el => {
    this.node = el;
  };

  handleResizeImage = () => {
    if (this.node) {
      this.isotope.layout();
    }
  };

  handleValueChange(newValue, meta) {
    if (meta.patch.lightBox) {
      const { lightBox } = newValue;
      const items = newValue.items.map(el =>
        mergeIn(el, ["value"], {
          linkType: lightBox === "on" ? "lightBox" : "external",
          linkLightBox: lightBox
        })
      );

      newValue = mergeIn(newValue, ["items"], items);
    }

    super.handleValueChange(newValue, meta);
  }

  getMeta(v) {
    const { meta } = this.props;
    const { spacing, gridColumn, tabletGridColumn, mobileGridColumn } = v;
    const desktopW = meta.desktopW / gridColumn;
    const tabletW = meta.tabletW / tabletGridColumn;
    const mobileW = meta.mobileW / mobileGridColumn;

    return Object.assign({}, meta, {
      desktopW: Math.round((desktopW - spacing) * 10) / 10,
      tabletW: Math.round(tabletW),
      mobileW: Math.round(mobileW),
      inGallery: true
    });
  }

  renderForEdit(v) {
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: this.getMeta(v),
        onResize: this.handleResizeImage
      }
    });

    return (
      <div
        ref={this.handleRef}
        className={styleClassName(v)}
        style={styleCSSVars(v)}
      >
        <Items {...itemProps} />
      </div>
    );
  }

  initIsotope() {
    this.isotope = new Isotope(this.node, {
      itemSelector: ".brz-image__gallery-item",
      masonry: {
        columnWidth: ".brz-image__gallery-item"
      }
    });
  }

  destroyIsotope() {
    this.isotope.destroy();
  }
}

export default ImageGallery;
