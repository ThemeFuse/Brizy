import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classnames from "classnames";

const SIDEBAR_WIDTH = 48;
const TOOLTIP_SPACE = 14;
const TOOLTIP_STATIC_SPACE = 15;
const TOOLBAR_PADDING = 12;

export default class TooltipContent extends React.Component {
  static contextTypes = {
    position: PropTypes.string
  };

  static defaultProps = {
    className: "",
    isOpen: false,
    placement: "top-center",
    placementStyle: {},
    arrow: true,
    arrowPlacement: "top-center",
    arrowPlacementStyle: {},
    size: "",
    toolbar: null,
    inPortal: false,
    node: null
  };

  constructor(props) {
    super(props);

    const { placement, arrowPlacement } = props;
    this.state = {
      placement,
      arrowPlacement
    };
    this.isRepositioning = false;
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    const { isOpen, toolbar, inPortal, node } = this.props;

    if (isOpen) {
      if (toolbar) {
        this.repositionByToolbar(toolbar);
      } else if (inPortal) {
        this.repositionPortalByNode(node);
      } else {
        this.repositionByNode(node);
      }
    }
  }

  componentDidUpdate() {
    if (this.isRepositioning) {
      return;
    }

    const { toolbar, inPortal, node } = this.props;

    if (toolbar) {
      this.repositionByToolbar(toolbar);
    } else if (inPortal) {
      this.repositionPortalByNode(node);
    } else {
      this.repositionByNode(node);
    }
  }

  repositionByToolbar(toolbar) {
    const toolbarTarget = ReactDOM.findDOMNode(toolbar);
    const {
      width: contentWidth,
      height: contentHeight
    } = this.contentRef.current.getBoundingClientRect();
    const {
      top: targetTop,
      right: targetRight,
      left: targetLeft,
      height: targetHeight,
      width: targetWidth
    } = toolbarTarget.getBoundingClientRect();

    let { placement, placementStyle, arrowPlacementStyle } = this.props;
    const { position } = this.context;
    const windowTop = position === "fixed" ? 0 : window.scrollY;
    const { toolbarItemIndex, toolbarItemsLength } = toolbar;

    const toolbarItemWidth =
      (targetWidth - TOOLBAR_PADDING) / toolbarItemsLength;

    const toolbarItemWidthCenter =
      toolbarItemWidth * toolbarItemIndex -
      toolbarItemWidth / 2 +
      TOOLBAR_PADDING / 2;

    const toolbarItemCenter =
      Math.round((toolbarItemWidthCenter - contentWidth / 2) * 10) / 10;

    const contentTop = windowTop + targetTop - TOOLTIP_SPACE - contentHeight;
    const contentLeft = targetLeft + toolbarItemCenter;
    const contentMinLeft = SIDEBAR_WIDTH;
    const contentMaxLeft = document.documentElement.clientWidth - contentWidth;

    placementStyle = { top: contentTop, left: contentLeft, position };

    if (contentTop <= windowTop) {
      placementStyle.top = windowTop + targetTop + targetHeight + TOOLTIP_SPACE;
      placement = `bottom-${placement.split("-")[1]}`;
    }
    if (contentLeft >= contentMaxLeft) {
      const arrowPosition =
        toolbarItemWidth * (toolbarItemsLength - toolbarItemIndex + 1) -
        toolbarItemWidth / 2 +
        TOOLBAR_PADDING / 2;
      placement = `${placement.split("-")[0]}-right`;
      placementStyle.left = targetRight - contentWidth;
      arrowPlacementStyle = { left: contentWidth - arrowPosition };
    }
    if (contentLeft <= contentMinLeft) {
      placement = `${placement.split("-")[0]}-left`;
      placementStyle.left = targetLeft;
      arrowPlacementStyle = { left: toolbarItemWidthCenter };
    }

    this.isRepositioning = true;
    this.setState(
      {
        placement,
        placementStyle,
        arrowPlacement: placement,
        arrowPlacementStyle
      },
      () => (this.isRepositioning = false)
    );
  }

