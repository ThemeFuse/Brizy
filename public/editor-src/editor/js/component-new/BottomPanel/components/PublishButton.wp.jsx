import React from "react";
import { connect } from "react-redux";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";
import * as Api from "visual/utils/api/editor/index.wp";
import { updatePage } from "visual/redux/actionCreators";
import { t } from "visual/utils/i18n";

class PublishButton extends React.Component {
  state = {
    loading: false
  };

  handleClick = () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true }, () => {
      const { page, updatePage } = this.props;
      const updateData = {
        status: "publish",
        data: page.data
      };
      const updateMeta = {
        syncImmediate: true,
        syncSuccess: () => {
          Api.updatePost().then(() => {
            this.setState({ loading: false });
          });
        }
      };

      this.props.updatePage(updateData, updateMeta);
    });
  };

  render() {
    const { page } = this.props;
    const { loading } = this.state;
    const label = page.status === "publish" ? t("Update") : t("Publish");

    return (
      <li className="brz-li brz-ed-fixed-bottom-panel__item brz-ed-fixed-bottom-panel__btn">
        <span className="brz-span" onClick={this.handleClick}>
          {loading ? (
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          ) : (
            label
          )}
        </span>
      </li>
    );
  }
}

const mapStateToProps = state => ({
  page: state.page
});
const mapDispatchToProps = dispatch => ({
  updatePage: (...args) => dispatch(updatePage(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(PublishButton);
