import React, { Component } from "react";
import _ from "underscore";
import Scrollbars from "react-custom-scrollbars";
import EditorIcon from "visual/component/EditorIcon";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import Sidebar, { SidebarList, SidebarOption } from "../common/Sidebar";
import SearchInput from "../common/SearchInput";
import DataFilter from "../common/DataFilter";
import ThumbnailGrid from "../common/ThumbnailGrid";
import { t } from "visual/utils/i18n";

let defaultFilter = {
  type: 0,
  category: "*",
  search: ""
};

class Blocks extends Component {
  static defaultProps = {
    showSidebar: true,
    showSearch: true,
    loading: false,
    kits: [],
    styles: [],
    types: [],
    categories: [],
    blocks: [],
    HeaderSlotLeft: _.noop,
    onAddBlocks: _.noop,
    onClose: _.noop,
    onChange: _.noop,
    onChangeKit: _.noop
  };

  filterData = (item, currentFilter) => {
    const typeMatch = currentFilter.type === item.type;
    const categoryMatch =
      currentFilter.category === "*" ||
      item.cat.includes(Number(currentFilter.category));

    const searchMatch =
      currentFilter.search === "" ||
      new RegExp(
        currentFilter.search.replace(/[.*+?^${}()|[\]\\]/g, ""),
        "i"
      ).test(item.keywords);

    return typeMatch && categoryMatch && searchMatch;
  };

  getTypesCounters() {
    const { blocks, types } = this.props;
    const counters = types.reduce((acc, { id }) => {
      return Object.assign(acc, { [id]: 0 });
    }, {});

    blocks.forEach(({ type }) => {
      counters[type]++;
    });

    return counters;
  }

  getCategoriesCounter(type) {
    let { blocks, types, showType } = this.props;
    let allCategoriesCount = blocks.length;

    if (showType && types.length) {
      blocks = blocks.filter(block => block.type === type);
      allCategoriesCount = blocks.length;
    }

    return blocks.reduce(
      (acc, { cat }) => {
        cat.forEach(cat => {
          if (acc[cat]) {
            Object.assign(acc, { [cat]: ++acc[cat] });
          } else {
            Object.assign(acc, { [cat]: 1 });
          }
        });

        return acc;
      },
      { "*": allCategoriesCount }
    );
  }

  renderLoading() {
    const { showSidebar, showSearch, HeaderSlotLeft } = this.props;

    return (
      <>
        {showSearch && (
          <HeaderSlotLeft>
            <SearchInput className="brz-ed-popup-two-header__search" />
          </HeaderSlotLeft>
        )}
        {showSidebar && (
          <div className="brz-ed-popup-two-body__sidebar">
            <div className="brz-ed-popup-two-sidebar-body" />
          </div>
        )}
        <div className="brz-ed-popup-two-body__content brz-ed-popup-two-body__content--loading">
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        </div>
      </>
    );
  }

  render() {
    const {
      loading,
      kits,
      blocks,
      types,
      categories,
      selectedKit,
      showSearch,
      showSidebar,
      HeaderSlotLeft,
      onChangeKit,
      onChange
    } = this.props;

    if (loading) {
      return this.renderLoading();
    }

    const showImportKit =
      kits.filter(({ id }) => id !== selectedKit).length > 0;
    const showType = types.length > 0;
    const showCategories = categories.length > 0;

    return (
      <DataFilter
        data={blocks}
        filterFn={this.filterData}
        defaultFilter={defaultFilter}
      >
        {(filteredThumbnails, currentFilter, setFilter) => {
          defaultFilter.type = currentFilter.type;

          return (
            <>
              {showSearch && (
                <HeaderSlotLeft>
                  <SearchInput
                    className="brz-ed-popup-two-header__search"
                    value={currentFilter.search}
                    onChange={value => setFilter({ search: value })}
                  />
                </HeaderSlotLeft>
              )}

              {showSidebar && (
                <Sidebar>
                  {showImportKit && (
                    <SidebarOption title="BLOCKS">
                      <Select
                        defaultValue={selectedKit}
                        className="brz-control__select--dark brz-control__select--full-width"
                        maxItems="6"
                        itemHeight="30"
                        onChange={onChangeKit}
                      >
                        {kits.map(({ id, name }, index) => (
                          <SelectItem key={index} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                      </Select>
                    </SidebarOption>
                  )}
                  {showType && (
                    <SidebarOption title="STYLES">
                      <SidebarList
                        lists={types}
                        counters={this.getTypesCounters()}
                        value={currentFilter.type}
                        onChange={value => setFilter({ type: value })}
                      />
                    </SidebarOption>
                  )}
                  {showCategories && (
                    <SidebarOption title="CATEGORIES">
                      <SidebarList
                        lists={categories}
                        counters={this.getCategoriesCounter(currentFilter.type)}
                        value={currentFilter.category}
                        onChange={value => setFilter({ category: value })}
                      />
                    </SidebarOption>
                  )}
                </Sidebar>
              )}

              <div className="brz-ed-popup-two-body__content">
                <Scrollbars>
                  {filteredThumbnails.length > 0 ? (
                    <ThumbnailGrid
                      data={filteredThumbnails}
                      onThumbnailAdd={onChange}
                    />
                  ) : (
                    <div className="brz-ed-popup-two-blocks__grid brz-ed-popup-two-blocks__grid-clear">
                      <p className="brz-ed-popup-two-blocks__grid-clear-text">
                        {t("Nothing here, please refine your search.")}
                      </p>
                    </div>
                  )}
                </Scrollbars>
              </div>
            </>
          );
        }}
      </DataFilter>
    );
  }
}

export default Blocks;
