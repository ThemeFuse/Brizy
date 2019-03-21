import React from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import DataFilter from "../common/DataFilter";
import Sidebar from "../common/Sidebar";
import SearchInput from "../common/SearchInput";
import ThumbnailGrid from "../common/ThumbnailGrid";
import { LayoutThumbnail } from "../common/Thumbnail";
import Editor from "visual/global/Editor";
import { templateThumbnailUrl } from "visual/utils/templates";
import { t } from "visual/utils/i18n";

const defaultFilterUI = {
  sidebar: true,
  search: true
};

export default class List extends React.Component {
  static defaultProps = {
    filterUI: defaultFilterUI,
    templatesConfig: null,
    onAddBlocks: _.noop,
    onClose: _.noop,
    onNext: _.noop
  };

  constructor(...args) {
    super(...args);

    this.templatesConfig = this.props.templatesConfig || Editor.getTemplates();
  }

  handleThumbnailAdd = thumbnailData => {
    this.props.onNext(thumbnailData);
  };

  render() {
    const { filterUI, HeaderSlotLeft } = this.props;
    const { templates } = this.templatesConfig;
    const thumbnails = Object.values(templates).map(el => ({
      ...el,
      ...el.pages[0],
      thumbnailSrc: templateThumbnailUrl(el.pages[0])
    }));
    const filterFn = (item, cf) => {
      const categoryMatch =
        cf.category === "*" || item.cat.includes(Number(cf.category));
      const searchMatch =
        cf.search === "" ||
        new RegExp(cf.search.replace(/[.*+?^${}()|[\]\\]/g, ""), "i").test(
          item.keywords
        );

      return categoryMatch && searchMatch;
    };
    const defaultFilter = {
      category: "*",
      search: ""
    };
    const blocksArr = Object.values(templates).reduce((acc, cur) => {
      return acc.concat(cur);
    }, []);
    const countersSectionBlocks = {};

    for (let i = 0; i < blocksArr.length; i++) {
      const sectionCat = blocksArr[i].cat;

      for (let j = 0; j < sectionCat.length; j++) {
        const sectionCatPro = sectionCat[j];
        countersSectionBlocks["*"] = blocksArr.length;

        if (countersSectionBlocks[sectionCatPro] === undefined) {
          countersSectionBlocks[sectionCatPro] = 1;
        } else {
          countersSectionBlocks[sectionCatPro]++;
        }
      }
    }
    const categories = [
      {
        id: "*",
        title: t("All Categories")
      }
    ].concat(this.templatesConfig.categories);

    return (
      <DataFilter
        data={thumbnails}
        filterFn={filterFn}
        defaultFilter={defaultFilter}
      >
        {(filteredThumbnails, currentFilter, setFilter) => (
          <React.Fragment>
            {filterUI.search && (
              <HeaderSlotLeft>
                <SearchInput
                  className="brz-ed-popup-two-header__search"
                  value={currentFilter.search}
                  onChange={value => setFilter({ search: value })}
                />
              </HeaderSlotLeft>
            )}

            {filterUI.sidebar && (
              <div className="brz-ed-popup-two-body__sidebar">
                <ScrollPane
                  style={{
                    overflow: "hidden",
                    height: "100%"
                  }}
                  className="brz-ed-scroll--medium brz-ed-scroll--new-dark"
                >
                  <div className="brz-ed-popup-two-sidebar-body">
                    <Sidebar
                      options={categories}
                      value={currentFilter.category}
                      counters={countersSectionBlocks}
                      onChange={value => setFilter({ category: value })}
                    />
                  </div>
                </ScrollPane>
              </div>
            )}

            <div className="brz-ed-popup-two-body__content brz-ed-popup-two-blocks-body-layouts">
              <ScrollPane
                style={{
                  overflow: "hidden",
                  height: "100%"
                }}
                className="brz-ed-scroll--medium brz-ed-scroll--new-dark"
              >
                {filteredThumbnails.length > 1 ? (
                  <ThumbnailGrid
                    data={filteredThumbnails}
                    ThumbnailComponent={LayoutThumbnail}
                    onThumbnailAdd={this.handleThumbnailAdd}
                    onThumbnailRemove={this.handleThumbnailRemove}
                  />
                ) : (
                  <div className="brz-ed-popup-two-blocks__grid brz-ed-popup-two-blocks__grid-clear">
                    <p className="brz-ed-popup-two-blocks__grid-clear-text">
                      {t("Nothing here, please refine your search.")}
                    </p>
                  </div>
                )}
              </ScrollPane>
            </div>
          </React.Fragment>
        )}
      </DataFilter>
    );
  }
}
