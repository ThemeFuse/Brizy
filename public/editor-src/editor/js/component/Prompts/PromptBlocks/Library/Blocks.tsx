import classnames from "classnames";
import { noop } from "es-toolkit";
import { isT, match } from "fp-utilities";
import React, {
  CSSProperties,
  Component,
  ComponentType,
  PropsWithChildren,
  ReactElement
} from "react";
import Scrollbars from "react-custom-scrollbars";
import EditorIcon from "visual/component/EditorIcon";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";
import { MValue } from "visual/utils/value";
import { Button } from "../../common/Button";
import DataFilter from "../common/DataFilter";
import { Footer } from "../common/Footer";
import SearchInput from "../common/SearchInput";
import { Control as Select } from "../common/Select";
import Sidebar, { SidebarList, SidebarOption } from "../common/Sidebar";
import ThumbnailGrid from "../common/ThumbnailGrid";
import { isBlock, isLayout, isPopup } from "../common/utils";
import {
  ALL_CAT,
  BlockCategory,
  BlockTypes,
  UNCATEGORISED_CAT
} from "../types";
import CloudConnect from "./CloudConnect";
import { Filter } from "./Filter";
import { BlockData } from "./types";

export interface Props {
  activeType?: BlockCategory;
  type: "normal" | "popup";
  showSearch: boolean;
  showTitle: boolean;
  sidebarSync: boolean;
  thumbnailSync?: boolean;
  thumbnailDownload?: boolean;
  importLoading?: boolean;
  exportLoading?: boolean;
  search: string;
  loading: boolean;
  items: Partial<Record<BlockTypes, BlockData[]>>;
  types: BlockCategory[];
  filter?: string;
  HeaderSlotLeft: ComponentType<PropsWithChildren<unknown>>;
  onChange: (b: BlockData) => void;
  onDelete: (b: BlockData) => void;
  onSync?: (b: BlockData) => void;
  onExport?: (i: string[], type: BlockTypes) => void;
  onImport?: (type: BlockTypes) => void;
  onSuccessSync: VoidFunction;
  onUpdate?: (b: BlockData) => void;
  onFilterChange?: (filter: string, type: BlockTypes) => void;
  config: ConfigCommon;
  isPro: boolean;
  isStory: boolean;
  upgradeToPro: string;
}

interface BlocksFilter {
  type: BlockTypes;
  search: string;
  tags: string;
  filter: string;
}

interface Counters {
  [k: string]: number;
}

const scrollStyle: CSSProperties = {
  flex: 1
};

const storyGrid = {
  columns: 5,
  responsive: [
    {
      breakpoint: 1460,
      settings: {
        columns: 4
      }
    },
    {
      breakpoint: 1200,
      settings: {
        columns: 3
      }
    }
  ]
};

class Blocks extends Component<Props> {
  static defaultProps: Props = {
    type: "normal",
    showSearch: true,
    sidebarSync: true,
    showTitle: true,
    search: "",
    loading: false,
    items: {},
    types: [],
    HeaderSlotLeft: Component,
    onChange: noop,
    onDelete: noop,
    onSuccessSync: noop,
    onUpdate: noop,
    config: {} as ConfigCommon,
    isPro: false,
    isStory: false,
    upgradeToPro: ""
  };

  currentFilter: BlocksFilter;

  constructor(props: Props) {
    super(props);
    const { types, filter: _filter, activeType } = this.props;
    const type = activeType?.id ?? types[0]?.id ?? "BLOCK";
    const filter =
      _filter ?? this.getSidebarFilter(type)?.defaultSelected ?? "";

    this.currentFilter = {
      type,
      filter,
      search: "",
      tags: ALL_CAT
    };
  }

  getSidebarFilter(type: BlockTypes) {
    const { config } = this.props;
    const getFilter = match(
      [isBlock, () => config.api?.savedBlocks?.filter],
      [isPopup, () => config.api?.savedPopups?.filter],
      [isLayout, () => config.api?.savedLayouts?.filter]
    );

    return getFilter(type);
  }

  hasFilter = (type: BlockTypes): boolean => {
    const filterHandler = this.getSidebarFilter(type)?.handler;
    return typeof filterHandler === "function";
  };

  getFilterLabel(type: BlockTypes): MValue<string> {
    return this.getSidebarFilter(type)?.label;
  }

  getDefaultFilter = (items: BlockData[]): BlocksFilter => {
    const itemsTags = this.getAllCategories(items);
    const tags = itemsTags.some((t) => t.item === this.currentFilter.tags)
      ? this.currentFilter.tags
      : ALL_CAT;

    return {
      type: this.currentFilter.type,
      search: "",
      tags,
      filter: this.currentFilter.filter
    };
  };

