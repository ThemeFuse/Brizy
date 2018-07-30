import React from "react";
import classnames from "classnames";
import ClickOutside from "visual/component-new/ClickOutside";
import EditorIcon from "visual/component-new/EditorIcon";
import Option from "visual/component-new/LeftSidebar/components/Options/Option";
import { getStore } from "visual/redux/store";
import { updateUI } from "visual/redux/actionCreators";

export default class DrawerPopover extends React.Component {
  static defaultProps = {
    icon: "",
    options: [],
    clickOutsideExceptions: [],
    title: ""
  };

  state = {
    isOpen: false
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
      this.setState({ isOpen: true });
    }
  };

  handleClickOutside = () => {
    const { isOpen } = this.state;

    if (isOpen) {
      this.setState({ isOpen: false });
    }
  };

  renderOptions = () => {
    const { options } = this.props;
    return options.map((el, index) => {
      return (
        <Option
          key={index}
          data={el}
          className="brz-ed-sidebar__popover__item"
        />
      );
    });
  };

  render() {
    const { icon, clickOutsideExceptions, className: _className, title } = this.props;
    const className = classnames(
      "brz-ed-sidebar-bottom__option brz-ed-sidebar__popover",
      _className,
      { "brz-ed-sidebar__popover__item--active": this.state.isOpen }
    );

    return (
      <ClickOutside
        onClickOutside={this.handleClickOutside}
        exceptions={clickOutsideExceptions}
      >
        <div className={className} title={title} onClick={this.handleClick}>
          <EditorIcon icon={icon} />
          {this.state.isOpen && (
            <div className="brz-ed-animated brz-ed-animated--fadeInLeft brz-ed-sidebar__popover-content">
              {this.renderOptions()}
            </div>
          )}
        </div>
      </ClickOutside>
    );
  }
}
