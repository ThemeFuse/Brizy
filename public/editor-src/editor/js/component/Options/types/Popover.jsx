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

  getClickOutSideExceptions() {
    let clickOutsideExceptions = [
      ".brz-ed-fixed",
      ...(TARGET === "WP"
        ? [
            ".media-modal", // class of the WP media modal
            ".media-modal-backdrop"
          ]
        : [])
    ];

    if (this.props.location === "toolbar") {
      clickOutsideExceptions.push(".brz-ed-sidebar__right");
    }

    return clickOutsideExceptions;
  }

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

  renderIcon() {
    const { icon } = this.props;

    if (_.isObject(icon)) {
      const iconClassName = classnames(
        "brz-ed-popover__tooltip--icon-custom",
        icon.className
      );

      return <div {...icon} className={iconClassName} />;
    } else {
      return <EditorIcon icon={icon} />;
    }
  }

  renderLabelHelper() {
    const { label, helper, helperContent } = this.props;

    if (!label && !helper) {
      return null;
    }

    return (
      <div
        key="label"
        className="brz-ed-option__label brz-ed-option__popover__label"
      >
        {label}
        {helper && (
          <div className="brz-ed-option__helper">
            <EditorIcon icon="nc-alert-circle-que" />
            <div
              className="brz-ed-option__helper__content"
              dangerouslySetInnerHTML={{ __html: helperContent }}
            />
          </div>
        )}
      </div>
    );
  }

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
      title,
      size,
      location,
      toolbar: _toolbar
    } = this.props;
    const className = classnames("brz-ed-popover", _className);
    let toolbar = _toolbar;
    let placement = "top-center";

    if (location === "rightSidebar") {
      toolbar = null;
      placement = "bottom-center";
    }

    return (
      <div className={className}>
        {this.renderLabelHelper()}
        <Tooltip
          className="brz-ed-popover__tooltip"
          placement={placement}
          overlay={this.renderContent()}
          title={title}
          size={size}
          toolbar={toolbar}
          clickOutsideExceptions={this.getClickOutSideExceptions()}
          onOpen={this.handleTooltipOpen}
          onClose={this.handleTooltipClose}
        >
          {this.renderIcon()}
        </Tooltip>
      </div>
    );
  }

  render() {
    const { display } = this.props;

    return display === "outside" ? this.renderOutside() : this.renderInside();
  }
}

export default PopoverOptionType;