  getActiveType(types: BlockCategory[]): BlockCategory["id"] {
    return this.currentFilter.type || types[0].id;
  }

  getAllCategories = (
    filteredItems: BlockData[]
  ): Array<{ item: string; deletable: boolean }> => {
    const tags = new Set([ALL_CAT, UNCATEGORISED_CAT]);

    filteredItems
      .filter((item) => item.type === this.currentFilter.type)
      .map((item) => item.tags?.split(","))
      .flat()
      .forEach((tag) => tag && tags.add(tag));

    return [...tags].map((t) => ({
      item: t,
      deletable: t !== ALL_CAT && t !== UNCATEGORISED_CAT,
      editable: t !== ALL_CAT && t !== UNCATEGORISED_CAT
    }));
  };

  getTypesCounters = (): Counters => {
    const { items, types } = this.props;
    const blocks = Object.values(items)
      .filter(isT)
      .flatMap((i) => i);
    const counters: Counters = types.reduce((acc, { id }) => {
      return { ...acc, [id]: 0 };
    }, {});

    blocks.forEach(({ type }) => {
      counters[type]++;
    });

    return counters;
  };

  filterData = (item: BlockData, currentFilter: BlocksFilter): boolean => {
    const typeMatch = currentFilter.type === item.type;
    const searchMatch =
      currentFilter.search === "" ||
      new RegExp(
        currentFilter.search.replace(/[.*+?^${}()|[\]\\]/g, ""),
        "i"
      ).test(item.keywords || item.title || "");
    const itemTags = item.tags ?? "";
    const isAll = currentFilter.tags === ALL_CAT;
    const isUnCategorised =
      currentFilter.tags === UNCATEGORISED_CAT && !itemTags.trim();
    const persistTags = itemTags.split(",").includes(currentFilter.tags);
    const tagMatch = isAll || isUnCategorised || persistTags;

    return typeMatch && searchMatch && tagMatch;
  };

  handleImport = (): void => {
    const { types, onImport } = this.props;

    if (typeof onImport === "function") {
      const type = this.getActiveType(types);

      onImport(type);
    }
  };

  handleExport = (): void => {
    const { items, types, onExport } = this.props;
    const type = this.getActiveType(types);
    const blocks = items[type];

    if (typeof onExport === "function" && blocks) {
      const blockIds = blocks
        .filter((item) => this.filterData(item, this.currentFilter))
        .map((block) => block.uid);

      onExport(blockIds, type);
    }
  };

  renderLoading(): ReactElement {
    return (
      <div className="brz-ed-popup-two-body__content brz-ed-popup-two-body__content--loading">
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </div>
    );
  }

  renderEmpty(): ReactElement {
    const { type, types, onImport } = this.props;
    const { search } = this.currentFilter;
    const activeType = this.getActiveType(types);
    const style = {
      width: activeType === "LAYOUT" ? "524px" : "322px"
    };
    let gifImg = "editor/img/save_toolbar.gif";
    let message = t("Nothing here yet, save a block first.");
    const showImport = typeof onImport === "function";

    if (type === "popup") {
      gifImg = "editor/img/save_popups_toolbar.gif";
      message = t("Nothing here yet, save a popup first.");
    }

    if (activeType === "LAYOUT") {
      message = t("Nothing here yet, save a layout first.");
      gifImg = "editor/img/save_layout.gif";
    }

    return (
      <div className="brz-ed-popup-two-body__content brz-flex-xs-column">
        <div className="brz-ed-popup-two-blocks__grid brz-ed-popup-two-blocks__grid-clear">
          {search !== "" ? (
            <p className="brz-ed-popup-two-blocks__grid-clear-text">
              {t("Nothing here, please refine your search.")}
            </p>
          ) : (
            <>
              <p className="brz-ed-popup-two-blocks__grid-clear-text">
                {message}
              </p>
              <img
                key={activeType}
                style={style}
                src={assetUrl(gifImg)}
                className="brz-ed-popup-two-blocks__grid-clear-image-saved"
                alt="Saved"
              />
            </>
          )}
        </div>

        {showImport && (
          <Footer alignX="middle" alignY="middle">
            {this.renderImport()}
          </Footer>
        )}
      </div>
    );
  }

