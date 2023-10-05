import classnames from "classnames";
import { isT } from "fp-utilities";
import React, { Fragment, ReactNode } from "react";
import ResizeAware from "react-resize-aware";
import { getIn, insert, merge, mergeIn, removeAt } from "timm";
import _, { last } from "underscore";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import EditorComponent, {
  ComponentsMeta,
  Props as NextProps
} from "visual/editorComponents/EditorComponent";
import { SizeType } from "visual/global/Config/types/configs/common";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { Breakpoint, DeviceMode2 } from "visual/types";
import {
  GalleryIsotope,
  GalleryIsotopeType,
  GalleryJustified,
  GalleryJustifiedType
} from "visual/types/global";
import { css } from "visual/utils/cssStyle";
import { applyFilter } from "visual/utils/filters";
import { getImageUrl } from "visual/utils/image";
import { setIds } from "visual/utils/models";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { WithClassName } from "visual/utils/options/attributes";
import * as Num from "visual/utils/reader/number";
import * as Str from "visual/utils/reader/string";
import { MOBILE, TABLET } from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";
import { encodeToString } from "visual/utils/string";
import { MValue } from "visual/utils/value";
import EditorArrayComponent from "../EditorArrayComponent";
import { Unit } from "../Image/types";
import { calcWrapperSizes, readSizeType, readUnit } from "../Image/utils";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as sidebarExtendImage from "./sidebarExtendImage";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import * as sidebarFilterConfig from "./sidebarFilter";
import { style, styleBigImage, styleForFilter, styleWrapper } from "./styles";
import * as toolbarExtendImage from "./toolbarExtendImage";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarFilterConfig from "./toolbarFilter";
import {
  JustifySettings,
  addHorizontalThumbStyleData,
  changeImagesData,
  getSpacing,
  makeOptionValueToSettings,
  mergeLinkType,
  removeHorizontalThumbStyleData
} from "./utils";
import { arrangeGridByTags } from "./utils.export";

type Patch = Partial<Value>;

interface Meta {
  [k: string]: unknown;
  patch: Patch;
}

const breakpoints: Breakpoint[] = [
  {
    title: "desktop",
    value: DeviceMode2.Desktop,
    enabled: true,
    breakpoint: 1500,
    content: 1500
  },
  {
    title: "tablet",
    value: DeviceMode2.Tablet,
    enabled: true,
    breakpoint: 991,
    content: 991
  },
  {
    title: "mobile",
    value: DeviceMode2.Mobile,
    enabled: true,
    breakpoint: 767,
    content: 767
  }
];

export interface Value extends ElementModel {
  layout: "grid" | "masonry" | "justified" | "bigImage";
  lightBox: "on" | "off";
  spacing: number;
  gridColumn: number;
  tabletGridColumn: number;
  mobileGridColumn: number;
  items: ElementModel[];
  itemsOption: ElementModel[];
  gridAspectRatio: string;
  tags: string;
  imageSrc: string;
  imageFileName: string;
  allTag: string;
  imageWidth: number;
  imageHeight: number;
  bigImageImagesHeight: number;
  tabletBigImageImagesHeight: number;
  mobileBigImageImagesHeight: number;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

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

