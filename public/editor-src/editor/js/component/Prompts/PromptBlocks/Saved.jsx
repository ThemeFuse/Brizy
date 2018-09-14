import React from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import DataFilter from "./common/DataFilter";
import Select from "./common/Select";
import SearchInput from "./common/SearchInput";
import ThumbnailGrid from "./common/ThumbnailGrid";
import Editor from "visual/global/Editor";
import { blockThumbnailUrl } from "visual/utils/blocks";
import { getStore } from "visual/redux/store";
import { updateGlobals } from "visual/redux/actionCreators";
import { t } from "visual/utils/i18n";

export default class Saved extends React.Component {
  static defaultProps = {
    filterUI: {},
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
    const { resolve } = thumbnailData;

    onAddBlocks(resolve);
    onClose();
  };

  handleThumbnailRemove = thumbnailData => {
    const store = getStore();
    const savedBlocks = store.getState().globals.project.savedBlocks || [];
    const newSavedBlocks = _.without(savedBlocks, thumbnailData.resolve);

    store.dispatch(updateGlobals("savedBlocks", newSavedBlocks));
  };

  render() {
    const { filterUI } = this.props;

    const savedBlocks = getStore().getState().globals.project.savedBlocks || [];
    const thumbnails = savedBlocks.reduce((acc, block) => {
      const blockData = Editor.getBlock(block.blockId);
      if (!blockData) {
        return acc;
      }

      const inCategories =
        this.blocksConfig.categories.find(cat =>
          blockData.cat.includes(cat.id)
        ) !== undefined;
      if (!inCategories) {
        return acc;
      }

      const { thumbnailWidth, thumbnailHeight, keywords, cat } = blockData;

      acc.push({
        id: block.blockId,
        thumbnailSrc: blockThumbnailUrl(blockData),
        thumbnailWidth,
        thumbnailHeight,
        showRemoveIcon: true,
        keywords,
        cat,
        type: this.id,
        resolve: block
      });

      return acc;
    }, []);
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
        {(filteredThumbnails, currentFilter, setFilter) => (
          <React.Fragment>
            <div className="brz-ed-popup__head--search brz-d-xs-flex brz-align-items-center brz-justify-content-xs-center">
              {filterUI.categories !== false && (
                <Select
                  className="brz-ed-popup__select--block-categories"
                  options={categories}
                  value={currentFilter.category}
                  onChange={value => setFilter({ category: value })}
                />
              )}
              {filterUI.search !== false && (
                <SearchInput
                  value={currentFilter.search}
                  onChange={value => setFilter({ search: value })}
                />
              )}
            </div>
            <div className="brz-ed-popup-blocks-body">
              <ScrollPane
                style={{ height: 400, overflow: "hidden" }}
                className="brz-ed-scroll-pane brz-ed-scroll__popup"
              >
                <ThumbnailGrid
                  data={filteredThumbnails}
                  onThumbnailAdd={this.handleThumbnailAdd}
                  onThumbnailRemove={this.handleThumbnailRemove}
                />
              </ScrollPane>
            </div>
          </React.Fragment>
        )}
      </DataFilter>
    );
  }
}
