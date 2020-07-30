import React, { Component, ComponentType, ReactElement } from "react";
import _ from "underscore";
import Scrollbars from "react-custom-scrollbars";
import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";
import EditorIcon from "visual/component/EditorIcon";
import SearchInput from "../common/SearchInput";
import ThumbnailGrid from "../common/ThumbnailGrid";
import DataFilter from "../common/DataFilter";
import Sidebar, { SidebarList, SidebarOption } from "../common/Sidebar";
import CloudConnect from "./CloudConnect";
import { BlockCategory } from "../types";
import { ApiBlockMetaWithType, BlocksThumbs, BlockThumbs } from "./index";

type BlocksProps = {
  type: "normal" | "popup";
  showSearch: boolean;
  search: string;
  loading: boolean;
  items: BlocksThumbs;
  types: BlockCategory[];
  HeaderSlotLeft: ComponentType;
  onChange: (b: ApiBlockMetaWithType) => void;
  onDelete: (b: ApiBlockMetaWithType) => void;
  onSync?: (b: ApiBlockMetaWithType) => void;
  onSuccessSync: () => void;
};

type BlocksFilter = {
  type: string;
  search: string;
};

type Counters = {
  [k: string]: number;
};

const isWP = Boolean(Config.get("wp"));

class Blocks extends Component<BlocksProps> {
  static defaultProps: BlocksProps = {
    type: "normal",
    showSearch: true,
    search: "",
    loading: false,
    items: [],
    types: [],
    HeaderSlotLeft: Component,
    onChange: _.noop,
    onDelete: _.noop,
    onSync: _.noop,
    onSuccessSync: _.noop
  };

  currentType: null | string = null;

  getDefaultFilter = _.memoize(
    (types: BlockCategory[]): BlocksFilter => ({
      type: types.length ? types[0].id : "",
      search: ""
    })
  );

  getActiveType(types: BlockCategory[]): string {
    return this.currentType || types[0].id;
  }

  getTypesCounters = (): Counters => {
    const { items, types } = this.props;
    const counters: Counters = types.reduce((acc, { id }) => {
      return { ...acc, [id]: 0 };
    }, {});

    items.forEach(({ type }) => {
      counters[type]++;
    });

    return counters;
  };

  filterData = (
    item: ApiBlockMetaWithType & BlockThumbs,
    currentFilter: BlocksFilter
  ): boolean => {
    const typeMatch = currentFilter.type === item.type;
    const searchMatch =
      currentFilter.search === "" ||
      new RegExp(
        currentFilter.search.replace(/[.*+?^${}()|[\]\\]/g, ""),
        "i"
      ).test(item.keywords || "");

    return typeMatch && searchMatch;
  };

  renderLoading(): ReactElement {
    return (
      <div className="brz-ed-popup-two-body__content brz-ed-popup-two-body__content--loading">
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </div>
    );
  }

  renderEmpty(): ReactElement {
    const { type, types, search } = this.props;
    const activeType = this.getActiveType(types);
    const style = {
      width: activeType === "LAYOUT" ? "524px" : "322px"
    };
    let gifImg = "editor/img/save_toolbar.gif";
    let message = t("Nothing here yet, save a block first.");

    if (type === "popup") {
      gifImg = "editor/img/save_popups_toolbar.gif";
      message = t("Nothing here yet, save a popup first.");
    }

    if (activeType === "LAYOUT") {
      message = t("Nothing here yet, save a layout first.");
      gifImg = "editor/img/save_layout.gif";
    }

    return (
      <div className="brz-ed-popup-two-body__content">
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
      </div>
    );
  }

  renderItems(items: BlocksThumbs): ReactElement {
    const { onChange, onDelete, onSync } = this.props;

    return (
      <div className="brz-ed-popup-two-body__content">
        <Scrollbars>
          <ThumbnailGrid
            showSync={isWP}
            data={items}
            onThumbnailAdd={onChange}
            onThumbnailRemove={onDelete}
            onThumbnailSync={onSync}
          />
        </Scrollbars>
      </div>
    );
  }

  render(): ReactElement {
    const {
      loading,
      items,
      types,
      showSearch,
      HeaderSlotLeft,
      onSuccessSync
    } = this.props;

    return (
      <DataFilter
        data={items}
        filterFn={this.filterData}
        defaultFilter={this.getDefaultFilter(types)}
      >
        {(
          filteredThumbnails: BlocksThumbs,
          currentFilter: BlocksFilter,
          setFilter: (p: Partial<BlocksFilter>) => void
        ): ReactElement => {
          return (
            <>
              {showSearch && (
                <HeaderSlotLeft>
                  <SearchInput
                    className="brz-ed-popup-two-header__search"
                    value={currentFilter.search}
                    onChange={(value: string): void => {
                      setFilter({ search: value });
                    }}
                  />
                </HeaderSlotLeft>
              )}

              <Sidebar>
                <SidebarOption title="LIBRARY">
                  <SidebarList
                    lists={types}
                    counters={this.getTypesCounters()}
                    value={currentFilter.type}
                    onChange={(value: string): void => {
                      setFilter({ type: value });
                      this.currentType = value;
                    }}
                  />
                </SidebarOption>
                <SidebarOption separator={true}>
                  <CloudConnect onSuccessSync={onSuccessSync} />
                </SidebarOption>
              </Sidebar>

              {loading
                ? this.renderLoading()
                : filteredThumbnails.length === 0
                ? this.renderEmpty()
                : this.renderItems(filteredThumbnails)}
            </>
          );
        }}
      </DataFilter>
    );
  }
}

export default Blocks;