  getDefaultGridItems({
    gridAspectRatio,
    gridColumn,
    items,
    lightBox
  }: {
    gridAspectRatio?: string;
    gridColumn?: number;
    items?: ElementModel[];
    lightBox?: Value["lightBox"];
  }): ElementModel[] {
    const { gridAspectRatio: oldGridAspectRatio, gridColumn: oldGridColumn } =
      this.getValue();

    if (this.node) {
      const { items: oldItems }: { items: ElementModel[] } = this.getValue();
      const { width: containerWidth } = this.node.getBoundingClientRect();
      const _newItems = (items ?? oldItems).map((el: ElementModel) => {
        const value = el.value as Value;

        const [x, y] = (gridAspectRatio ?? oldGridAspectRatio).split("/");
        const _x = Num.read(x) ?? 4;
        const _y = Num.read(y) ?? 3;

        const newHeight =
          containerWidth / (_x / _y) / (gridColumn ?? oldGridColumn);

        const wrapperSizes = {
          width: containerWidth / (gridColumn ?? oldGridColumn),
          height: newHeight
        };

        const newWrapperSizes = calcWrapperSizes(
          {
            imageWidth: Num.read(value.imageWidth) ?? 600,
            imageHeight: Num.read(value.imageHeight) ?? 450,
            width: 100,
            widthSuffix: "%",
            height: 100,
            heightSuffix: "%",
            size: Num.read(value.size) ?? 100
          },
          containerWidth / (gridColumn ?? oldGridColumn)
        );

        const newHoverWrapperSizes = calcWrapperSizes(
          {
            imageWidth: Num.read(value.hoverImageWidth) ?? 600,
            imageHeight: Num.read(value.hoverImageHeight) ?? 450,
            widthSuffix: "%",
            heightSuffix: "%",
            width: 100,
            height: 100,
            size: Num.read(value.size) ?? 100
          },
          containerWidth / (gridColumn ?? oldGridColumn)
        );

        return mergeIn(el, ["value"], {
          height: (wrapperSizes.height * 100) / newWrapperSizes.height,
          hoverHeight:
            (wrapperSizes.height * 100) / newHoverWrapperSizes.height,
          heightSuffix: "%",
          tabletHeight: null,
          tabletHeightSuffix: null,
          mobileHeight: null,
          mobileHeightSuffix: null,
          sizeType: "custom",
          tabletSizeType: null,
          mobileSizeType: null,
          ...(lightBox && mergeLinkType(lightBox))
        }) as ElementModel;
      });

      return _newItems;
    }

    return items ?? [];
  }

  adjustImagesByHeight({
    height,
    heightKey,
    heightSuffix = "px",
    width,
    widthKey,
    items,
    isChanged
  }: {
    height?: number;
    heightSuffix?: Unit;
    width?: number;
    heightKey?: string;
    widthKey?: string;
    items: ElementModel[];
    isChanged?: "width" | "height";
  }): { items: ElementModel[]; height: number } {
    if (this.node) {
      const { gridColumn } = this.getValue();
      const { width: containerWidth } = this.node.getBoundingClientRect();

      const _height = height ?? containerWidth / gridColumn;
      let vHeight = _height;

      const newItems = items.map((image: ElementModel) => {
        const value = image.value as Value;

        if (value.clonedFromGallery) {
          return image;
        }

        const newWrapperSizes = calcWrapperSizes(
          {
            imageWidth: Num.read(value.imageWidth) ?? 600,
            imageHeight: Num.read(value.imageHeight) ?? 450,
            width: 100,
            widthSuffix: "%",
            height: _height,
            heightSuffix,
            size: Num.read(value.size) ?? 100
          },
          containerWidth / this.dvv("gridColumn")
        );

        vHeight = newWrapperSizes.height;

        return mergeIn(image, ["value"], {
          hoverHeight: newWrapperSizes.height,
          heightSuffix: "px",
          tabletHeight: value.tabletHeight ?? value.height,
          tabletHeightSuffix: "px",
          mobileHeight: value.mobileHeight ?? value.height,
          mobileHeightSuffix: "px",
          [heightKey ?? "height"]:
            isChanged === "height" ? newWrapperSizes.height : value.height,
          ...(isChanged === "width"
            ? {
                widthSuffix: "px",
                tabletWidth: value.tabletWidth ?? width ?? value.width,
                tabletWidthSuffix: "px",
                mobileWidth: value.mobileWidth ?? width ?? value.width,
                mobileWidthSuffix: "px",
                [widthKey ?? "width"]: width
              }
            : {})
        });
      }) as ElementModel[];

      return {
        items: newItems,
        height: vHeight
      };
    }

    return {
      items,
      height: height ?? 100
    };
  }

