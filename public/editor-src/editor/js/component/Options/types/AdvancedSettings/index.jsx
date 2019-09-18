import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import ClickOutside from "visual/component/ClickOutside";
import Portal from "visual/component/Portal";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import { filterOptionsData } from "visual/component/Options";
import RightSidebar from "./RightSidebar";

class AdvancedSettingsOptionType extends React.Component {
  static shouldOptionBeFiltered({ options }) {
    return filterOptionsData(options).length === 0;
  }

  static defaultProps = {
    className: "",
    icon: null,
    title: "",
    label: "",
    sidebarLabel: "",
    helper: false,
    helperContent: "",
    attr: {},
    options: []
  };

  state = {
    isSidebarOpen: false
  };

  handleLabelClick = () => {
    if (!this.state.isSidebarOpen) {
      this.setState(
        {
          isSidebarOpen: true
        },
        () => {
          const tooltip = getCurrentTooltip();

          if (tooltip) {
            tooltip.reposition();
          }
        }
      );
    }
  };

  handleSidebarCloseClick = () => {
    if (this.state.isSidebarOpen) {
      this.setState({
        isSidebarOpen: false
      });
    }
  };

  renderIcon() {
    const { icon } = this.props;

    return (
      <div className="brz-ed-option__icon">
        <EditorIcon icon={icon} />
      </div>
    );
  }

  renderLabel() {
    const { label, helper, helperContent } = this.props;

    return (
      <div className="brz-ed-option__label">
        {label}
        {helper ? (
          <div className="brz-ed-option__helper">
            <EditorIcon icon="nc-alert-circle-que" />
            <div
              className="brz-ed-option__helper__content"
              dangerouslySetInnerHTML={{ __html: helperContent }}
            />
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    const {
      className: _className,
      icon,
      label,
      helper,
      sidebarLabel,
      attr: _attr,
      options,
      title
    } = this.props;
    const { isSidebarOpen } = this.state;
    const className = classnames(
      "brz-ed-option__advanced",
      "brz-ed-option__inline",
      _className,
      _attr.className
    );

    const portalNodeClassName = "brz-ed-sidebar-right-portal";
    const clickOutsideExceptions = [
      `.${portalNodeClassName}`,
      ".brz-ed-tooltip__content-portal"
    ];

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.handleSidebarCloseClick}
      >
        <div
          className={className}
          title={title}
          onClick={this.handleLabelClick}
        >
          {icon ? this.renderIcon() : null}
          {label || helper ? this.renderLabel() : null}
          <Portal
            node={window.parent.document.body}
            className={portalNodeClassName}
          >
            <RightSidebar
              title={sidebarLabel || label}
              options={options}
              isOpen={isSidebarOpen}
            />
          </Portal>
        </div>
      </ClickOutside>
    );
  }
}

export default AdvancedSettingsOptionType;
