import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";

const LOADING_TIME = 1000;
const LOADING_TEXT = 2500;

class ButtonTooltip extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    icon: "nc-circle-add",
    title: "Add",
    tooltipContent: "",
    value: false
  };

  state = {
    loading: false,
    active: false
  };

  handleMouseDown = event => {
    event.preventDefault();

    this.props.onChange(!this.props.value);
  };

  handleClick = () => {
    const { loading } = this.state;

    if (!loading) {
      this.setState({ loading: true }, () => {
        return setTimeout(() => {
          this.setState({ loading: false, active: true });
        }, LOADING_TIME);
      });

      setTimeout(() => {
        this.setState({ active: false });
      }, LOADING_TEXT);
    }
  };

  renderTooltip() {
    const { tooltipContent } = this.props;
    const { loading, active } = this.state;

    const className = classnames(
      "brz-ed-toolbar__item__tooltip",
      { "brz-ed-animated brz-ed-animated--fadeIn active": active },
    );

    return !loading && (
      <div className={className}>
        {tooltipContent}
      </div>
    );
  };

  render() {
    const {
      className: _className,
      attr,
      value,
      icon,
      title,
      tooltipContent
    } = this.props;

    const { loading } = this.state;

    const className = classnames(
      "brz-ed-option__button",
      { "brz-ed-toolbar--active": value },
      _className,
      attr.className
    );

    return (
      <div
        {...attr}
        className={className}
        title={title}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
      >
        {tooltipContent && this.renderTooltip()}
        {loading ? (
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        ) : (
          <EditorIcon icon={icon} className="brz-ed-animated brz-ed-animated--fadeIn" />
        )}
      </div>
    );
  }
}

export default ButtonTooltip;