  renderItems(items: BlockData[], tags: string[]): ReactElement {
    const {
      showTitle,
      thumbnailSync,
      thumbnailDownload,
      isPro,
      isStory,
      upgradeToPro,
      config,
      onChange,
      onDelete,
      onExport,
      onImport,
      onUpdate
    } = this.props;
    const showImport = typeof onImport === "function";
    const showExport = typeof onExport === "function";
    const showImportExport = showImport || showExport;

    return (
      <div className="brz-ed-popup-two-body__content brz-flex-xs-column">
        <Scrollbars style={scrollStyle}>
          <ThumbnailGrid<BlockData>
            showSync={thumbnailSync}
            showTitle={showTitle}
            showDownload={thumbnailDownload}
            data={items}
            tags={tags}
            onThumbnailAdd={onChange}
            onThumbnailRemove={onDelete}
            onUpdate={onUpdate}
            isStory={isStory}
            isPro={isPro}
            upgradeToPro={upgradeToPro}
            config={config}
            {...(isStory ? storyGrid : {})}
          />
        </Scrollbars>
        {showImportExport && (
          <Footer alignX="middle" alignY="middle">
            {showExport && this.renderExport()}
            {showImport && this.renderImport()}
          </Footer>
        )}
      </div>
    );
  }

  renderImport(): ReactElement {
    const { importLoading, types } = this.props;
    const activeType = this.getActiveType(types);
    const className = classnames({ "brz-pointer-events-none": importLoading });
    const text =
      activeType === "POPUP"
        ? t("Import New Popup")
        : activeType === "BLOCK"
          ? t("Import New Block")
          : t("Import New Layout");

    return (
      <Button
        className={className}
        type="link"
        color="teal"
        loading={importLoading}
        size={2}
        onClick={this.handleImport}
      >
        {text}
      </Button>
    );
  }

  renderExport(): ReactElement {
    const { exportLoading, types } = this.props;
    const activeType = this.getActiveType(types);
    const text =
      activeType === "POPUP"
        ? t("Export All Popups")
        : activeType === "BLOCK"
          ? t("Export All Blocks")
          : t("Export All Layouts");

    return (
      <Button
        color="gray"
        loading={exportLoading}
        size={2}
        onClick={this.handleExport}
      >
        {text}
      </Button>
    );
  }

  render(): ReactElement {
    const {
      loading,
      items,
      types,
      showSearch,
      sidebarSync,
      HeaderSlotLeft,
      onFilterChange,
      onSuccessSync,
      config
    } = this.props;
    const data = Object.values(items)
      .filter(isT)
      .flatMap((i) => i);

    return (
      <DataFilter<BlockData, BlocksFilter>
        data={data}
        filterFn={this.filterData}
        defaultFilter={this.getDefaultFilter(data)}
      >
        {(filteredThumbnails, currentFilter, setFilter): ReactElement => {
          const tags = this.getAllCategories(data);
          const tagsWithoutAll = tags
            .filter(
              (tag) => tag.item !== ALL_CAT && tag.item !== UNCATEGORISED_CAT
            )
            .map((t) => t.item);

          return (
            <>
              {showSearch && (
                <HeaderSlotLeft>
                  <SearchInput
                    className="brz-ed-popup-two-header__search"
                    value={currentFilter.search}
                    onChange={(value: string): void => {
                      setFilter({ search: value });
                      this.currentFilter.search = value;
                    }}
                  />
                </HeaderSlotLeft>
              )}

              <Sidebar>
                <SidebarOption title={t("LIBRARY")}>
                  <SidebarList
                    lists={types}
                    counters={this.getTypesCounters()}
                    value={currentFilter.type}
                    onChange={(value: BlocksFilter["type"]): void => {
                      setFilter({ type: value, tags: ALL_CAT });
                      this.currentFilter.type = value;
                      this.currentFilter.tags = ALL_CAT;
                    }}
                  />
                </SidebarOption>

                <SidebarOption title={t("TAG")}>
                  <Select<string>
                    value={currentFilter.tags}
                    choices={tags}
                    onChange={(value) => {
                      setFilter({ tags: value });
                      this.currentFilter.tags = value;
                    }}
                  />
                </SidebarOption>

                {onFilterChange && this.hasFilter(currentFilter.type) && (
                  <SidebarOption
                    title={this.getFilterLabel(currentFilter.type)}
                  >
                    <Filter
                      type={currentFilter.type}
                      value={currentFilter.filter}
                      onChange={(value) => {
                        setFilter({ filter: value });
                        this.currentFilter.filter = value;
                        onFilterChange(value, currentFilter.type);
                      }}
                      api={config.api}
                    />
                  </SidebarOption>
                )}

                {sidebarSync && (
                  <SidebarOption separator={true}>
                    <CloudConnect onSuccessSync={onSuccessSync} />
                  </SidebarOption>
                )}
              </Sidebar>

              {loading
                ? this.renderLoading()
                : filteredThumbnails.length === 0
                  ? this.renderEmpty()
                  : this.renderItems(filteredThumbnails, tagsWithoutAll)}
            </>
          );
        }}
      </DataFilter>
    );
  }
}

export default Blocks;
