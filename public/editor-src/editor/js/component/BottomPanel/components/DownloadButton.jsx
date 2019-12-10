import React from "react";
import Config from "visual/global/Config";
import HotKeys from "visual/component/HotKeys";
import EditorIcon from "visual/component/EditorIcon";
import { uuid } from "visual/utils/uuid";
import { t } from "visual/utils/i18n";

const generateToken = () => uuid(5);

export default class Button extends React.Component {
  state = {
    loading: false,
    downloadToken: generateToken()
  };

  handleSaveHtml = e => {
    e.preventDefault();
    const { loading, downloadToken } = this.state;

    if (!loading) {
      this.setState({ loading: true }, () => {
        const exportUrl = Config.get("urls").export;

        window.location.href = `${exportUrl}?file_download_token=${downloadToken}`;
        this.startCookiePolling();
      });
    }
  };

  startCookiePolling = () => {
    this.cookieCheckerInterval = setInterval(() => {
      let tokenCookie;
      const parts = document.cookie.split("file_download_token=");

      if (parts.length === 2) {
        tokenCookie = parts[1].split(";")[0];
      }

      if (tokenCookie === this.state.downloadToken) {
        this.stopCookiePolling();
      } else {
        this.cookieCheckerIterations++;

        if (this.cookieCheckerIterations > 10) {
          this.stopCookiePolling();
        }
      }
    }, 1000);
    this.cookieCheckerIterations = 0;
  };

  stopCookiePolling = () => {
    clearInterval(this.cookieCheckerInterval);
    this.setState({
      loading: false,
      downloadToken: generateToken()
    });
    this.cookieCheckerInterval = 0;
  };

  render() {
    const keysNames = ["ctrl+S", "cmd+S", "right_cmd+S"];

    return (
      <li className="brz-li brz-ed-fixed-bottom-panel__item brz-ed-fixed-bottom-panel__btn brz-ed-fixed-bottom-panel__btn--download">
        <HotKeys
          keyNames={keysNames}
          id="key-helper-save-html"
          onKeyDown={this.handleSaveHtml}
        />
        <span className="brz-span" onClick={this.handleSaveHtml}>
          {this.state.loading ? (
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          ) : (
            t("Save HTML")
          )}
        </span>
      </li>
    );
  }
}
