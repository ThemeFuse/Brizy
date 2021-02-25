import React from "react";
import classnames from "classnames";
import { mergeIn } from "timm";
import { noop } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import Items from "./items";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import * as toolbarFilterConfig from "./toolbarFilter";
import * as sidebarFilterConfig from "./sidebarFilter";
import defaultValue from "./defaultValue.json";
import { style, styleForFilter } from "./styles";
import { css } from "visual/utils/cssStyle";
import { applyFilter } from "visual/utils/filters";
import { Wrapper } from "../tools/Wrapper";

class ImageGallery extends EditorComponent {
  static get componentId() {
    return "ImageGallery";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: noop
  };

  state = {
    visibleTag: "All"
  };

  handleFilterClick(tag) {
    if (tag !== this.state.visibleTag) {
      this.setState({ visibleTag: tag });
    }
  }

  node = null;

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParentConfig,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.constructor.componentId}_parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);

    this.initIsotope();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.dbValue.items.length !== this.props.dbValue.items.length) {
      this.destroyIsotope();
      this.initIsotope();
    }
  }

  getIsotope = () => {
    return this.isotope;
  };

  handleRef = el => {
    this.node = el;
  };

  handleResizeImage = () => {
    if (this.node && this.isotope) {
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
    const desktopWNoSpacing = meta.desktopWNoSpacing / gridColumn;
    const tabletW = meta.tabletW / tabletGridColumn;
    const tabletWNoSpacing = meta.tabletWNoSpacing / tabletGridColumn;
    const mobileW = meta.mobileW / mobileGridColumn;
    const mobileWNoSpacing = meta.mobileWNoSpacing / mobileGridColumn;

    return Object.assign({}, meta, {
      desktopW: Math.round((desktopW - spacing) * 10) / 10,
      desktopWNoSpacing: Math.round(desktopWNoSpacing),
      tabletW: Math.round(tabletW),
      tabletWNoSpacing: Math.round(tabletWNoSpacing),
      mobileW: Math.round(mobileW),
      mobileWNoSpacing: Math.round(mobileWNoSpacing),
      gallery: {
        inGallery: true,
        enableTags: v.enableTags === "on"
      }
    });
  }

  getTags(tags = "") {
    if (!tags) {
      return [];
    }

    return tags.split(",").reduce((acc, curr) => {
      const tag = curr.trim();
      return tag ? [...acc, tag] : acc;
    }, []);
  }

  renderTags(v, vs, vd) {
    const { filterStyle, items } = v;
    const filterClassName = classnames(
      "brz-image__gallery-filter",
      `brz-image__gallery-filter--${filterStyle}`,
      css(
        `${this.constructor.componentId}-filter`,
        `${this.getId()}-filter`,
        styleForFilter(v, vs, vd)
      )
    );
    const className = classnames(
      "brz-li brz-image__gallery-filter__item",
      `brz-image__gallery-filter__item--${filterStyle}`
    );
    const tags = items.reduce(
      (acc, curr) => {
        const tags = this.getTags(curr.value.tags).filter(
          tag => !acc.includes(tag)
        );

        return acc.concat(tags);
      },
      ["All"]
    );

    const options = tags.map((tag, index) => {
      const tagClassName = tag.replace(/\s/g, "-");

      return (
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarFilterConfig,
            sidebarFilterConfig,
            { allowExtend: false }
          )}
          key={index}
        >
          <li
            className={
              className +
              `${
                this.state.visibleTag === tag
                  ? " brz-image__gallery-filter__item--active"
                  : ""
              }`
            }
            data-filter={tag === "All" ? "*" : tagClassName}
            onClick={() => {
              const iso = this.getIsotope();
              this.handleFilterClick(tag);
              iso.arrange({
                filter: tag === "All" ? "*" : `.${tagClassName}`
              });
            }}
          >
            {tag}
          </li>
        </Toolbar>
      );
    });

    return (
      <div className="brz-image__gallery--filter-wrapper">
        <ul className={`brz-ul ${filterClassName}`}>{options}</ul>
      </div>
    );
  }

  renderForEdit(v, vs, vd) {
    const { lightBox, enableTags } = v;
    const className = classnames(
      "brz-image__gallery-wrapper",
      "brz-d-xs-flex brz-flex-xs-wrap",
      { "brz-image__gallery-lightbox": lightBox === "on" },
      css(
        `${this.constructor.componentId}-gallery`,
        `${this.getId()}-gallery`,
        style(v, vs, vd)
      )
    );
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: this.getMeta(v),
        onResize: this.handleResizeImage
      }
    });

    const tags = v.items.reduce((acc, curr) => {
      const tags = this.getTags(curr.value.tags).filter(
        tag => !acc.includes(tag)
      );
      return acc.concat(tags);
    }, []);

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper
          {...this.makeWrapperProps({ className: "brz-image__gallery" })}
        >
          {enableTags === "on" && tags.length > 0 && this.renderTags(v, vs, vd)}
          <div className={className} ref={this.handleRef}>
            <Items {...itemProps} />
          </div>
        </Wrapper>
      </CustomCSS>
    );
  }

  // Isotope plugin
  getIsotopeLib() {
    return applyFilter("getLibs", {}).Isotope;
  }

  initIsotope() {
    const Isotope = this.getIsotopeLib();

    if (Isotope) {
      this.isotope = new Isotope(this.node, {
        itemSelector: ".brz-image__gallery-item",
        masonry: {
          columnWidth: ".brz-image__gallery-item"
        }
      });
    }
  }

  destroyIsotope() {
    if (this.isotope) {
      this.isotope.destroy();
    }
  }
}

export default ImageGallery;