  repositionByNode(node) {
    const { scrollY } = window.parent || window;
    const {
      width: contentWidth,
      height: contentHeight
    } = this.contentRef.current.getBoundingClientRect();
    const {
      top: targetTop,
      right: targetRight,
      left: targetLeft,
      height: targetHeight,
      width: targetWidth
    } = node.getBoundingClientRect();
    const { clientWidth, clientHeight } = document.documentElement;

    let { placement, arrowPlacementStyle } = this.props;

    let contentTop;
    let contentLeft;
    const contentMinLeft = SIDEBAR_WIDTH;
    const contentMaxLeft = clientWidth - contentWidth;
    const contentMaxHeight = clientHeight;

    // Check if is vertical settings
    if (/top-/.test(placement)) {
      contentTop =
        scrollY +
        targetHeight +
        targetTop -
        contentHeight +
        TOOLTIP_STATIC_SPACE;
    } else {
      contentTop =
        scrollY +
        targetHeight +
        targetTop +
        contentHeight +
        TOOLTIP_STATIC_SPACE;
    }

    // Check if is horizontal settings
    if (/-center/.test(placement)) {
      contentLeft = targetLeft + targetWidth / 2 - contentWidth / 2;
    } else if (/-left/.test(placement)) {
      contentLeft = targetLeft;
    } else if (/-right/.test(placement)) {
      contentLeft = targetRight - contentWidth;
    }

    if (contentTop <= scrollY) {
      placement = `bottom-${placement.split("-")[1]}`;
    }
    if (contentTop >= contentMaxHeight) {
      placement = `top-${placement.split("-")[1]}`;
    }
    if (contentLeft >= contentMaxLeft) {
      const contentLeft = targetRight - contentWidth;
      placement = `${placement.split("-")[0]}-right`;
      arrowPlacementStyle = {
        left:
          Math.floor(targetRight - contentLeft - targetWidth / 2) -
          TOOLTIP_STATIC_SPACE
      };
    }
    if (contentLeft <= contentMinLeft) {
      placement = `${placement.split("-")[0]}-left`;
      arrowPlacementStyle = { left: 0 };
    }

    this.isRepositioning = true;
    this.setState(
      {
        placement,
        arrowPlacement: placement,
        arrowPlacementStyle
      },
      () => (this.isRepositioning = false)
    );
  }

  repositionPortalByNode(node) {
    const { scrollY } = window.parent || window;
    const {
      width: contentWidth,
      height: contentHeight
    } = this.contentRef.current.getBoundingClientRect();
    const {
      top: targetTop,
      right: targetRight,
      left: targetLeft,
      height: targetHeight,
      width: targetWidth
    } = node.getBoundingClientRect();
    const { clientWidth, clientHeight } = document.documentElement;

    let { placement, arrowPlacementStyle } = this.props;

    let contentTop = 0;
    let contentLeft = 0;
    const contentMinLeft = SIDEBAR_WIDTH;
    const contentMaxLeft = clientWidth - contentWidth;
    const contentMaxHeight = clientHeight;

    // Check if is vertical settings
    if (/top-/.test(placement)) {
      contentTop =
        scrollX + targetTop - contentHeight - TOOLTIP_STATIC_SPACE / 2;
    } else {
      contentTop =
        scrollY + targetTop + targetHeight + TOOLTIP_STATIC_SPACE / 2;
    }

    // Check if is horizontal settings
    if (/-center/.test(placement)) {
      contentLeft = targetLeft + targetWidth / 2 - contentWidth / 2;
    } else if (/-left/.test(placement)) {
      contentLeft = targetLeft;
    } else if (/-right/.test(placement)) {
      contentLeft = targetRight - contentWidth;
    }

    if (contentTop <= scrollY) {
      placement = `bottom-${placement.split("-")[1]}`;
    }
    if (contentTop >= contentMaxHeight) {
      placement = `top-${placement.split("-")[1]}`;
    }
    if (contentLeft >= contentMaxLeft) {
      contentLeft = targetRight - contentWidth;
      placement = `${placement.split("-")[0]}-right`;
      arrowPlacementStyle = {
        left:
          Math.floor(targetRight - contentLeft - targetWidth / 2) -
          TOOLTIP_STATIC_SPACE / 2
      };
    }
    if (contentLeft <= contentMinLeft) {
      contentLeft = targetLeft;
      placement = `${placement.split("-")[0]}-left`;
      arrowPlacementStyle = { left: 0 };
    }

    this.isRepositioning = true;
    this.setState(
      {
        placement,
        placementStyle: {
          top: contentTop,
          left: contentLeft
        },
        arrowPlacement: placement,
        arrowPlacementStyle
      },
      () => (this.isRepositioning = false)
    );
  }

  render() {
    const { className: _className, isOpen, size, arrow, children } = this.props;
    const {
      placement,
      placementStyle,
      arrowPlacement,
      arrowPlacementStyle
    } = this.state;
    const className = classnames(
      "brz-ed-animated brz-ed-animated--fadeInUp",
      `brz-ed-tooltip__overlay brz-ed-tooltip--${placement}`,
      { [`brz-ed-tooltip--${size}`]: size },
      { "brz-invisible": !isOpen },
      _className
    );
    const arrowClassName = classnames(
      "brz-ed-arrow",
      `brz-ed-arrow--${arrowPlacement}`
    );

    return (
      <div ref={this.contentRef} className={className} style={placementStyle}>
        {arrow && (
          <div className={arrowClassName} style={arrowPlacementStyle} />
        )}
        {children}
      </div>
    );
  }
}
