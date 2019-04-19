import React, { Fragment } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import {
  globalsSelector,
  globalBlocksInPageSelector
} from "visual/redux/selectors";
import {
  updatePage,
  updateGlobals,
  updateGlobalBlock
} from "visual/redux/actions";
import { t } from "visual/utils/i18n";

class PublishButton extends React.Component {
  state = {
    loading: false
  };

  publishGlobals() {
    const { globals, updateGlobals } = this.props;
    const globalsEntries = Object.entries(globals);

    if (globalsEntries.length === 0) {
      return;
    }

    // force a network request, but don't change anything
    return new Promise((resolve, reject) => {
      return updateGlobals({
        key: null,
        value: null,
        meta: {
          is_autosave: 0,
          syncImmediate: true,
          syncSuccess: resolve,
          syncFail: reject
        }
      });
    });
  }

  publishGlobalBlocks() {
    const { globalBlocksInPage, updateGlobalBlock } = this.props;
    const updatePromises = Object.entries(globalBlocksInPage).map(
      ([id, data]) => {
        return new Promise((resolve, reject) => {
          updateGlobalBlock({
            id,
            data,
            meta: {
              is_autosave: 0,
              syncImmediate: true,
              syncSuccess: resolve,
              syncFail: reject
            }
          });
        });
      }
    );

    return Promise.all(updatePromises);
  }

  publishPage() {
    const { page, updatePage } = this.props;

    return new Promise((resolve, reject) => {
      return updatePage({
        data: page.data,
        status: "publish",
        meta: {
          is_autosave: 0,
          syncImmediate: true,
          syncSuccess: resolve,
          syncFail: reject
        }
      });
    });
  }

  publish = e => {
    e.preventDefault();

    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true }, async () => {
      try {
        await this.publishGlobals();
        await this.publishGlobalBlocks();
        await this.publishPage(); // page must be published last, because it triggers compilation (in WP)
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.error("could not publish or save page");
        }
      }

      this.setState({ loading: false });
    });
  };

  render() {
    const { page } = this.props;
    const { loading } = this.state;
    const label = page.status === "publish" ? t("Update") : t("Publish");

    return (
      <Fragment>
        <li className="brz-li brz-ed-fixed-bottom-panel__item brz-ed-fixed-bottom-panel__btn">
          <span className="brz-span" onClick={this.publish}>
            {loading ? (
              <EditorIcon
                icon="nc-circle-02"
                className="brz-ed-animated--spin"
              />
            ) : (
              label
            )}
          </span>
        </li>
        <HotKeys
          id="key-helper-update-page"
          keyNames={["ctrl+S", "cmd+S", "right_cmd+S"]}
          onKeyDown={this.publish}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  page: state.page,
  globals: globalsSelector(state),
  globalBlocksInPage: globalBlocksInPageSelector(state)
});
const mapDispatchToProps = {
  updatePage,
  updateGlobals,
  updateGlobalBlock
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishButton);
