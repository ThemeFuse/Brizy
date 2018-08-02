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
    const savedBlocks = getStore().getState().globals.project.savedBlocks || [];
    const thumbnails = savedBlocks
      .filter(block => Editor.getBlock(block.blockId) != null)
      .map(block => {
        const blockData = Editor.getBlock(block.blockId);
        const { thumbnailWidth, thumbnailHeight, keywords, cat } = blockData;

        return {
          id: block.blockId,
          thumbnailSrc: blockThumbnailUrl(blockData),
          thumbnailWidth,
          thumbnailHeight,
          showRemoveIcon: true,
          keywords,
          cat,
          type: this.id,
          resolve: block
        };
      });
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
      }
    ].concat(Editor.getBlocks().categories);

    return (
      <DataFilter
        data={thumbnails}
        filterFn={filterFn}
        defaultFilter={defaultFilter}
      >
        {(filteredThumbnails, currentFilter, setFilter) => (
          <React.Fragment>
            <div className="brz-ed-popup__head--search brz-d-xs-flex brz-align-items-center brz-justify-content-xs-center">
              <Select
                className="brz-ed-popup__select--block-categories"
                options={categories}
                value={currentFilter.category}
                onChange={value => setFilter({ category: value })}
              />
              <SearchInput
                value={currentFilter.search}
                onChange={value => setFilter({ search: value })}
              />
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
