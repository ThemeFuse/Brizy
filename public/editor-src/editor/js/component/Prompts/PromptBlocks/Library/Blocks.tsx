import React, {
  ChangeEvent,
  Component,
  ComponentType,
  CSSProperties,
  ReactElement
} from "react";
import _ from "underscore";
import Scrollbars from "react-custom-scrollbars";
import classnames from "classnames";
import { isT } from "fp-utilities";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";
import EditorIcon from "visual/component/EditorIcon";
import SearchInput from "../common/SearchInput";
import ThumbnailGrid from "../common/ThumbnailGrid";
import DataFilter from "../common/DataFilter";
import Sidebar, { SidebarList, SidebarOption } from "../common/Sidebar";
import CloudConnect from "./CloudConnect";
import { BlockCategory, BlockTypes } from "../types";
import { BlockData } from "./index";
import { Button } from "../../common/Button";
import { Footer } from "../common/Footer";

export interface Props {
  type: "normal" | "popup";
  showSearch: boolean;
  sidebarSync: boolean;
  thumbnailSync?: boolean;
  thumbnailDownload?: boolean;
  importLoading?: boolean;
  exportLoading?: boolean;
  search: string;
  loading: boolean;
  items: Partial<Record<BlockTypes, BlockData[]>>;
  types: BlockCategory[];
  HeaderSlotLeft: ComponentType;
  onChange: (b: BlockData) => void;
  onDelete: (b: BlockData) => void;
  onSync?: (b: BlockData) => void;
  onExport?: (i: string[], type: BlockTypes) => void;
  onImport?: (f: FileList, type: BlockTypes) => void;
  onSuccessSync: VoidFunction;
}

interface BlocksFilter {
  type: BlockTypes;
  search: string;
}

interface Counters {
  [k: string]: number;
}

const scrollStyle: CSSProperties = {
  flex: 1
};

class Blocks extends Component<Props> {
  static defaultProps: Props = {
    type: "normal",
    showSearch: true,
    sidebarSync: true,
    search: "",
    loading: false,
    items: {},
    types: [],
    HeaderSlotLeft: Component,
    onChange: _.noop,
    onDelete: _.noop,
    onSuccessSync: _.noop
  };

  importRef = React.createRef<HTMLInputElement>();

  currentFilter: BlocksFilter = {
    type: this.props.types[0]?.id ?? "BLOCK",
    search: ""
  };

  getDefaultFilter = _.memoize(
    (types: BlockCategory[]): BlocksFilter => ({
      type: types.length ? types[0].id : "BLOCK",
      search: ""
    })
  );

  getActiveType(types: BlockCategory[]): BlockCategory["id"] {
    return this.currentFilter.type || types[0].id;
  }

  getTypesCounters = (): Counters => {
    const { items, types } = this.props;
    const blocks = Object.values(items)
      .filter(isT)
      .flatMap(i => i);
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
      ).test(item.keywords || "");

    return typeMatch && searchMatch;
  };

  handleImport = (e: ChangeEvent<HTMLInputElement>): void => {
    const { types, onImport } = this.props;
    const files = e.target.files;

    if (files?.length && typeof onImport === "function") {
      const type = this.getActiveType(types);
      const node = this.importRef.current;

      onImport(files, type);

      // reset value after input have some files
      if (node !== null) {
        node.value = "";
      }
    }
  };

  handleExport = (): void => {
    const { items, types, onExport } = this.props;
    const type = this.getActiveType(types);
    const blocks = items[type];

    if (typeof onExport === "function" && blocks) {
      const blockIds = blocks
        .filter(item => this.filterData(item, this.currentFilter))
        .map(block => block.uid);

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
    const { type, types, search, onImport } = this.props;
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

  renderItems(items: BlockData[]): ReactElement {
    const {
      thumbnailSync,
      thumbnailDownload,
      onChange,
      onDelete,
      onExport,
      onImport
    } = this.props;
    const showImport = typeof onImport === "function";
    const showExport = typeof onExport === "function";
    const showImportExport = showImport || showExport;

    return (
      <div className="brz-ed-popup-two-body__content brz-flex-xs-column">
        <Scrollbars style={scrollStyle}>
          <ThumbnailGrid<BlockData>
            showSync={thumbnailSync}
            showDownload={thumbnailDownload}
            data={items}
            onThumbnailAdd={onChange}
            onThumbnailRemove={onDelete}
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
    const className = classnames(
      "brz-label brz-ed-popup-two-body__content--import",
      { "brz-pointer-events-none": importLoading }
    );
    const text =
      activeType === "POPUP"
        ? t("Import New Popup")
        : activeType === "BLOCK"
        ? t("Import New Block")
        : t("Import New Layout");

    return (
      <label className={className}>
        <Button type="link" color="teal" loading={importLoading} size={2}>
          {text}
        </Button>
        <input
          ref={this.importRef}
          hidden
          className="brz-input"
          type="file"
          accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
          onChange={this.handleImport}
        />
      </label>
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
      onSuccessSync
    } = this.props;
    const data = Object.values(items)
      .filter(isT)
      .flatMap(i => i);

    return (
      <DataFilter<BlockData, BlocksFilter>
        data={data}
        filterFn={this.filterData}
        defaultFilter={this.getDefaultFilter(types)}
      >
        {(filteredThumbnails, currentFilter, setFilter): ReactElement => {
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
                <SidebarOption title="LIBRARY">
                  <SidebarList
                    lists={types}
                    counters={this.getTypesCounters()}
                    value={currentFilter.type}
                    onChange={(value: BlocksFilter["type"]): void => {
                      setFilter({ type: value });
                      this.currentFilter.type = value;
                    }}
                  />
                </SidebarOption>

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
                : this.renderItems(filteredThumbnails)}
            </>
          );
        }}
      </DataFilter>
    );
  }
}

export default Blocks;
