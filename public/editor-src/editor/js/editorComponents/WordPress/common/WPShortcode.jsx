import classnames from "classnames";
import { isEqual, noop } from "es-toolkit";
import React, { Component } from "react";
import BoxResizer from "visual/component/BoxResizer";
import Placeholder from "visual/component/Placeholder";
import { isEditor } from "visual/providers/RenderProvider";
import { shortcodeContent } from "visual/utils/api";
import { uuid } from "visual/utils/uuid";

export class WPShortcode extends Component {
  static defaultProps = {
    name: "",
    attributes: {},
    height: null,
    raw: null,
    placeholderIcon: "wp-shortcode",
    resizerPoints: null,
    resizerMeta: null,
    resizerValue: null,
    resizerOnChange: null,
    renderHTMLInEditor: true,
    className: "",
    style: {},
    blocked: true,
    render: null,
    containerRef: null
  };

  id = uuid(3);

  render() {
    const {
      className: _className,
      style,
      resizerPoints,
      resizerMeta,
      resizerValue,
      resizerOnChange,
      config,
      containerRef,
      ...innerProps
    } = this.props;

    const className = classnames("brz-wp-shortcode", _className);
    let content = <WPShortcodeInner config={config} {...innerProps} />;

    if (resizerValue !== null) {
      content = (
        <BoxResizer
          points={resizerPoints}
          meta={resizerMeta}
          value={resizerValue}
          onChange={resizerOnChange}
        >
          {content}
        </BoxResizer>
      );
    }

    return (
      <div className={className} style={style} ref={containerRef}>
        {content}
      </div>
    );
  }
}

export class WPShortcodeInner extends Component {
  static defaultProps = {
    name: "",
    attributes: {},
    raw: null,
    placeholderIcon: "wp-shortcode",
    renderHTMLInEditor: true,
    render: null,
    onLoadHTML: noop
  };

  state = {
    shortcodeHTML: null
  };

  componentDidMount() {
    const { renderHTMLInEditor } = this.props;

    if (renderHTMLInEditor) {
      this.updateShortCodeHTML();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const currentProps = this.props;
    const currentState = this.state;

    const propsChanged =
      !isEqual(currentProps.attributes, nextProps.attributes) ||
      currentProps.name !== nextProps.name ||
      currentProps.raw !== nextProps.raw;
    if (propsChanged) {
      return true;
    }

    return currentState.shortcodeHTML !== nextState.shortcodeHTML;
  }

  componentDidUpdate(prevProps) {
    const currentProps = this.props;

    const propsChanged =
      !isEqual(currentProps.attributes, prevProps.attributes) ||
      currentProps.name !== prevProps.name ||
      currentProps.raw !== prevProps.raw;
    if (propsChanged) {
      this.updateShortCodeHTML();
    }
  }

  updateShortCodeHTML() {
    const shortcodeString = this.getShortcodeString();
    if (shortcodeString === "") {
      return;
    }

    shortcodeContent(shortcodeString, this.props.config).then(
      ({ shortcode }) => {
        this.props.onLoadHTML(shortcode);
        this.setState({ shortcodeHTML: shortcode });
      }
    );
  }

  getShortcodeString() {
    const { raw, name, attributes } = this.props;

    if (raw !== null) {
      return raw;
    }

    const attributesStr =
      attributes &&
      Object.keys(attributes)
        .map((k) => String(attributes[k]) && `${k}="${attributes[k]}"`)
        .join(" ");

    return `[${name} ${attributesStr || ""}]`;
  }

  renderMarkup(html) {
    return { __html: html };
  }

  renderForEdit() {
    const { placeholderIcon, blocked, render, height } = this.props;
    const { shortcodeHTML } = this.state;

    if (!shortcodeHTML) {
      const style = height
        ? {
            minHeight: `${height}px`,
            height: `${height}px`
          }
        : {};

      return <Placeholder style={style} icon={placeholderIcon} />;
    }

    if (typeof render === "function") {
      return render(shortcodeHTML);
    } else {
      return (
        <div
          className={blocked ? "brz-blocked" : ""}
          dangerouslySetInnerHTML={this.renderMarkup(shortcodeHTML)}
        />
      );
    }
  }

  renderForView() {
    const { render } = this.props;
    const html = this.getShortcodeString();

    if (typeof render === "function") {
      return render(html);
    } else {
      return <div dangerouslySetInnerHTML={this.renderMarkup(html)} />;
    }
  }

  render() {
    return isEditor(this.props.renderContext)
      ? this.renderForEdit()
      : this.renderForView();
  }
}
