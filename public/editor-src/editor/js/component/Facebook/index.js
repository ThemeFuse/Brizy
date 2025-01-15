import React, { useContext } from "react";
import * as FacebookApi from "react-facebook";
import { isEditor } from "visual/providers/RenderProvider";

let isFacebookReady = false;

const FacebookWrapper = ({ children }) => {
  const data = useContext(FacebookApi.FacebookContext);
  const { isReady } = data;

  if (isReady && window.FB && !isFacebookReady) {
    window.FB.__buffer = window.FB.__buffer || true;
  }

  return children;
};

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
        <FacebookWrapper>
          <Component {...data} />
        </FacebookWrapper>
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
    return isEditor(this.props.renderContext)
      ? this.renderForEdit()
      : this.renderForView();
  }
}

export default Facebook;
