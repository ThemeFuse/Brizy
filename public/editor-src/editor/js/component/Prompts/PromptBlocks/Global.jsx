import React from "react";
import { connect } from "react-redux";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import DataFilter from "./common/DataFilter";
import SearchInput from "./common/SearchInput";
import ThumbnailGrid from "./common/ThumbnailGrid";
import Editor from "visual/global/Editor";
import { assetUrl } from "visual/utils/asset";
import {
  blockThumbnailData,
  placeholderBlockThumbnailUrl
} from "visual/utils/blocks";
import { globalBlocksSelector } from "visual/redux/selectors";
import { updateGlobalBlock } from "visual/redux/actions";
import { t } from "visual/utils/i18n";

class Global extends React.Component {
  static defaultProps = {
    filterUI: {
      search: true
    },
    blocksConfig: null,
    onAddBlocks: _.noop,
    onClose: _.noop
  };

  constructor(props) {
    super(props);

    this.blocksConfig = props.blocksConfig || Editor.getBlocks();
  }

  state = {
    value: ""
  };

  handleThumbnailAdd = thumbnailData => {
    const { onAddBlocks, onClose } = this.props;
    const { resolve } = thumbnailData;

    onAddBlocks(resolve);
    onClose();
  };

  handleThumbnailRemove = thumbnailData => {
    const { globalBlocks, updateGlobalBlock } = this.props;
    const { id } = thumbnailData;
    const globalBlock = globalBlocks[id];

    updateGlobalBlock({
      id,
      data: {
        ...globalBlock,
        deleted: true
      },
      meta: {
        is_autosave: 0
      }
    });
  };

  renderDataFilter(thumbnails) {
    const { HeaderSlotLeft, filterUI } = this.props;
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
            <div className="brz-ed-popup-two-body__content">
              <ScrollPane
                style={{
                  overflow: "hidden",
                  height: "100%"
                }}
                className="brz-ed-scroll--medium brz-ed-scroll--new-dark"
              >
                {filteredThumbnails.length > 0 ? (
                  <ThumbnailGrid
                    data={filteredThumbnails}
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

  renderClear() {
    const { HeaderSlotLeft, filterUI } = this.props;

    return (
      <React.Fragment>
        {filterUI.search && (
          <HeaderSlotLeft>
            <SearchInput
              className="brz-ed-popup-two-header__search"
              value={this.state.value}
              onChange={value => this.setState({ value })}
            />
          </HeaderSlotLeft>
        )}
        <div className="brz-ed-popup-two-body__content">
          <div className="brz-ed-popup-two-blocks__grid brz-ed-popup-two-blocks__grid-clear">
            {this.state.value !== "" ? (
              <p className="brz-ed-popup-two-blocks__grid-clear-text">
                {t("Nothing here, please refine your search.")}
              </p>
            ) : (
              <React.Fragment>
                <p className="brz-ed-popup-two-blocks__grid-clear-text">
                  {t("Nothing here yet, make a global block first.")}
                </p>
                <img
                  src={`${assetUrl(
                    "editor/img/global_toolbar.gif"
                  )}?${Math.random()}`}
                  className="brz-ed-popup-two-blocks__grid-clear-image-global"
                />
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { globalBlocks } = this.props;
    const thumbnails = Object.entries(globalBlocks).reduce(
      (acc, [globalBlockId, block]) => {
        if (block.deleted) {
          return acc;
        }

        const blockData = Editor.getBlock(block.blockId);
        let thumbnailData;

        if (!blockData) {
          if (
            !this.blocksConfig.allowMissing ||
            !this.blocksConfig.allowMissing(block)
          ) {
            return acc;
          }

          thumbnailData = {
            id: globalBlockId,
            thumbnailSrc: placeholderBlockThumbnailUrl(),
            thumbnailWidth: 500,
            thumbnailHeight: 200,
            showRemoveIcon: true,
            keywords: "",
            cat: [],
            type: -1,
            resolve: {
              type: "GlobalBlock",
              blockId: block.blockId,
              value: { globalBlockId }
            }
          };
        } else {
          const inCategories =
            this.blocksConfig.categories.find(cat =>
              blockData.cat.includes(cat.id)
            ) !== undefined;
          if (!inCategories) {
            return acc;
          }

          const { keywords, cat } = blockData;
          const { url, width, height } = blockThumbnailData(block);

          thumbnailData = {
            id: globalBlockId,
            thumbnailSrc: url,
            thumbnailWidth: width,
            thumbnailHeight: height,
            showRemoveIcon: true,
            keywords,
            cat,
            type: this.id,
            resolve: {
              type: "GlobalBlock",
              blockId: block.blockId,
              value: { globalBlockId }
            }
          };
        }

        acc.push(thumbnailData);

        return acc;
      },
      []
    );
    return thumbnails.length > 0
      ? this.renderDataFilter(thumbnails)
      : this.renderClear();
  }
}

const mapStateToProps = state => ({
  globalBlocks: globalBlocksSelector(state)
});
const mapDispatchToProps = {
  updateGlobalBlock
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Global);
