import React from "react";
import classnames from "classnames";
import ClickOutside from "visual/component/ClickOutside";
import ContainerBorderButton from "./ContainerBorderButton";

class ContainerBorder extends React.Component {
  static defaultProps = {
    className: "",
    color: "", // grey, blue, red
    showBorder: true,
    borderStyle: "", // none, dotted, solid, dotted
    activeBorderStyle: "", // none, dotted, solid, dotted
    showButton: false,
    buttonPosition: "topRight", // topRight, topLeft
    renderButtonWrapper: null,
    activateOnContentClick: true,
    clickOutsideExceptions: [
      "#brz-toolbar-portal",
      ".brz-ed-sidebar__right",
      ".brz-ed-tooltip__content-portal"
    ]
  };

  containerRef = React.createRef();

  innerBorderRef = React.createRef();

  buttonRef = React.createRef();

  buttonInnerRef = React.createRef();

  isBorderActive = false;

  isButtonActive = false;

  isHovered = false;

  componentDidMount() {
    // we attach a native click handler instead
    // of doing it via jsx because we don't want
    // to catch clicks from components that aren't
    // physically (in the actual DOM) inside of ContainerBorder
    // React on the other hand bubbles clicks from all the subtree
    // regardless of the physical position in the DOM thus
    // we will be reacting to clicks from toolbars and other portals
    this.containerRef.current.addEventListener(
      "click",
      this.handleContentClick
    );
    this.containerRef.current.addEventListener(
      "brz.toolbar.mouseenter",
      this.handleToolbarMouseEnter
    );
    this.containerRef.current.addEventListener(
      "brz.toolbar.mouseleave",
      this.handleToolbarMouseLeave
    );
  }

  handleContentClick = e => {
    if (
      this.isButtonActive &&
      !this.buttonInnerRef.current.contains(e.target)
    ) {
      // this deactivate the button (if it's active)
      // when clicking inside the content after activating it
      this.setActive(false, false);
    }

    const { activateOnContentClick } = this.props;
    if (!activateOnContentClick || this.isButtonActive) {
      return;
    }

    if (!this.isBorderActive || this.isButtonActive) {
      this.setActive(true, false);
    }
  };

  handleButtonClick = () => {
    if (!this.isButtonActive) {
      this.setActive(true, true);
    }
  };

  handleClickOutside = e => {
    if (this.isBorderActive || this.isButtonActive) {
      this.setActive(false, false);
    }

    if (this.isHovered) {
      this.setHover(false);
    }
  };

  handleToolbarMouseEnter = () => {
    if (!this.isBorderActive && !this.isButtonActive) {
      this.setHover(true);
    }
  };

  handleToolbarMouseLeave = () => {
    if (!this.isBorderActive && !this.isButtonActive) {
      this.setHover(false);
    }
  };

  setActive(border, button = false) {
    const { showBorder, showButton } = this.props;

    if (showButton && this.isButtonActive !== button) {
      this.isButtonActive = button;
      this.buttonRef.current.setActive(button);
    }

    if (showBorder && this.isBorderActive !== border) {
      this.isBorderActive = border;
      if (border) {
        this.containerRef.current.classList.add("brz-ed-border--active");
      } else {
        this.containerRef.current.classList.remove("brz-ed-border--active");
      }
    }
  }

  setHover(hover) {
    if (hover !== this.isHovered) {
      this.isHovered = hover;

      if (hover) {
        this.containerRef.current.classList.add("brz-ed-border--hovered");
      } else {
        this.containerRef.current.classList.remove("brz-ed-border--hovered");
      }
    }
  }

  renderButton = props => {
    const { buttonPosition } = this.props;

    return (
      <ContainerBorderButton
        {...props}
        ref={this.buttonRef}
        innerRef={this.buttonInnerRef}
        position={buttonPosition}
        onClick={this.handleButtonClick}
      />
    );
  };

  render() {
    const {
      className: className_,
      color,
      showBorder,
      borderStyle,
      activeBorderStyle,
      showButton,
      renderButtonWrapper,
      children,
      clickOutsideExceptions
    } = this.props;

    const className = classnames(
      "brz-ed-border",
      {
        [`brz-ed-border--${color}`]: color
      },
      className_
    );

    // button
    let button;
    if (showButton) {
      button = renderButtonWrapper
        ? renderButtonWrapper(this.renderButton)
        : this.renderButton();
    }

    // border
    let border;
    if (showBorder) {
      const borderClassName = classnames("brz-ed-border__inner", {
        [`brz-ed-border--${borderStyle}`]: borderStyle,
        [`brz-ed-border--active-${activeBorderStyle}`]: activeBorderStyle
      });
      border = <div ref={this.innerBorderRef} className={borderClassName} />;
    }

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.handleClickOutside}
      >
        <div ref={this.containerRef} className={className}>
          {children}
          {button}
          {border}
        </div>
      </ClickOutside>
    );
  }
}

export default ContainerBorder;
