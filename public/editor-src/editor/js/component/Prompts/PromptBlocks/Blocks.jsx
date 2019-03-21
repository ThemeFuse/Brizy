import React from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Sidebar from "./common/Sidebar";
import SearchInput from "./common/SearchInput";
import DataFilter from "./common/DataFilter";
import ThumbnailGrid from "./common/ThumbnailGrid";
import Editor from "visual/global/Editor";
import { blockTemplateThumbnailUrl } from "visual/utils/blocks";
import { t } from "visual/utils/i18n";

const defaultFilterUI = {
  sidebar: true,
  search: true,
  type: true, // dark | light
  categories: true
};

let defaultFilter = {
  type: 0,
  category: "*",
  search: ""
};

export default class Blocks extends React.Component {
  static defaultProps = {
    filterUI: defaultFilterUI,
    blocksConfig: null,
    onAddBlocks: _.noop,
    onClose: _.noop
  };

  constructor(props) {
    super(props);

    this.blocksConfig = props.blocksConfig || Editor.getBlocks();
  }

  handleThumbnailAdd = thumbnailData => {
    const { onAddBlocks, onClose } = this.props;
    const resolve = { ...thumbnailData.resolve, blockId: thumbnailData.id };

    onAddBlocks(resolve);
    onClose();
  };

  render() {
    const { filterUI, HeaderSlotLeft } = this.props;
    const thumbnails = this.blocksConfig.blocks.map(block => ({
      ...block,
      thumbnailSrc: blockTemplateThumbnailUrl(block)
    }));
    const filterFn = (item, cf) => {
      const typeMatch = cf.type === item.type;

      const categoryMatch =
        cf.category === "*" || item.cat.includes(Number(cf.category));

      const searchMatch =
        cf.search === "" ||
        new RegExp(cf.search.replace(/[.*+?^${}()|[\]\\]/g, ""), "i").test(
          item.keywords
        );

      return typeMatch && categoryMatch && searchMatch;
    };

    const blocksArr = this.blocksConfig.blocks;
    const countersColorBlocks = {};
    const countersSectionBlocks = {};
    const types = this.blocksConfig.types;
    const categories = [
      {
        id: "*",
        title: t("All Categories")
      },
      ...this.blocksConfig.categories
    ].filter(category => category.hidden !== true);

    return (
      <DataFilter
        data={thumbnails}
        filterFn={filterFn}
        defaultFilter={defaultFilter}
      >
        {(filteredThumbnails, currentFilter, setFilter) => {
          defaultFilter.type = currentFilter.type;

          if (!countersColorBlocks[currentFilter.type]) {
            for (let i = 0; i < blocksArr.length; i++) {
              const blockType = blocksArr[i].type; // dark | light
              const blockCategories = blocksArr[i].cat; // header | footer etc.

              if (countersColorBlocks[blockType] === undefined) {
                countersColorBlocks[blockType] = 1;
              } else {
                countersColorBlocks[blockType]++;
              }

              if (currentFilter.type === blockType) {
                countersSectionBlocks["*"] = countersColorBlocks[blockType];

                for (let j = 0; j < blockCategories.length; j++) {
                  const category = blockCategories[j];

                  if (countersSectionBlocks[category] === undefined) {
                    countersSectionBlocks[category] = 1;
                  } else {
                    countersSectionBlocks[category]++;
                  }
                }
              }
            }
          }

          return (
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
                    className="brz-ed-scroll--new-dark brz-ed-scroll--medium"
                  >
                    <div className="brz-ed-popup-two-sidebar-body">
                      {filterUI.type && (
                        <Sidebar
                          title="STYLES"
                          options={types}
                          counters={countersColorBlocks}
                          value={currentFilter.type}
                          onChange={value => setFilter({ type: value })}
                        />
                      )}
                      {filterUI.categories && (
                        <Sidebar
                          options={categories}
                          counters={countersSectionBlocks}
                          value={currentFilter.category}
                          onChange={value => setFilter({ category: value })}
                        />
                      )}
                    </div>
                  </ScrollPane>
                </div>
              )}

              <div className="brz-ed-popup-two-body__content">
                <ScrollPane
                  style={{
                    overflow: "hidden",
                    height: "100%"
                  }}
                  className="brz-ed-scroll--new-dark brz-ed-scroll--medium"
                >
                  {filteredThumbnails.length > 1 ? (
                    <ThumbnailGrid
                      data={filteredThumbnails}
                      onThumbnailAdd={this.handleThumbnailAdd}
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
          );
        }}
      </DataFilter>
    );
  }
}