  patchValue(patch: Patch, meta = {}): void {
    if (patch.itemsOption) {
      const {
        layout,
        bigImageImagesHeight,
        tabletBigImageImagesHeight,
        mobileBigImageImagesHeight
      } = this.getValue();
      const sizeType = layout === "justified" ? "original" : "custom";

      const dbItems = this.getValue().items;
      const items = patch.itemsOption
        .map((item: ElementModel) => {
          const currentItem = dbItems.find((i: ElementModel) => {
            const value = i.value as Value;
            return value._id === item.id;
          });
          if (currentItem) {
            const currentValue = currentItem.value as Value;
            const { uid, width, height } = item;
            const { imageSrc, imageWidth, imageHeight, imageFileName } =
              currentValue;

            return imageSrc !== uid ||
              imageWidth !== width ||
              imageHeight !== height
              ? {
                  ...currentItem,
                  value: {
                    ...(currentItem.value as Value),
                    imageSrc: uid,
                    imageWidth: width,
                    imageHeight: height,
                    imageFileName
                  }
                }
              : currentItem;
          } else {
            const extraData =
              layout === "bigImage"
                ? {
                    height: bigImageImagesHeight,
                    heightSuffix: "px",
                    tabletHeight: tabletBigImageImagesHeight,
                    tabletHeightSuffix: "px",
                    mobileHeight: mobileBigImageImagesHeight,
                    mobileHeightSuffix: "px"
                  }
                : {};

            return setIds({
              type: "Image",
              value: {
                imageSrc: item.uid,
                imageFileName: item.fileName,
                imageWidth: item.width,
                imageHeight: item.height,
                imageExtension: last((Str.read(item.uid) ?? "").split(".")),
                ...extraData,
                _styles: ["image"],
                sizeType
              }
            });
          }
        })
        .filter(isT);

      const { imageSrc, imageFileName, imageExtension } = items[0].value;

      // gallery-dev option does not know that we have cloned image and when we change something from toolbar we lose that cloned image
      const newItem =
        layout === "bigImage"
          ? setIds({
              type: "Image",
              value: {
                ...(dbItems[0].value as Value),
                imageSrc,
                imageFileName,
                imageExtension,
                sizeType: "custom",
                tabletSizeType: null,
                mobileSizeType: null,
                clonedFromGallery: true
              }
            })
          : null;

      const { itemsOption, ...currentPatch } = patch; // eslint-disable-line
      super.patchValue(
        { ...currentPatch, items: newItem ? insert(items, 0, newItem) : items },
        meta
      );
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

  dvv = (key: string) => {
    const v = this.getValue();
    const state = State.mRead(v.tabsState);
    const device = deviceModeSelector(getStore().getState());

    return defaultValueValue({ v, key, device, state });
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
      const { lightBox, layout } = newValue;

      const items = newValue.items.map((el) =>
        mergeIn(el, ["value"], {
          linkType:
            lightBox === "on" && layout !== "bigImage"
              ? "lightBox"
              : "external",
          linkLightBox: layout !== "bigImage" && lightBox
        })
      );

      newValue = mergeIn(newValue, ["items"], items) as Value;
    }

    if (meta.patch.items) {
      if (meta.patch.items.length !== oldItems.length) {
        if (v.layout === "grid") {
          const newItems = this.getDefaultGridItems({
            items: meta.patch.items
          });
          newValue = mergeIn(newValue, ["items"], newItems) as Value;
        } else {
          this.destroyJustifiedGallery();
          this.destroyIsotope();
          this.initGallery();
        }
      }

      if (v.layout === "bigImage" && v.items[1] !== oldItems[1]) {
        const {
          imageSrc,
          imageFileName,
          imageExtension,
          imageWidth,
          imageHeight,
          size
        } = v.items[1].value as Value;

        newValue = mergeIn(newValue, ["items", 0, "value"], {
          imageSrc,
          imageFileName,
          imageExtension,
          imageWidth,
          imageHeight,
          size
        }) as Value;
      }
    }

    switch (meta.patch.layout) {
      case "justified": {
        this.destroyIsotope();
        const { lightBox } = newValue;

        const newItems = v.items.map((el: ElementModel) =>
          mergeIn(el, ["value"], {
            sizeType: "original",
            ...mergeLinkType(lightBox),
            tabletSizeType: null,
            mobileSizeType: null,
            [dvk("height")]: dvv("rowHeight"),
            [dvk("heightSuffix")]: "px"
          })
        );

        newValue = mergeIn(newValue, ["items"], newItems) as Value;

        this.destroyJustifiedGallery();
        this.initJustifiedGallery(v);

        break;
      }
      case "grid": {
        const { lightBox } = newValue;

        this.destroyJustifiedGallery();
        this.destroyIsotope();

        const newItems = this.getDefaultGridItems({
          lightBox
        });

        newValue = mergeIn(newValue, ["items"], newItems) as Value;
        break;
      }
      case "masonry": {
        const { lightBox } = newValue;

        this.destroyJustifiedGallery();
        this.destroyIsotope();
        this.initIsotope();

        const newItems = newValue.items.map((image: ElementModel) =>
          mergeIn(image, ["value"], {
            ...(image.value as Value),
            sizeType: "custom",
            ...mergeLinkType(lightBox),
            tabletSizeType: null,
            mobileSizeType: null
          })
        );

        newValue = mergeIn(newValue, ["items"], newItems) as Value;
        break;
      }
      case "bigImage": {
        this.destroyJustifiedGallery();
        this.destroyIsotope();

        const _newItems = newValue.items.map((image: ElementModel) =>
          mergeIn(image, ["value"], {
            ...(image.value as Value),
            linkType: "external",
            linkLightBox: "off",
            sizeType: "custom",
            tabletSizeType: null,
            mobileSizeType: null
          })
        ) as ElementModel[];

        const { items: newItems, height } = this.adjustImagesByHeight({
          height: Num.read(v.bigImageImagesHeight),
          heightSuffix: readUnit(v.bigImageImagesHeightSuffix),
          items: _newItems,
          isChanged: "height"
        });

        if (
          v[dvk("thumbStyle")] === "left" ||
          v[dvk("thumbStyle")] === "right"
        ) {
          newValue = mergeIn(
            newValue,
            ["items"],
            addHorizontalThumbStyleData(v, newItems)
          ) as Value;

          break;
        }

        const clonedValue = Object.assign({}, newValue);
        clonedValue.bigImageImagesHeight = height;

        newValue = merge(newValue, clonedValue);
        newValue = mergeIn(newValue, ["items"], newItems) as Value;

        break;
      }
    }

    if (
      meta.patch[dvk("bigImageImagesHeight")] ||
      meta.patch[dvk("thumbWidth")]
    ) {
      const _newItems = changeImagesData(newValue.items, {
        sizeType: "custom",
        tabletSizeType: null,
        mobileSizeType: null
      });

      const { items: newItems, height } = this.adjustImagesByHeight({
        height: Num.read(
          meta.patch[dvk("bigImageImagesHeight")] ??
            v[dvk("bigImageImagesHeight")]
        ),
        heightSuffix: readUnit(v[dvk("bigImageImagesHeightSuffix")]),
        heightKey: dvk("height"),
        width: Num.read(meta.patch[dvk("thumbWidth")] ?? v[dvk("thumbWidth")]),
        widthKey: dvk("width"),
        items: _newItems,
        isChanged: meta.patch[dvk("bigImageImagesHeight")] ? "height" : "width"
      });

      const clonedValue = Object.assign({}, newValue);
      clonedValue[dvk("bigImageImagesHeight")] = height;

      newValue = merge(newValue, clonedValue);
      newValue = mergeIn(newValue, ["items"], newItems) as Value;
    }

    if (meta.patch[dvk("thumbStyle")]) {
      switch (meta.patch[dvk("thumbStyle")]) {
        case "top":
        case "bottom":
          newValue = mergeIn(
            newValue,
            ["items"],
            removeHorizontalThumbStyleData(v.items)
          ) as Value;
          break;
        case "left":
        case "right":
          newValue = mergeIn(
            newValue,
            ["items"],
            addHorizontalThumbStyleData(v)
          ) as Value;
      }
    }

    // #region
    // this code is needed to clone/remove first item when we switch bettwen bigImage layout and others
    if (meta.patch.layout) {
      const { layout: prevLayout } = oldValue;
      const { layout: currentLayout } = v;

      if (prevLayout === "bigImage") {
        const clonedValue = Object.assign({}, newValue);
        const newItems = removeAt(newValue.items, 0);

        clonedValue.items = removeHorizontalThumbStyleData(newItems);

        newValue = merge(newValue, clonedValue);
      }

      if (currentLayout === "bigImage") {
        const image = getIn(newValue, ["items", 0]) as ElementModel;
        const value = image.value as Value;
        const {
          imageSrc,
          imageFileName,
          imageWidth,
          imageHeight,
          size,
          imageExtension
        } = value;

        const newImage = setIds({
          type: "Image",
          value: {
            imageSrc,
            imageFileName,
            imageExtension,
            imageWidth,
            imageHeight,
            size,
            sizeType: "custom",
            tabletSizeType: null,
            mobileSizeType: null,
            clonedFromGallery: true
          }
        });
        const newItems = insert(newValue.items, 0, newImage);

        newValue = mergeIn(newValue, ["items"], newItems) as Value;
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
      const newItems = this.getDefaultGridItems({
        gridAspectRatio: meta.patch.gridAspectRatio,
        gridColumn: Num.read(meta.patch[dvk("gridColumn")])
      });

      newValue = mergeIn(newValue, ["items"], newItems) as Value;
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
