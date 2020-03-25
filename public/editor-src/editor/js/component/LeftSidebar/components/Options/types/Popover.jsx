import React from "react";
import classnames from "classnames";
import ClickOutside from "visual/component/ClickOutside";
import EditorIcon from "visual/component/EditorIcon";
import Options from "visual/component/LeftSidebar/components/Options";
import { getStore } from "visual/redux/store";
import { updateUI } from "visual/redux/actions2";

export default class DrawerPopover extends React.Component {
  static defaultProps = {
    icon: "",
    options: [],
    clickOutsideExceptions: [],
    title: ""
  };

  state = {
    isOpen: false,
    isHidden: false
  };

  handleClick = () => {
    if (!this.state.isOpen) {
      const store = getStore();

      if (store.getState().ui.leftSidebar.isOpen) {
        store.dispatch(
          updateUI("leftSidebar", {
            isOpen: false
          })
        );
      }

      this.open();
    }
  };

  handleClickOutside = () => {
    this.close();
  };

  open = () => {
    const { isOpen } = this.state;

    if (!isOpen) {
      this.setState({ isOpen: true });
    }
  };

  close = () => {
    const { isOpen } = this.state;

    if (isOpen) {
      this.setState({ isOpen: false });
    }
  };

  show = () => {
    const { isHidden } = this.state;

    if (isHidden) {
      this.setState({ isHidden: false });
    }
  };

  hide = () => {
    const { isHidden } = this.state;

    if (!isHidden) {
      this.setState({ isHidden: true });
    }
  };

  renderOptions() {
    const { options } = this.props;
    const meta = {
      popover: {
        open: this.open,
        close: this.close,
        show: this.show,
        hide: this.hide
      }
    };

    return (
      <Options
        optionClassName="brz-ed-sidebar__popover__item"
        data={options}
        meta={meta}
      />
    );
  }

  render() {
    const {
      icon,
      clickOutsideExceptions: _clickOutsideExceptions,
      className: _className,
      title
    } = this.props;
    const { isOpen, isHidden } = this.state;
    const className = classnames(
      "brz-ed-sidebar-bottom__option brz-ed-sidebar__popover",
      _className,
      { "brz-ed-sidebar__popover__item--active": isOpen }
    );
    const popoverClassName = classnames(
      "brz-ed-animated brz-ed-animated--fadeInLeft brz-ed-sidebar__popover-content",
      { "brz-hidden": isHidden }
    );
    const clickOutsideExceptions = [
      ..._clickOutsideExceptions,
      ".supports-drag-drop" // featured media popup
    ];

    return (
      <ClickOutside
        onClickOutside={this.handleClickOutside}
        exceptions={clickOutsideExceptions}
      >
        <div className={className} title={title} onClick={this.handleClick}>
          <EditorIcon icon={icon} />
          {this.state.isOpen && (
            <div className={popoverClassName}>{this.renderOptions()}</div>
          )}
        </div>
      </ClickOutside>
    );
  }
}
