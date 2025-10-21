import { adjustImagesWidthByContainerWidth } from "./utils";
import { attachResize, detachResize } from "./utils/attachResize";

interface JustifiedRowParams {
  nodeItems: HTMLElement[];
  containerWidth: number;
  startIndex: number;
  computedWidth: number[];
  rowsHeights: number[];
  ratio: number[];
  rowHeight: number;
  filterItems?: HTMLElement[];
  extraWidth?: number;
}

type WithResponsive<T> = T & {
  responsive?: {
    breakpoint: number;
    settings: Partial<T>;
  }[];
};

interface _Settings {
  rowHeight: number;
  itemSelector: string;
  extraWidth?: number;
}

export type Settings = WithResponsive<_Settings>;

interface Filter {
  filter: string;
}

export default class Gallery {
  initialParams: Settings;
  currentSettings: Settings;
  nodeItems: HTMLElement[];
  node: HTMLElement;
  justifiedParams: JustifiedRowParams;
  filterOpts?: Filter;

  constructor(node: HTMLElement, params: Settings) {
    this.node = node;
    this.initialParams = params;
    this.currentSettings = this.getCurrentSettings(params);
    this.nodeItems = this.getItems(node, this.currentSettings.itemSelector);

    const { extraWidth, rowHeight } = this.currentSettings;

    this.justifiedParams = {
      nodeItems: this.nodeItems,
      containerWidth: node.offsetWidth,
      extraWidth,
      startIndex: 0,
      computedWidth: [],
      ratio: [],
      rowHeight,
      rowsHeights: []
    };

    attachResize(this.node, this.handleResize);
    this.arrange();
  }

  public arrange(filterOpts?: Filter): void {
    if (filterOpts) {
      this.filterOpts = filterOpts;
    }

    this.justifiedParams.nodeItems = this.getItems(
      this.node,
      this.currentSettings.itemSelector
    );

    if (this.filterOpts && this.filterOpts.filter !== "*") {
      this.justifiedParams.nodeItems.forEach((item) => {
        item.style.display = "block";
      });
      const { filter: tag } = this.filterOpts;

      this.justifiedParams.nodeItems.forEach((item) => {
        if (!item.classList.contains(tag)) {
          item.style.display = "none";
        }
      });

      this.justifiedParams.nodeItems = this.justifiedParams.nodeItems.filter(
        (item) => item.classList.contains(tag)
      );
    } else {
      this.justifiedParams.nodeItems.forEach((item) => {
        item.style.display = "block";
      });
    }

    const { computedWidth, ratio } = this.getJustifiedData(
      this.justifiedParams.nodeItems,
      this.currentSettings.rowHeight
    );

    const parentItem = this.node;
    this.justifiedParams.computedWidth = computedWidth;
    this.justifiedParams.ratio = ratio;
    this.justifiedParams.containerWidth = parentItem
      ? parentItem.offsetWidth + (this.currentSettings.extraWidth ?? 0)
      : 0;
    this.justifiedParams.rowsHeights = [];
    this.justifiedParams.startIndex = 0;

    this.makeJustifiedRow(this.justifiedParams);
  }

  public destroy(): void {
    if (this.nodeItems.length) {
      this.node.style.removeProperty("padding-bottom");

      this.nodeItems.forEach((item) => {
        item.style.removeProperty("width");
        item.style.removeProperty("height");
        item.style.removeProperty("display");
        item.style.removeProperty("top");
        item.style.removeProperty("left");
        item.style.removeProperty("--item-row-index");
      });

      detachResize(this.node);
    }
  }

  handleResize = (): void => {
    this.currentSettings = this.getCurrentSettings(this.initialParams);
    this.arrange();
  };

  getCurrentSettings(params: Settings): _Settings {
    const { innerWidth } = window;

    if (!params.responsive?.length) {
      return { rowHeight: params.rowHeight, itemSelector: params.itemSelector };
    }

    let currentSettings: _Settings = {
      rowHeight: params.rowHeight,
      itemSelector: params.itemSelector,
      extraWidth: params.extraWidth
    };

    params.responsive.forEach((breakpoint) => {
      if (innerWidth < breakpoint.breakpoint) {
        currentSettings.rowHeight =
          breakpoint.settings.rowHeight ?? params.rowHeight;
        currentSettings.itemSelector =
          breakpoint.settings.itemSelector ?? params.itemSelector;
      }
    });

    return currentSettings;
  }

  getItems(node: HTMLElement, itemSelector: string): HTMLElement[] | [] {
    if (node && itemSelector) {
      const nodeItems: HTMLElement[] = [
        ...node.querySelectorAll<HTMLElement>(itemSelector)
      ];

      return nodeItems;
    }

    return [];
  }

