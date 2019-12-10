import React from "react";
import PropTypes from "prop-types";
import Options from "visual/component/Options";
import PointerEvents from "visual/component/PointerEvents";
import ScrollPane from "visual/component/ScrollPane";
import Animation from "./Animation";

class RightSidebar extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired
  };

  // renderFooter = () => {
  //   return <div className="brz-ed-sidebar__footer">SideBarRightFooter</div>;
  // };

  render() {
    const { isOpen, title, options } = this.props;

    return (
      <PointerEvents>
        <div className="brz-ed-sidebar brz-ed-sidebar__right">
          <Animation in={isOpen}>
            <div className="brz-ed-sidebar__header">
              <h1 className="brz-h1 brz-ed-sidebar__header__title">{title}</h1>
            </div>
            <div className="brz-ed-sidebar__main brz-ed-sidebar__right__options">
              {isOpen && (
                <ScrollPane
                  className="brz-ed-scroll-pane brz-ed-scroll--darker brz-ed-scroll--medium brz-ed-sidebar__right__scroll"
                  style={{ height: "100%" }}
                >
                  <Options
                    className="brz-ed-sidebar__right__tabs"
                    optionClassName="brz-ed-sidebar__right__option"
                    data={options}
                    location="rightSidebar"
                  />
                </ScrollPane>
              )}
            </div>
            {/* this.renderFooter() */}
          </Animation>
        </div>
      </PointerEvents>
    );
  }
}

export default RightSidebar;
