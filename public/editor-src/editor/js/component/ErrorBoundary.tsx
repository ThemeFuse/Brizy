import React, { Component, CSSProperties, ErrorInfo, ReactNode } from "react";
import { noop } from "underscore";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";

type ErrorBoundaryProps = {
  onRemove: () => void;
};

type ErrorBoundaryState = {
  error: null | Error;
  errorInfo: null | ErrorInfo;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static defaultProps: ErrorBoundaryProps = {
    onRemove: noop
  };

  state: ErrorBoundaryState = {
    error: null,
    errorInfo: null
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
  }

  handleRemoveClick = (): void => {
    this.props.onRemove();
  };

  renderForEdit(): ReactNode {
    const urls = Config.get("urls");
    const { errorInfo, error } = this.state;
    const style: CSSProperties = {
      minHeight: "200px",
      backgroundColor: "lightgray",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    };
    const textWrapperStyle: CSSProperties = {
      textAlign: "center",
      lineHeight: "2em"
    };
    const linkStyle: CSSProperties = {
      margin: "0 0.3em"
    };

    if (errorInfo) {
      return (
        <div style={style}>
          <div style={textWrapperStyle}>
            <span className="brz-span">
              {t("An error happened while trying to display this element")}
            </span>
            <br className="brz-br" />
            <span className="brz-span">
              {t("You can")}
              <a
                className="brz-a"
                href={urls.support}
                target="_blank"
                rel="noopener noreferrer"
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
                {t("remove this element")}
              </a>
            </span>
            {process.env.NODE_ENV === "development" && (
              <details
                className="brz-details"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {error && error.toString()}
                <br />
                {errorInfo.componentStack}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }

  renderForView(): ReactNode {
    try {
      return this.props.children;
    } catch (e) {
      return process.env.NODE_ENV === "development" ? (
        <details className="brz-details" style={{ whiteSpace: "pre-wrap" }}>
          {e}
        </details>
      ) : null;
    }
  }

  render(): ReactNode {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}

export default ErrorBoundary;
