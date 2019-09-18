import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import { publish } from "visual/redux/actions";
import { t } from "visual/utils/i18n";

class PublishButton extends Component {
  state = {
    loading: false
  };

  publish = e => {
    e.preventDefault();

    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true }, () => {
      this.props
        .dispatch(publish())
        .then(() => {
          this.setState({ loading: false });
        })
        .catch(e => {
          if (process.env.NODE_ENV === "development") {
            console.error("could not publish or save page");
          }
          this.setState({ loading: false });
        });
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

const mapStateToProps = state => ({ page: state.page });

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishButton);
