import { noop } from "es-toolkit";
import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import EditorIcon from "visual/component/EditorIcon";
import { EditorModeContext } from "visual/providers/EditorModeProvider";
import { t } from "visual/utils/i18n";
import DataFilter from "../common/DataFilter";
import SearchInput from "../common/SearchInput";
import Sidebar, { SidebarList, SidebarOption } from "../common/Sidebar";
import ThumbnailGrid from "../common/ThumbnailGrid";

let defaultFilter = {
  type: "light",
  category: "*",
  search: ""
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
    HeaderSlotLeft: noop,
    onAddBlocks: noop,
    onClose: noop,
    onChange: noop,
    onChangeKit: noop,
    isPro: false,
    isStory: false,
    upgradeToPro: ""
  };

  adjustFilter() {
    const { types } = this.props;
    const machTypes = types.find((type) => type.name === defaultFilter.type);

    if (types.length && machTypes === undefined) {
      defaultFilter.type = types[0].name;
    }
  }

  filterData = (item, currentFilter) => {
    const filterByType = item.type.length >= 1;
    const filterByCategory = item.cat.length > 0;

    const typeMatch = !filterByType || item.type.includes(currentFilter.type);

    const isBlank = item.id === "blank";

    const _categoryMatch =
      currentFilter.category === "*" ||
      item.cat.includes(currentFilter.category);

    const categoryMatch = isBlank
      ? _categoryMatch
      : !filterByCategory || _categoryMatch;

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
      type.forEach((item) => counters[item]++);
    });

    return counters;
  }

  getCategoriesCounter(type) {
    let { blocks, types, showType } = this.props;
    let allCategoriesCount = blocks.length;

    if (showType && types.length) {
      blocks = blocks.filter((block) => block.type === type);
      allCategoriesCount = blocks.length;
    }

    return blocks.reduce(
      (acc, { cat }) => {
        cat.forEach((cat) => {
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
      onChange,
      isPro,
      isStory,
      upgradeToPro
    } = this.props;

    if (loading) {
      return this.renderLoading();
    }

    if (types.length < 2) {
      this.adjustFilter();
    }

    const showImportKit =
      kits.filter(({ id }) => id !== selectedKit).length > 0;
    const showType = types.length > 1;
    const showCategories = categories.length > 1;

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
                    onChange={(value) => setFilter({ search: value })}
                  />
                </HeaderSlotLeft>
              )}

              {showSidebar && (
                <Sidebar>
                  {showImportKit && (
                    <SidebarOption title={t("BLOCKS")}>
                      <Select
                        defaultValue={selectedKit}
                        className="brz-control__select--dark brz-control__select--full-width"
                        maxItems="6"
                        itemHeight="30"
                        onChange={onChangeKit}
                      >
                        {kits.map(({ id, title }, index) => (
                          <SelectItem key={index} value={id}>
                            {title}
                          </SelectItem>
                        ))}
                      </Select>
                    </SidebarOption>
                  )}
                  {showType && (
                    <SidebarOption title={t("STYLES")}>
                      <SidebarList
                        lists={types}
                        counters={this.getTypesCounters()}
                        value={currentFilter.type}
                        onChange={(value) => setFilter({ type: value })}
                      />
                    </SidebarOption>
                  )}
                  {showCategories && (
                    <SidebarOption title={t("CATEGORIES")}>
                      <SidebarList
                        lists={categories}
                        counters={this.getCategoriesCounter(currentFilter.type)}
                        value={currentFilter.category}
                        onChange={(value) => setFilter({ category: value })}
                      />
                    </SidebarOption>
                  )}
                </Sidebar>
              )}

              <div className="brz-ed-popup-two-body__content">
                <Scrollbars>
                  {filteredThumbnails.length > 0 ? (
                    <EditorModeContext.Consumer>
                      {({ mode }) => (
                        <ThumbnailGrid
                          data={filteredThumbnails}
                          onThumbnailAdd={onChange}
                          isStory={isStory}
                          isPro={isPro}
                          upgradeToPro={upgradeToPro}
                          editorMode={mode}
                          {...(isStory ? storyGrid : {})}
                        />
                      )}
                    </EditorModeContext.Consumer>
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
