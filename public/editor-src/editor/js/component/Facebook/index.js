import React, { useContext } from "react";
import {
  EmbeddedPost,
  EmbeddedVideo,
  FacebookContext,
  FacebookProvider,
  Like,
  Page
} from "react-facebook";
import { isEditor } from "visual/providers/RenderProvider";

const isFacebookReady = false;

// The `type` prop names one of these. `react-facebook` exports no `Group`,
// so FacebookGroup resolves to undefined here exactly as it did when this
// was a namespace lookup. `__proto__: null` keeps that true for every other
// unknown `type` too: no inherited Object.prototype member can answer instead.
const components = {
  __proto__: null,
  EmbeddedPost,
  EmbeddedVideo,
  Like,
  Page
};

const FacebookWrapper = ({ children }) => {
  const data = useContext(FacebookContext);
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
    const Component = components[type];

    return (
      <FacebookProvider appId={appId}>
        <FacebookWrapper>
          <Component {...data} />
        </FacebookWrapper>
      </FacebookProvider>
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
