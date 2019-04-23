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
import { savedBlocksSelector } from "visual/redux/selectors";
import { deleteSavedBlock } from "visual/redux/actions";
import { t } from "visual/utils/i18n";

class Saved extends React.Component {
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
    this.props.deleteSavedBlock({ id: thumbnailData.id });
  };

  renderDataFilter(data) {
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
      <DataFilter data={data} filterFn={filterFn} defaultFilter={defaultFilter}>
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
                  {t("Nothing here yet, save a block first.")}
                </p>
                <img
                  src={`${assetUrl(
                    "editor/img/save_toolbar.gif"
                  )}?${Math.random()}`}
                  className="brz-ed-popup-two-blocks__grid-clear-image-saved"
                />
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { savedBlocks } = this.props;
    const thumbnails = Object.entries(savedBlocks).reduce(
      (acc, [savedBlockId, block]) => {
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
            id: savedBlockId,
            thumbnailSrc: placeholderBlockThumbnailUrl(),
            thumbnailWidth: 500,
            thumbnailHeight: 200,
            showRemoveIcon: true,
            keywords: "",
            cat: [],
            type: -1,
            resolve: block
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
          const { url, width, height } = blockThumbnailData(block, {
            isSavedBlock: true
          });

          thumbnailData = {
            id: savedBlockId,
            thumbnailSrc: url,
            thumbnailWidth: width,
            thumbnailHeight: height,
            showRemoveIcon: true,
            keywords,
            cat,
            type: this.id,
            resolve: block
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
  savedBlocks: savedBlocksSelector(state)
});
const mapDispatchToProps = {
  deleteSavedBlock
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Saved);
