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

export default class Global extends React.Component {
  handleThumbnailAdd = thumbnailData => {
    const { onAddBlocks, onClose } = this.props;
    const { resolve } = thumbnailData;

    onAddBlocks(resolve);
    onClose();
  };

  handleThumbnailRemove = thumbnailData => {
    const store = getStore();
    const globalBlocks = store.getState().globals.project.globalBlocks || {};
    const { globalBlockId } = thumbnailData.resolve.value;
    const newGlobalBlocks = {
      ...globalBlocks,
      [globalBlockId]: {
        ...globalBlocks[globalBlockId],
        deleted: true
      }
    };

    store.dispatch(updateGlobals("globalBlocks", newGlobalBlocks));
  };

  render() {
    const globalBlocks =
      getStore().getState().globals.project.globalBlocks || {};
    const thumbnails = Object.entries(globalBlocks).reduce(
      (acc, [globalBlockId, block]) => {
        if (block.deleted) {
          return acc;
        }

        const blockData = Editor.getBlock(block.blockId);
        if (!blockData) {
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
          resolve: {
            type: "GlobalBlock",
            blockId: block.blockId,
            value: { globalBlockId }
          }
        });

        return acc;
      },
      []
    );
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
