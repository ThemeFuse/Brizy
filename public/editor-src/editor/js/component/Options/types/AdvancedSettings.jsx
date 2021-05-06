import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { getStore } from "visual/redux/store";
import { updateUI } from "visual/redux/actions2";
import { deviceModeSelector, uiSelector } from "visual/redux/selectors";
import { DESKTOP } from "visual/utils/responsiveMode";

export default class AdvancedSettingsOptionType extends React.Component {
  static shouldOptionBeFiltered() {
    return deviceModeSelector(getStore().getState()) !== DESKTOP;
  }

  static defaultProps = {
    className: "",
    icon: "nc-cog",
    title: "",
    label: "",
    sidebarLabel: "",
    helper: false,
    helperContent: "",
    attr: {}
  };

  state = {
    isSidebarOpen: false
  };

  componentWillUnmount() {
    const store = getStore();
    const { rightSidebar } = uiSelector(store.getState());

    if (this.state.isSidebarOpen && rightSidebar.lock === undefined) {
      store.dispatch(
        updateUI("rightSidebar", {
          ...rightSidebar,
          isOpen: false
        })
      );
    }
  }

  handleLabelClick = () => {
    const store = getStore();
    const { rightSidebar } = uiSelector(store.getState());

    if (!rightSidebar.isOpen) {
      this.setState({ isSidebarOpen: true }, () => {
        store.dispatch(
          updateUI("rightSidebar", {
            ...rightSidebar,
            isOpen: true
          })
        );
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

  render() {
    const {
      className: _className,
      icon,
      label,
      helper,
      attr: _attr,
      title
    } = this.props;
    const className = classnames(
      "brz-ed-option__advanced",
      "brz-ed-option__inline",
      _className,
      _attr.className
    );

    return (
      <div className={className} title={title} onClick={this.handleLabelClick}>
        {icon && this.renderIcon()}
        {(label || helper) && this.renderLabel()}
      </div>
    );
  }
}
