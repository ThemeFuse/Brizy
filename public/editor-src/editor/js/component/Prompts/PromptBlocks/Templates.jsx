import React from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import DataFilter from "./common/DataFilter";
import Select from "./common/Select";
import SearchInput from "./common/SearchInput";
import ThumbnailGrid from "./common/ThumbnailGrid";
import Editor from "visual/global/Editor";
import { templateThumbnailUrl } from "visual/utils/templates";
import { t } from "visual/utils/i18n";

export default class Templates extends React.Component {
  static shouldRender(props) {
    const templatesConfig = props.templatesConfig || Editor.getTemplates();

    return templatesConfig.templates && templatesConfig.templates.length > 0;
  }

  static defaultProps = {
    templatesConfig: null,
    onAddBlocks: _.noop,
    onClose: _.noop
  };

  constructor(...args) {
    super(...args);

    this.templatesConfig = this.props.templatesConfig || Editor.getTemplates();
  }

  handleThumbnailAdd = thumbnailData => {
    const { onAddBlocks, onClose } = this.props;
    const {
      resolve: { blocks: templateBlocks }
    } = thumbnailData;

    onAddBlocks(templateBlocks);
    onClose();
  };

  render() {
    const thumbnails = this.templatesConfig.templates.map(template => ({
      ...template,
      thumbnailSrc: templateThumbnailUrl(template)
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
