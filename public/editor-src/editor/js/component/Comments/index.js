import Disqus from "disqus-react";
import React from "react";
import { isEditor } from "visual/providers/RenderProvider";
import { DeprecatedComments } from "./Deprecated";
import WPComments from "./WPComments";

class Comments extends React.Component {
  static defaultProps = {
    type: "",
    data: {}
  };

  renderForEdit() {
    const { type, data, config, renderContext } = this.props;

    return type === "facebook" ? (
      <DeprecatedComments />
    ) : type === "disqus" && data.shortname === "" ? (
      <p className="brz-disqus-no-data">Add the required data</p>
    ) : type === "disqus" ? (
      <Disqus.DiscussionEmbed {...data} />
    ) : (
      <WPComments {...data} config={config} renderContext={renderContext} />
    );
  }

  renderForView() {
    const { type, data, config, renderContext } = this.props;

    if (type === "facebook") {
      return null;
    }

    return type === "disqus" ? (
      <div id="disqus_thread" {...data}></div>
    ) : (
      <WPComments {...data} config={config} renderContext={renderContext} />
    );
  }

  render() {
    return isEditor(this.props.renderContext)
      ? this.renderForEdit()
      : this.renderForView();
  }
}

export default Comments;
