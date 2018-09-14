import React from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import DataFilter from "./common/DataFilter";
import Select from "./common/Select";
import SearchInput from "./common/SearchInput";
import ThumbnailGrid from "./common/ThumbnailGrid";
import Editor from "visual/global/Editor";
import { blockThumbnailUrl } from "visual/utils/blocks";
import { t } from "visual/utils/i18n";

export default class Blocks extends React.Component {
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
    const resolve = { ...thumbnailData.resolve, blockId: thumbnailData.id };

    onAddBlocks(resolve);
    onClose();
  };

  render() {
    const { filterUI } = this.props;

    const thumbnails = this.blocksConfig.blocks.map(block => ({
      ...block,
      thumbnailSrc: blockThumbnailUrl(block)
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
    const defaultFilter = {
      type: 0,
      category: "*",
      search: ""
    };

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
        {(filteredThumbnails, currentFilter, setFilter) => (
          <React.Fragment>
            <div className="brz-ed-popup__head--search brz-d-xs-flex brz-align-items-center brz-justify-content-xs-center">
              {filterUI.type !== false && (
                <Select
                  options={types}
                  value={currentFilter.type}
                  onChange={value => setFilter({ type: value })}
                />
              )}
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
                style={{
                  height: 400,
                  overflow: "hidden"
                }}
                className="brz-ed-scroll-pane brz-ed-scroll__popup"
              >
                <ThumbnailGrid
                  data={filteredThumbnails}
                  onThumbnailAdd={this.handleThumbnailAdd}
                />
              </ScrollPane>
            </div>
          </React.Fragment>
        )}
      </DataFilter>
    );
  }
}