  getJustifiedData(
    nodeItems: HTMLElement[],
    rowHeight: number
  ): { computedWidth: number[]; ratio: number[] } {
    const computedWidth: number[] = [];
    const ratio: number[] = [];

    nodeItems.forEach((imageWrapper: HTMLElement) => {
      const image = imageWrapper.querySelector("img");
      const width = image?.naturalWidth ?? 0;
      const height = image?.naturalHeight ?? 0;

      const _width = rowHeight * (width / height);

      const placeholder = imageWrapper.querySelector(
        ".brz-shortcode__placeholder"
      );

      if (placeholder) {
        const { width, height } = placeholder.getBoundingClientRect();

        computedWidth.push(rowHeight * (width / height));
      } else {
        if (!_width) {
          const { width, height } = imageWrapper.getBoundingClientRect();

          computedWidth.push(rowHeight * (width / height));
        } else {
          computedWidth.push(_width);
        }
      }

      const _ratio = width / height;

      if (!_ratio) {
        ratio.push(1);
      } else {
        ratio.push(_ratio);
      }
    });
    return { computedWidth, ratio };
  }

  makeJustifiedRow(params: JustifiedRowParams): void {
    const {
      nodeItems,
      containerWidth,
      startIndex,
      computedWidth,
      rowsHeights,
      ratio,
      rowHeight
    } = params;
    let rowsCount = 0;

    let oldRowWidth = 0;

    const _computedWidth = adjustImagesWidthByContainerWidth(
      computedWidth,
      containerWidth
    );

    if (nodeItems.length && _computedWidth.length) {
      for (let index = startIndex; ; index++) {
        let itemComputedWidth = computedWidth[index];

        if (itemComputedWidth > containerWidth) {
          itemComputedWidth = containerWidth;
        }

        const newRowWidth = oldRowWidth + itemComputedWidth;

        if (newRowWidth > containerWidth) {
          const oldDiff = containerWidth - oldRowWidth,
            newDiff = newRowWidth - containerWidth;

          if (oldDiff < newDiff) {
            this.fitImagesInContainer(
              startIndex,
              index,
              oldRowWidth,
              containerWidth,
              nodeItems,
              rowsHeights,
              _computedWidth,
              ratio
            );

            rowsCount++;

            this.makeJustifiedRow({
              nodeItems,
              containerWidth,
              startIndex: index,
              computedWidth,
              rowsHeights,
              ratio,
              rowHeight
            });

            break;
          }
        }

        const isLastItem = index === nodeItems.length - 1;

        if (isLastItem) {
          const totalRowWidth =
            0.7 <= newRowWidth / containerWidth ? newRowWidth : containerWidth;

          this.fitImagesInContainer(
            startIndex,
            index + 1,
            totalRowWidth,
            containerWidth,
            nodeItems,
            rowsHeights,
            _computedWidth,
            ratio
          );

          this.inflateGalleryHeight(
            containerWidth,
            nodeItems,
            rowsHeights,
            rowsCount
          );

          break;
        }

        oldRowWidth = newRowWidth;
      }
    }
  }

  fitImagesInContainer(
    startIndex: number,
    endIndex: number,
    rowWidth: number,
    containerWidth: number,
    items: HTMLElement[],
    rowsHeights: number[],
    computedWidth: number[],
    ratio: number[]
  ): void {
    const gapCount = endIndex - startIndex - 1;

    let aggregatedWidth = 0;

    if (items.length) {
      for (let index = startIndex; index < endIndex; index++) {
        const percentWidth =
            computedWidth[index] / rowWidth > 1
              ? 1
              : computedWidth[index] / rowWidth,
          item = items[index];

        item.style.setProperty("width", `${percentWidth * 100}%`);
        item.style.setProperty("height", `${rowWidth}px`);
        item.style.setProperty("left", `${aggregatedWidth * 100}%`);
        item.style.setProperty("--item-row-index", String(index - startIndex));

        aggregatedWidth += percentWidth;

        if (index === startIndex) {
          const imagePxWidth = percentWidth * (containerWidth - gapCount);
          const _ratio = ratio[index];

          rowsHeights.push(imagePxWidth / _ratio);
        }
      }
    }
  }

  inflateGalleryHeight(
    containerWidth: number,
    items: HTMLElement[],
    rowsHeights: number[],
    rowsCount: number
  ): void {
    const totalRowsHeight = rowsHeights.length
        ? rowsHeights.reduce((total, item) => total + item)
        : 0,
      finalContainerHeight = totalRowsHeight + rowsCount,
      containerAspectRatio = finalContainerHeight / containerWidth,
      percentRowsHeights = rowsHeights.map(
        (rowHeight) => (rowHeight / finalContainerHeight) * 100
      );

    let currentRow = -1,
      accumulatedTop = 0;

    items.forEach((item) => {
      const itemRowIndex = item.style.getPropertyValue("--item-row-index"),
        isFirstItem = "0" === itemRowIndex;

      if (isFirstItem) {
        currentRow++;

        if (currentRow) {
          accumulatedTop += percentRowsHeights[currentRow - 1];
        }
      }

      item.style.setProperty("top", accumulatedTop + "%");
      item.style.setProperty("height", `${percentRowsHeights[currentRow]}%`);
    });

    if (items.length && items[0].parentNode) {
      (items[0].parentNode as HTMLElement).style.setProperty(
        "padding-bottom",
        `${containerAspectRatio * 100}%`
      );
    }
  }
}
