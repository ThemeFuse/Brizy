import classnames from "classnames";
import React, { Fragment, ReactNode } from "react";
import ResizeAware from "react-resize-aware";
import { merge } from "timm";
import _ from "underscore";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent, {
  ComponentsMeta,
  Props as NextProps
} from "visual/editorComponents/EditorComponent";
import { SizeType } from "visual/global/Config/types/configs/common";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import {
  GalleryIsotope,
  GalleryIsotopeType,
  GalleryJustified,
  GalleryJustifiedType
} from "visual/types/global";
import { css } from "visual/utils/cssStyle";
import { applyFilter } from "visual/utils/filters";
import { getImageUrl } from "visual/utils/image";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/reader/number";
import * as Str from "visual/utils/reader/string";
import { MOBILE, TABLET } from "visual/utils/responsiveMode";
import { encodeToString } from "visual/utils/string";
import { MValue } from "visual/utils/value";
import EditorArrayComponent from "../EditorArrayComponent";
import { readSizeType, readUnit } from "../Image/utils";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import {
  patchOnBigImageAsCurrLayout,
  patchOnBigImageAsPrevLayout,
  patchOnBigImageChange,
  patchOnBigImageImagesThumbSizeChange,
  patchOnBigImageLayout,
  patchOnColumnChange,
  patchOnGridAspectRationAndColumnChange,
  patchOnGridItemsChange,
  patchOnGridLayout,
  patchOnJustifiedLayout,
  patchOnLightBox,
  patchOnMasonryLayout,
  patchOnThumbStyleChange
} from "./imageGalleryChange";
import Items from "./items";
import * as sidebarExtendImage from "./sidebarExtendImage";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import * as sidebarFilterConfig from "./sidebarFilter";
import { style, styleBigImage, styleForFilter, styleWrapper } from "./styles";
import * as toolbarExtendImage from "./toolbarExtendImage";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarFilterConfig from "./toolbarFilter";
import type { Meta, Patch, Props, Value } from "./types";
import {
  JustifySettings,
  breakpoints,
  getSpacing,
  imagesSrc,
  makeOptionValueToSettings,
  multiUpload
} from "./utils";
import { arrangeGridByTags } from "./utils.export";

class ImageGallery extends EditorComponent<Value, Props> {
  static get componentId(): "ImageGallery" {
    return "ImageGallery";
  }

  static defaultValue = defaultValue;

  handleAllTagChange = (allTag: string): void => {
    this.patchValue({ allTag });
  };

  static defaultProps = {
    meta: {},
    onToolbarOpen: _.noop,
    onToolbarClose: _.noop,
    onToolbarEnter: _.noop,
    onToolbarLeave: _.noop,
    extendParentToolbar: _.noop
  };

  state = {
    visibleTag: ""
  };

  node: HTMLElement | null = null;
  gallery: GalleryJustified | null = null;
  isotope: GalleryIsotope | null = null;

  handleResize = () => {
    const { layout } = this.getValue();
    if (layout === "justified") {
      const ImagesLoaded = applyFilter("getLibs", {}).ImagesLoaded;

      ImagesLoaded(this.node, () => {
        if (this.gallery) {
          this.gallery.arrange();
        }
      });
    }
  };

