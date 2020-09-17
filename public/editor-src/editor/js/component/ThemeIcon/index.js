import React from "react";
import classnames from "classnames";
import { templateIconUrl } from "visual/utils/icons";
import { responseToSvg } from "./utils";

export default class ThemeIcon extends React.Component {
  static defaultProps = {
    className: "",
    name: "",
    type: ""
  };

  state = {
    icon: null
  };

  isUnmounted = false;

  componentDidMount() {
    const { name, type } = this.props;

    this.getSvg(type, name);
  }

  componentWillReceiveProps({ name, type }) {
    const { name: oldName, type: oldType } = this.props;

    if (oldName !== name || oldType !== type) {
      this.getSvg(type, name);
    }
  }

  shouldComponentUpdate({ name, type, className }, { icon }) {
    const {
      name: oldName,
      type: oldType,
      className: oldClassName
    } = this.props;
    const { icon: oldIcon } = this.state;

    return (
      oldIcon !== icon ||
      oldName !== name ||
      oldType !== type ||
      oldClassName !== className
    );
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  fetchIcon(type, name) {
    const url = templateIconUrl(type, name);
    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    });

    return fetch(url, {
      headers,
      method: "GET"
    }).then(res => res.text());
  }

  async getSvg(type, name) {
    const res = await this.fetchIcon(type, name);

    if (!this.isUnmounted) {
      this.setState({
        icon: responseToSvg(res)
      });
    }
  }

  getSvgContent(svg) {
    if (svg) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "text/html");
      const _svg = doc.body.firstChild || { innerHTML: null, attributes: {} };
      const attrs = _svg.attributes;
      const innerHtml = _svg.innerHTML;
      let attr = {};

      const attrsToTransform = {
        "xmlns:xlink": "xmlnsXlink",
        "xml:space": "xmlSpace"
      };

      for (let i = 0; i < attrs.length; i++) {
        let { name, value } = attrs[i];

        // transforms some attr to jsx attr
        if (attrsToTransform[name]) {
          name = attrsToTransform[name];
        }

        attr[name] = value;
      }

      return {
        attr,
        innerHtml
      };
    }

    return {
      innerHtml: null,
      attr: {}
    };
  }

  renderForEdit() {
    const { className: _className } = this.props;
    const className = classnames("brz-icon-svg", _className);
    const { innerHtml, attr } = this.getSvgContent(this.state.icon);

    return (
      innerHtml && (
        <svg
          {...attr}
          className={className}
          dangerouslySetInnerHTML={{ __html: innerHtml }}
        />
      )
    );
  }

  renderForView() {
    const { className: _className, type, name } = this.props;
    const className = classnames("brz-icon-svg", _className);

    return <svg className={className} data-type={type} data-name={name} />;
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}
