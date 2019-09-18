import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Options, { filterOptionsData } from "visual/component/Options";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";

class PopoverOptionType extends React.Component {
  static shouldOptionBeFiltered({ options }) {
    return filterOptionsData(options).length === 0;
  }

  static defaultProps = {
    className: "",
    icon: "nc-cog",
    size: "medium",
    title: "Settings",
    label: "",
    helperContent: "",
    helper: false,
    display: "outside", // inside | outside
    onOpenDirect: false,
    location: "",
    toolbar: null,
    options: []
  };

  componentDidMount() {
    const { display, onOpenDirect } = this.props;

    if (display === "inside" && onOpenDirect) {
      this.props.toolbar.setItemsRenderer(this.renderToolbarItems);
    }
  }

  handleTooltipOpen = () => {
    this.props.onChange(undefined, { isOpen: true });
  };

  handleTooltipClose = () => {
    this.props.onChange(undefined, { isOpen: false });
  };

  switchToEdit = e => {
    e.stopPropagation();
    this.props.toolbar.setItemsRenderer(this.renderToolbarItems);
  };

  getOutSideExceptions = () => {
    let clickOutsideExceptions = [".brz-ed-fixed"];
    if (this.props.location === "toolbar") {
      clickOutsideExceptions.push(".brz-ed-sidebar-right-portal");
    }

    return clickOutsideExceptions;
  };

  renderLabel = () => {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div
          className="brz-ed-option__helper__content"
          dangerouslySetInnerHTML={{ __html: helperContent }}
        />
      </div>
    ) : null;

    return (
      <div
        key="label"
        className="brz-ed-option__label brz-ed-option__popover__label"
      >
        {label}
        {helper}
      </div>
    );
  };

  renderToolbarItems = toolbarItems => {
    const toolbarItem = toolbarItems.find(({ id }) => id === this.props.id);

    const className = classnames("brz-ed-popover__inner", {
      [`brz-ed-tooltip--${toolbarItem.size}`]: toolbarItem.size
    });

    return <div className={className}>{this.renderContent(toolbarItem)}</div>;
  };

  renderContent = props => {
    const { toolbar, location } = this.props;
    const { options, key } = props || this.props;

    return (
      <div key={key} className="brz-d-xs-flex brz-flex-xs-wrap">
        <Options
          className="brz-ed-popover__options"
          optionClassName="brz-ed-popover__option"
          data={options}
          location={location}
          toolbar={toolbar}
        />
      </div>
    );
  };

  renderInside() {
    const { className: _className, icon, title } = this.props;
    const className = classnames("brz-ed-popover__inner--icon", _className);
    const iconAttr = _.omit(icon, "className");
    const iconClassName = classnames(
      "brz-ed-popover__tooltip--icon-custom",
      icon.className
    );

    return (
      <div className={className} title={title} onMouseDown={this.switchToEdit}>
        {_.isObject(icon) ? (
          <div className={iconClassName} {...iconAttr} />
        ) : (
          <EditorIcon icon={icon} />
        )}
      </div>
    );
  }

  renderOutside() {
    const {
      className: _className,
      icon: _icon,
      title,
      size,
      location,
      toolbar: _toolbar,
      label,
      helper
    } = this.props;
    const className = classnames("brz-ed-popover", _className);
    let toolbar = _toolbar;
    let placement = "top-center";
    let icon;

    if (_.isObject(_icon)) {
      const iconClassName = classnames(
        "brz-ed-popover__tooltip--icon-custom",
        _icon.className
      );
      icon = <div {..._icon} className={iconClassName} />;
    } else {
      icon = <EditorIcon icon={_icon} />;
    }
    const hasLabel = label || helper;

    if (location === "rightSidebar") {
      toolbar = null;
      placement = "bottom-center";
    }

    return (
      <div className={className}>
        {hasLabel && this.renderLabel()}
        <Tooltip
          className="brz-ed-popover__tooltip"
          placement={placement}
          overlay={this.renderContent()}
          title={title}
          size={size}
          toolbar={toolbar}
          clickOutsideExceptions={this.getOutSideExceptions()}
          onOpen={this.handleTooltipOpen}
          onClose={this.handleTooltipClose}
        >
          {icon}
        </Tooltip>
      </div>
    );
  }

  render() {
    const { options, display } = this.props;

    if (filterOptionsData(options).length === 0) {
      return null;
    }

    return display === "outside" ? this.renderOutside() : this.renderInside();
  }
}

export default PopoverOptionType;
