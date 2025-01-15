import Disqus from "disqus-react";
import React from "react";
import { isEditor } from "visual/providers/RenderProvider";
import Facebook from "../Facebook";
import WPComments from "./WPComments";

class Comments extends React.Component {
  static defaultProps = {
    type: "",
    appId: "",
    data: {}
  };

  renderForEdit() {
    const { appId, type, data, renderContext } = this.props;

    return type === "facebook" ? (
      <Facebook
        appId={appId}
        type="Comments"
        data={data}
        renderContext={renderContext}
      />
    ) : type === "disqus" && data.shortname === "" ? (
      <p className="brz-disqus-no-data">Add the required data</p>
    ) : type === "disqus" ? (
      <Disqus.DiscussionEmbed {...data} />
    ) : (
      <WPComments {...data} renderContext={renderContext} />
    );
  }

  renderForView() {
    const { appId, type, data, renderContext } = this.props;

    return type === "facebook" ? (
      <Facebook
        appId={appId}
        type="Comments"
        data={data}
        renderContext={renderContext}
      />
    ) : type === "disqus" ? (
      <div id="disqus_thread" {...data}></div>
    ) : (
      <WPComments {...data} renderContext={renderContext} />
    );
  }

  render() {
    return isEditor(this.props.renderContext)
      ? this.renderForEdit()
      : this.renderForView();
  }
}

export default Comments;
