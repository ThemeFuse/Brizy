import React from "react";
import ScrollPane from "visual/component/ScrollPane";
import DataFilter from "./common/DataFilter";
import Select from "./common/Select";
import SearchInput from "./common/SearchInput";
import ThumbnailGrid from "./common/ThumbnailGrid";
import Editor from "visual/global/Editor";
import { templateThumbnailUrl } from "visual/utils/templates";
import { t } from "visual/utils/i18n";

export default class Templates extends React.Component {
  static shouldRender() {
    const templatesConfig = Editor.getTemplates();

    return templatesConfig.templates && templatesConfig.templates.length > 0;
  }

  // COMMENTED OUT UNTIL IT WILL BE MORE CLEAR
  // ON HOW SHOULD TEMPLATES REALLY WORk

  // handleThumbnailAdd = thumbnailData => {
  //   const { onAddBlocks, onClose } = this.props;
  //   const {
  //     id: templateId,
  //     requireStyle: templateRequireStyle,
  //     resolve: { blocks: templateBlocks, globals: templateGlobals }
  //   } = thumbnailData;
  //   const globals = getStore().getState().globals;

  //   // extra fonts
  //   const templateExtraFonts = templateGlobals.project.extraFonts;
  //   if (templateExtraFonts) {
  //     const globalsExtraFonts = globals.project.extraFonts || [];
  //     const newExtraFonts = _.union(globalsExtraFonts, templateExtraFonts);
  //     const meta = {
  //       addedFonts: _.difference(templateExtraFonts, globalsExtraFonts)
  //     };
  //     getStore().dispatch(updateGlobals("extraFonts", newExtraFonts, meta));
  //   }

  //   // styles
  //   const templateDefaultStyles =
  //     templateGlobals.project.styles && templateGlobals.project.styles.default;
  //   if (templateDefaultStyles) {
  //     const globalsStyles = globals.project.styles || {};
  //     const newStyles = {
  //       ...globalsStyles,
  //       [templateId]: templateDefaultStyles
  //       // _selected: templateId
  //     };
  //     getStore().dispatch(updateGlobals("styles", newStyles));
  //   }

  //   onAddBlocks(templateBlocks);
  //   onClose();
  // };

  handleThumbnailAdd = thumbnailData => {
    const { onAddBlocks, onClose } = this.props;
    const {
      resolve: { blocks: templateBlocks }
    } = thumbnailData;

    onAddBlocks(templateBlocks);
    onClose();
  };

  render() {
    const templatesConfig = Editor.getTemplates();
    const thumbnails = templatesConfig.templates.map(template => ({
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
    ].concat(templatesConfig.categories);

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