  handleFilterClick(tag: string): void {
    if (tag !== this.state.visibleTag) {
      this.setState({ visibleTag: tag });
    }
  }

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParentConfig,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}_parent`
      }
    );

    this.props.extendParentToolbar(toolbarExtend);

    this.initGallery();
  }

  componentDidUpdate(nextProps: NextProps<Value, Props>): void {
    const { items: nextItems } = nextProps.dbValue;
    const { items: prevItems } = this.props.dbValue;

    const { layout } = this.getValue();
    const isMasonry = layout === "masonry";
    const isJustified = layout === "justified";

    const orderWasChanged = nextItems.some((item, index) => {
      const value = item.value as Value;
      const prevValue = prevItems[index]?.value as Value;
      return value._id !== prevValue?._id;
    });

    if (orderWasChanged || nextItems.length !== prevItems.length) {
      if (isMasonry) {
        this.destroyIsotope();
        this.initIsotope();
      }
      if (isJustified && this.gallery) {
        this.gallery.arrange();
      }
    }

    const currentSpacing = getSpacing(this.props.dbValue);
    const nextSpacing = getSpacing(nextProps.dbValue);

    if (isMasonry && !_.isEqual(currentSpacing, nextSpacing)) {
      this.reinitIsotopes();
    }
  }

  initGallery(): void {
    const v = this.getValue();
    switch (v.layout) {
      case "masonry": {
        this.initIsotope();
        break;
      }
      case "justified": {
        const ImagesLoaded = applyFilter("getLibs", {}).ImagesLoaded;
        ImagesLoaded(this.node, () => {
          this.initJustifiedGallery(v);
        });
        break;
      }
    }
  }

  patchValue(patch: Patch, meta = {}): void {
    if (patch.itemsOption) {
      const v = this.getValue();

      const { itemsOption, ...currentPatch } = patch;

      const items = multiUpload(v, itemsOption);

      super.patchValue({ ...currentPatch, items }, meta);
    } else {
      super.patchValue(patch, meta);
    }
  }

  getIsotope = (): GalleryIsotope | null => {
    return this.isotope;
  };

  getGallery = (): GalleryJustified | null => {
    return this.gallery;
  };

  handleRef = (el: HTMLElement | null): void => {
    if (el) {
      this.node = el;
    }
  };

  handleResizeImage = (): void => {
    if (this.node && this.isotope) {
      this.isotope.layout();
    }
  };

  handleValueChange(newValue: Value, meta: Meta): void {
    const device = deviceModeSelector(getStore().getState());
    const oldValue = this.getValue();
    const v = merge(oldValue, newValue);
    const { items: oldItems } = this.getValue();

    const dvk = (key: string) =>
      defaultValueKey({ key, device, state: "normal" });
    const dvv = (key: string) => defaultValueValue({ key, device, v });

    if (meta.patch.lightBox) {
      newValue = patchOnLightBox(newValue);
    }

    if (meta.patch.items) {
      if (imagesSrc(meta.patch.items).length !== imagesSrc(oldItems).length) {
        if (v.layout === "grid") {
          newValue = patchOnGridItemsChange(
            this.node,
            newValue,
            oldValue,
            meta.patch.items
          );
        } else {
          this.destroyJustifiedGallery();
          this.destroyIsotope();
          this.initGallery();
        }
      }

      if (v.layout === "bigImage" && v.items[1] !== oldItems[1]) {
        newValue = patchOnBigImageChange(newValue);
      }
    }

    switch (meta.patch.layout) {
      case "justified": {
        this.destroyIsotope();

        newValue = patchOnJustifiedLayout(newValue, {
          heightKey: dvk("height"),
          heightSuffixKey: dvk("heightSuffix"),
          rowHeight: dvv("rowHeight")
        });

        this.destroyJustifiedGallery();
        this.initJustifiedGallery(v);

        break;
      }
      case "grid": {
        this.destroyJustifiedGallery();
        this.destroyIsotope();

        newValue = patchOnGridLayout(this.node, newValue, oldValue);
        break;
      }
      case "masonry": {
        this.destroyJustifiedGallery();
        this.destroyIsotope();
        this.initIsotope();

        newValue = patchOnMasonryLayout(newValue);
        break;
      }
      case "bigImage": {
        this.destroyJustifiedGallery();
        this.destroyIsotope();

        newValue = patchOnBigImageLayout(newValue, oldValue, {
          node: this.node,
          responsiveGridColumn: dvv("gridColumn"),
          thumbStyle: dvv("thumbStyle")
        });

        break;
      }
    }

    if (
      meta.patch[dvk("bigImageImagesHeight")] ||
      meta.patch[dvk("thumbWidth")]
    ) {
      newValue = patchOnBigImageImagesThumbSizeChange(newValue, oldValue, {
        height: Num.read(
          meta.patch[dvk("bigImageImagesHeight")] ??
            v[dvk("bigImageImagesHeight")]
        ),
        heightSuffix: readUnit(v[dvk("bigImageImagesHeightSuffix")]),
        heightKey: dvk("height"),
        width: Num.read(meta.patch[dvk("thumbWidth")] ?? v[dvk("thumbWidth")]),
        widthKey: dvk("width"),
        isChanged: meta.patch[dvk("bigImageImagesHeight")] ? "height" : "width",
        imagesHeightKey: dvk("bigImageImagesHeight"),
        responsiveGridColumn: dvv("gridColumn"),
        node: this.node
      });
    }

    if (meta.patch[dvk("thumbStyle")]) {
      const thumbStyle = meta.patch[dvk("thumbStyle")] as Value["thumbStyle"];

      newValue = patchOnThumbStyleChange(thumbStyle, newValue, v);
    }

    // #region
    // this code is needed to clone/remove first item when we switch bettwen bigImage layout and others
    if (meta.patch.layout) {
      const { layout: prevLayout } = oldValue;
      const { layout: currentLayout } = v;

      if (prevLayout === "bigImage") {
        newValue = patchOnBigImageAsPrevLayout(newValue);
      }

      if (currentLayout === "bigImage") {
        newValue = patchOnBigImageAsCurrLayout(newValue);
      }
    }
    // #end region

    if (meta.patch[dvk("rowHeight")]) {
      const { layout } = this.getValue();
      if (layout === "justified") {
        this.destroyJustifiedGallery();
        this.initJustifiedGallery(v);
      }
    }

    if (
      (meta.patch.gridAspectRatio || meta.patch[dvk("gridColumn")]) &&
      newValue.layout === "grid"
    ) {
      newValue = patchOnGridAspectRationAndColumnChange(
        this.node,
        newValue,
        oldValue,
        {
          gridAspectRatio: meta.patch.gridAspectRatio,
          gridColumn: Num.read(meta.patch[dvk("gridColumn")])
        }
      );
    }

    if (meta.patch.gridColumn && oldValue.gridColumn < meta.patch.gridColumn) {
      newValue = patchOnColumnChange(meta.patch.gridColumn, newValue, oldValue);
    }

    super.handleValueChange(newValue, meta);
  }

  getMeta(v: Value, bigImageMeta?: boolean): ComponentsMeta {
    const { meta } = this.props;
    const { spacing, gridColumn, tabletGridColumn, mobileGridColumn } = v;
    const tabletSpacing = defaultValueValue({
      v,
      key: "spacing",
      device: TABLET,
      state: "normal"
    });
    const mobileSpacing = defaultValueValue({
      v,
      key: "spacing",
      device: MOBILE,
      state: "normal"
    });

    const _gridColumn = bigImageMeta ? 1 : gridColumn;
    const _tabletGridColumn = bigImageMeta ? 1 : tabletGridColumn;
    const _mobileGridColumn = bigImageMeta ? 1 : mobileGridColumn;

    const desktopW = ((meta.desktopW ?? 0) + spacing) / _gridColumn;
    const desktopWNoSpacing = (meta.desktopWNoSpacing ?? 0) / _gridColumn;
    const tabletW = (meta.tabletW + tabletSpacing) / _tabletGridColumn;
    const tabletWNoSpacing = (meta.tabletWNoSpacing ?? 0) / _tabletGridColumn;
    const mobileW = (meta.mobileW + mobileSpacing) / _mobileGridColumn;
    const mobileWNoSpacing = (meta.mobileWNoSpacing ?? 0) / _mobileGridColumn;

    return Object.assign({}, meta, {
      desktopW: Math.round((desktopW - spacing) * 10) / 10,
      desktopWNoSpacing: Math.round(desktopWNoSpacing),
      tabletW: Math.round(tabletW - tabletSpacing),
      tabletWNoSpacing: Math.round(tabletWNoSpacing),
      mobileW: Math.round(mobileW - mobileSpacing),
      mobileWNoSpacing: Math.round(mobileWNoSpacing)
    });
  }

  getTags(tags = ""): string[] {
    if (!tags) {
      return [];
    }

    return tags.split(",").reduce<string[]>((acc, curr) => {
      const tag = curr.trim();
      return tag ? [...acc, tag] : acc;
    }, []);
  }

  renderTags(v: Value, vs: Value, vd: Value): ReactNode {
    const { filterStyle, items, layout, allTag, sortTags } = v;

    if (layout === "bigImage") {
      return;
    }

    const filterClassName = classnames(
      "brz-image__gallery-filter",
      `brz-image__gallery-filter--${filterStyle}`,
      css(
        `${this.getComponentId()}-filter`,
        `${this.getId()}-filter`,
        styleForFilter(v, vs, vd)
      )
    );
    const className = classnames(
      "brz-li brz-image__gallery-filter__item",
      `brz-image__gallery-filter__item--${filterStyle}`
    );
    const _tags = items.reduce<string[]>((acc, curr) => {
      const value = curr.value as Value;
      const tags = this.getTags(value.tags).filter((tag) => !acc.includes(tag));

      return acc.concat(tags);
    }, []);

    const tags =
      sortTags === "on"
        ? [allTag].concat(_tags.sort((a, b) => a.localeCompare(b)))
        : [allTag].concat(_tags);

    const options = tags.map((tag: string, index: number) => {
      const tagClassName = tag.replace(/\s/g, "-");

      const filter = tag === allTag ? "*" : tagClassName;

      return (
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            // @ts-expect-error toolbar is in vanilla
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
            data-filter={filter}
            onClick={() => {
              const iso = this.getIsotope();
              const gallery = this.getGallery();
              this.handleFilterClick(tag);

              if (layout === "justified" && gallery) {
                gallery.arrange({
                  filter
                });
              } else if (layout === "grid") {
                const items = [
                  ...(this.node?.querySelectorAll<HTMLElement>(
                    ".brz-image__gallery-item"
                  ) ?? [])
                ];

                arrangeGridByTags(filter, items);
              } else {
                if (iso) {
                  iso.arrange({
                    filter: tag === allTag ? "*" : `.${tagClassName}`
                  });
                }
              }
            }}
          >
            {tag === v.allTag ? (
              <TextEditor value={allTag} onChange={this.handleAllTagChange} />
            ) : (
              tag
            )}
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

  getImagesSrc = (): MValue<string>[] => {
    const { items } = this.getValue();

    return items
      .map((item) => {
        const value = item.value as Value;

        return getImageUrl({
          uid: Str.read(value.imageSrc) ?? "",
          sizeType: readSizeType(value.sizeType) ?? SizeType.custom,
          fileName: value.imageFileName ?? ""
        });
      })
      .filter(Boolean);
  };

  // is needed for layout === "bigImage";
  renderFirstImage(): ReactNode {
    const v = this.getValue();
    const {
      layout,
      thumbStyle,
      enableTags,
      hoverName,
      hoverDuration,
      hoverInfiniteAnimation
    } = v;

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 0,
      sliceEndIndex: 1,
      itemProps: {
        meta: this.getMeta(v, true),
        onResize: this.handleResizeImage,
        layout,
        thumbStyle,
        renderer: {
          gallery: {
            inGallery: true,
            enableTags: enableTags === "on",
            layout,
            withBigImage: layout === "bigImage",
            hoverName,
            hoverDuration,
            hoverInfiniteAnimation
          }
        }
      }
    });

    // @ts-expect-error: Need transform EditorArrayComponents to ts
    return <EditorArrayComponent {...itemProps} />;
  }

  renderBigImage = (v: Value, vs: Value, vd: Value): ReactNode => {
    const { lightBox } = v;
    const images = this.getImagesSrc();

    const className = classnames(
      {
        "brz-image__gallery-big-image": images.length,
        "brz-image__gallery-placeholder": !images.length,
        "brz-image__gallery-lightbox brz-cursor-pointer": lightBox === "on"
      },
      css(
        `${this.getComponentId()}-bigImage`,
        `${this.getId()}-bigImage`,
        styleBigImage(v, vs, vd)
      )
    );

    const lightBoxContent =
      lightBox === "on" &&
      IS_PREVIEW &&
      images.slice(1).map((image, index) => {
        const _image = Str.read(image) ?? "";
        return (
          <a
            key={index}
            className="brz-image__gallery-big-image-lightbox"
            href={_image}
            style={{ display: "none" }}
          >
            <img src={_image} />
          </a>
        );
      });

    return (
      <div
        className={className}
        data-images={encodeToString(images.slice(1))}
        data-lightbox={lightBox}
      >
        <div className="brz-image__gallery-big-image-content">
          {this.renderFirstImage()}
          {lightBoxContent}
        </div>
      </div>
    );
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const {
      lightBox,
      enableTags,
      layout,
      thumbStyle,
      imagesMaskShape,
      hoverName,
      hoverDuration,
      hoverInfiniteAnimation
    } = v;

    const className = classnames(
      "brz-image__gallery-wrapper",
      "brz-d-xs-flex brz-flex-xs-wrap",
      `brz-image__gallery-${layout}`,
      { "brz-image__gallery-lightbox": lightBox === "on" },
      { "brz-image__gallery-with-thumb": layout === "bigImage" },
      css(
        `${this.getComponentId()}-gallery`,
        `${this.getId()}-gallery`,
        style(v, vs, vd)
      )
    );

    const isImageCloned = Boolean(
      (v.items[0].value as Value)?.clonedFromGallery
    );

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      // this means item already was cloned
      ...(isImageCloned ? { sliceStartIndex: 1 } : {}),
      itemProps: {
        meta: this.getMeta(v),
        onResize: this.handleResizeImage,
        layout,
        thumbStyle,
        renderer: {
          gallery: {
            inGallery: true,
            enableTags: v.enableTags === "on",
            layout,
            withBigImage: layout === "bigImage",
            imagesMaskShape,
            hoverName,
            hoverDuration,
            hoverInfiniteAnimation
          }
        }
      },
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtendImage,
        sidebarExtendImage
      )
    });

    const tags = v.items.reduce<string[]>((acc, curr) => {
      const value = curr.value as Value;
      const tags = this.getTags(value.tags).filter(
        (tag: string) => !acc.includes(tag)
      );

      return acc.concat(tags);
    }, []);

    const classNameWrapper = classnames(
      "brz-image__gallery",
      { [`brz-image__gallery-${thumbStyle}`]: layout === "bigImage" },
      css(
        `${this.getComponentId()}-galleryWrapper`,
        `${this.getId()}-galleryWrapper`,
        styleWrapper(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Fragment>
          <Wrapper {...this.makeWrapperProps({ className: classNameWrapper })}>
            {enableTags === "on" &&
              tags.length > 0 &&
              this.renderTags(v, vs, vd)}
            <div className="brz-image__gallery-container">
              {layout === "bigImage" && this.renderBigImage(v, vs, vd)}
              <div
                className={className}
                ref={this.handleRef}
                {...(IS_PREVIEW
                  ? {
                      "data-settings": encodeToString(
                        makeOptionValueToSettings(v, breakpoints)
                      )
                    }
                  : {})}
              >
                {/* @ts-expect-error: need review when EditorArrayComponent converted to TS */}
                <Items {...itemProps} />
              </div>
            </div>
          </Wrapper>
          {IS_EDITOR && <ResizeAware onResize={this.handleResize} />}
        </Fragment>
      </CustomCSS>
    );
  }

  // justified plugin
  getGalleryLib(): GalleryJustifiedType {
    return applyFilter("getLibs", {}).Gallery;
  }

  // Isotope plugin
  getIsotopeLib(): GalleryIsotopeType {
    return applyFilter("getLibs", {}).Isotope;
  }

  initIsotope(): void {
    const Isotope = this.getIsotopeLib();

    if (Isotope && this.node) {
      this.isotope = new Isotope(this.node, {
        itemSelector: ".brz-image__gallery-item",
        masonry: {
          columnWidth: ".brz-image__gallery-item"
        }
      });
    }
  }

  reinitIsotopes = _.debounce(() => {
    this.destroyIsotope();
    this.initIsotope();
  }, 500);

  initJustifiedGallery(v: Value): void {
    const Gallery = this.getGalleryLib();

    if (Gallery && this.node) {
      const { settings } = makeOptionValueToSettings(
        v,
        breakpoints
      ) as JustifySettings;
      this.gallery = new Gallery(this.node, settings);
    }
  }

  destroyIsotope(): void {
    if (this.isotope) {
      this.isotope.destroy();
    }
  }

  destroyJustifiedGallery(): void {
    if (this.gallery) {
      this.gallery.destroy();
      this.gallery = null;
    }
  }
}

export default ImageGallery;
