import React from "react";
import { t } from "visual/utils/i18n";

export default class BlockErrorBoundary extends React.Component {
  state = {
    error: null
  };

  componentDidCatch(error, info) {
    this.setState({ error: true });
  }

  handleRemoveClick = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onRemove();
  };

  renderError() {
    const style = {
      height: "200px",
      background: "lightgray",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    };
    const textWrapperStyle = {
      textAlign: "center",
      lineHeight: "2em"
    };
    const linkStyle = {
      margin: "0 0.3em"
    };

    return (
      <div style={style}>
        <div style={textWrapperStyle}>
          <span className="brz-span">
            {t("An error happened while trying to display this block")}
          </span>
          <br className="brz-br" />
          <span className="brz-span">
            {t("You can")}
            <a
              className="brz-a"
              href="https://github.com/ThemeFuse/Brizy/issues"
              target="_blank"
              style={linkStyle}
            >
              {t("open an issue")}
            </a>
            {t("or")}
            <a
              className="brz-a"
              href="#"
              style={linkStyle}
              onClick={this.handleRemoveClick}
            >
              {t("remove this block")}
            </a>
          </span>
        </div>
      </div>
    );
  }

  renderForEdit() {
    return this.state.error ? this.renderError() : this.props.children;
  }

  renderForView() {
    return null;
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}
