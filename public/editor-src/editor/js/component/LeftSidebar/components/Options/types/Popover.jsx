import classnames from "classnames";
import React from "react";
import { Manager, Popper, Reference } from "react-popper";
import { connect } from "react-redux";
import ResizeAware from "react-resize-aware";
import ClickOutside from "visual/component/ClickOutside";
import EditorIcon from "visual/component/EditorIcon";
import Options from "visual/component/LeftSidebar/components/Options";
import { updateUI } from "visual/redux/actions2";
import { leftSidebarSelector } from "visual/redux/selectors";

const mapState = (state) => ({
  leftSidebar: leftSidebarSelector(state)
});

const connector = connect(mapState);

class DrawerPopover extends React.Component {
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
    const { leftSidebar, dispatch } = this.props;

    if (!this.state.isOpen) {
      if (leftSidebar.drawerContentType !== null) {
        dispatch(updateUI("leftSidebar", { drawerContentType: null }));
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
      "brz-ed-animated brz-ed-animated--fadeInLeft",
      "brz-ed-sidebar__popover-content",
      {
        "brz-hidden": isHidden
      }
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
        {({ ref }) => (
          <div
            className={className}
            title={title}
            onClick={this.handleClick}
            ref={ref}
          >
            <Manager>
              <Reference>
                {({ ref }) => (
                  <div ref={ref}>
                    <EditorIcon icon={icon} />
                  </div>
                )}
              </Reference>
              {this.state.isOpen && (
                <Popper
                  placement="right"
                  modifiers={[
                    {
                      name: "offset",
                      options: { offset: [0, 10] }
                    },
                    {
                      name: "preventOverflow",
                      options: {
                        padding: 8
                      }
                    }
                  ]}
                >
                  {({ ref, style, arrowProps, placement, update }) => (
                    <div ref={ref} style={style} data-placement={placement}>
                      <div className={popoverClassName}>
                        <div ref={arrowProps.ref} style={arrowProps.style}>
                          <div
                            className={`brz-ed-arrow brz-ed-arrow--${placement} brz-sidebar-arrow`}
                          />
                        </div>
                        {this.renderOptions()}
                        <ResizeAware onResize={update} />
                      </div>
                    </div>
                  )}
                </Popper>
              )}
            </Manager>
          </div>
        )}
      </ClickOutside>
    );
  }
}

export default connector(DrawerPopover);
