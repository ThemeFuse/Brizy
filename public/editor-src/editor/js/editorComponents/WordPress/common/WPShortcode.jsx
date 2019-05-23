import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import Placeholder from "visual/component/Placeholder";
import BoxResizer from "visual/component/BoxResizer";
import { uuid } from "visual/utils/uuid";
import { shortcodeContent } from "visual/utils/api/editor";

export class WPShortcode extends Component {
  static defaultProps = {
    name: "",
    attributes: {},
    raw: null,
    placeholderIcon: "wp-shortcode",
    resizerPoints: null,
    resizerMeta: null,
    resizerValue: null,
    resizerOnChange: null,
    renderHTMLInEditor: true,
    mobileToggleMenu: false,
    tabletToggleMenu: false,
    className: "",
    style: {}
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
      mobileToggleMenu,
      tabletToggleMenu,
      ...innerProps
    } = this.props;

    const className = classnames("brz-wp-shortcode", _className);
    const toggleClassName = classnames("brz-wp-shortcode__menu__toggle", {
      "brz-wp-shortcode__menu__toggle--mobile": mobileToggleMenu,
      "brz-wp-shortcode__menu__toggle--tablet": tabletToggleMenu
    });
    let content = <Inner {...innerProps} />;

    if (mobileToggleMenu || tabletToggleMenu) {
      const id = `brz-wp-shortcode__menu__btn-${this.id}`;

      content = (
        <div className={toggleClassName}>
          <input className="brz-input" id={id} type="checkbox" />
          <label className="brz-wp-shortcode__menu__icon" htmlFor={id}>
            <span className="brz-wp-shortcode__menu__icon--bars" />
          </label>
          {content}
        </div>
      );
    }

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
      <div className={className} style={style}>
        {content}
      </div>
    );
  }
}

class Inner extends Component {
  static defaultProps = {
    name: "",
    attributes: {},
    raw: null,
    placeholderIcon: "wp-shortcode",
    renderHTMLInEditor: true
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
      !_.isEqual(currentProps.attributes, nextProps.attributes) ||
      currentProps.name !== nextProps.name ||
      currentProps.raw !== nextProps.raw;
    if (propsChanged) {
      return true;
    }

    const stateChanged = currentState.shortcodeHTML !== nextState.shortcodeHTML;
    if (stateChanged) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps) {
    const currentProps = this.props;

    const propsChanged =
      !_.isEqual(currentProps.attributes, prevProps.attributes) ||
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

    return shortcodeContent(shortcodeString).then(({ shortcode }) =>
      this.setState({ shortcodeHTML: shortcode })
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
        .map(k => String(attributes[k]) && `${k}="${attributes[k]}"`)
        .join(" ");

    return `[${name} ${attributesStr || ""}]`;
  }

  renderForEdit() {
    const { className: _className, style, placeholderIcon } = this.props;
    const { shortcodeHTML } = this.state;

    return shortcodeHTML ? (
      <div
        className="brz-blocked"
        dangerouslySetInnerHTML={{ __html: shortcodeHTML }}
      />
    ) : (
      <Placeholder icon={placeholderIcon} />
    );
  }

  renderForView() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.getShortcodeString() }} />
    );
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}
