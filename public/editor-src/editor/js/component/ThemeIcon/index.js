import React from "react";
import classnames from "classnames";
import { templateIconUrl } from "visual/utils/icons";
import { responseToSvg } from "./utils";

export default class ThemeIcon extends React.Component {
  static defaultProps = {
    className: "",
    name: "",
    type: "",
    suffix: "nc_icon"
  };

  state = {
    icon: null
  };

  componentDidMount() {
    const { name, type, suffix } = this.props;

    this.getSvg(type, name, suffix);
  }

  componentWillReceiveProps({ name, type, suffix }) {
    const { name: oldName, type: oldType, suffix: oldSuffix } = this.props;

    if (oldName !== name || oldType !== type || oldSuffix !== suffix) {
      this.getSvg(type, name, suffix);
    }
  }

  shouldComponentUpdate({ name, type, suffix, className }, { icon }) {
    const {
      name: oldName,
      type: oldType,
      suffix: oldSuffix,
      className: oldClassName
    } = this.props;
    const { icon: oldIcon } = this.state;

    return (
      oldIcon !== icon ||
      oldName !== name ||
      oldType !== type ||
      oldSuffix !== suffix ||
      oldClassName !== className
    );
  }

  fetchIcon(type, name, suffix) {
    const url = templateIconUrl(type, name, suffix);
    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    });

    return fetch(url, {
      headers,
      method: "GET"
    }).then(res => res.text());
  }

  async getSvg(type, name, suffix) {
    const res = await this.fetchIcon(type, name, suffix);

    this.setState({
      icon: responseToSvg(res)
    });
  }

  renderForEdit() {
    const { className: _className } = this.props;
    const className = classnames("brz-icon-svg", _className);

    return (
      this.state.icon && (
        <svg
          className={className}
          dangerouslySetInnerHTML={{ __html: this.state.icon }}
        />
      )
    );
  }

  renderForView() {
    const { className: _className, type, name, suffix } = this.props;
    const className = classnames("brz-icon-svg", _className);
    const url = templateIconUrl(type, name, suffix);

    return <svg className={className} data-href={url} />;
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}
