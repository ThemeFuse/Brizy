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
    const { className: _className, type, name } = this.props;
    const className = classnames("brz-icon-svg", _className);

    return <svg className={className} data-type={type} data-name={name} />;
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}
