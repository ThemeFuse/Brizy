import React from "react";
import * as FacebookApi from "react-facebook";

class Facebook extends React.Component {
  static defaultProps = {
    appId: "",
    type: "",
    data: {}
  };

  renderForEdit() {
    const { appId, type, data } = this.props;
    const Component = FacebookApi[type];
    const Provider = FacebookApi.FacebookProvider;

    return (
      <Provider appId={appId}>
        <Component {...data} />
      </Provider>
    );
  }

  renderForView() {
    const { appId, type, data } = this.props;

    return (
      <div
        {...data}
        className={`brz-facebook fb-${type.toLocaleLowerCase()}`}
        appid={appId}
      />
    );
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}

export default Facebook;
