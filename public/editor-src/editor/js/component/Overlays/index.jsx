"use strict";

import _ from "underscore";
import jQuery from "jquery";
import React from "react";
import Router from "visual/global/Router";
import UIState from "visual/global/UIState";
import Overlay from "./Overlay";
import Settings from "./Settings";

var queryAliases = {
  domains: {
    overlay: "settings",
    tab: "settings",
    subtab: "list" // domains list
  }
};

class Overlays extends React.Component {
  state = {
    data: null
  };

  componentDidMount() {
    UIState.addChangeListener("overlays", this.onUIStateChange);
    Router.addChangeListener(this.onRouterChange);
  }

  componentWillUnmount() {
    UIState.removeChangeListener("overlays", this.onUIStateChange);
    Router.removeChangeListener(this.onRouterChange);
  }

  onRouterChange = (page, query) => {
    // checking if route contains ?overlay={overlay}
    if (query && query.overlay && queryAliases[query.overlay]) {
      this.openOverlay(queryAliases[query.overlay]);
    }
  };

  onUIStateChange = (data) => {
    if (data) {
      this.openOverlay(data);
    } else {
      this.closeOverlays();
    }
  };

  closeOverlays = () => {
    jQuery("html").removeClass("body-without-scroll");
    this.setState({
      data: null
    });

    // temporary clear all query because atm only Overlay uses it
    Router.clearQuery();
  };

  openOverlay = (data) => {
    jQuery("html").addClass("body-without-scroll");
    this.setState({
      data: data
    });
  };

  render() {
    const { data } = this.state;
    let children;

    if (data && data.overlay) {
      const props = _.omit(data, "overlay");
      children = (
        <Overlay show={true} onClose={this.closeOverlays}>
          <Settings {...props} />
        </Overlay>
      );
    }

    return (
      <div>
        {children}
      </div>
    );
  }
}

export default Overlays;
