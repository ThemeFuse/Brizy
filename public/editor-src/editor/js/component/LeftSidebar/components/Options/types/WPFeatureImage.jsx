import classnames from "classnames";
import React from "react";
import _ from "underscore";
import { ImageSetter } from "visual/component/Controls/ImageSetter";
import {
  removeFeaturedImage,
  updateFeaturedImage,
  updateFeaturedImageFocalPoint
} from "visual/utils/api";
import { getFileFormat } from "visual/utils/customFile/utils";


const debouncedUpdateFeaturedImageFocalPoint = _.debounce((...args) => {
  updateFeaturedImageFocalPoint(...args);
}, 1000);

export default class WPFeatureImage extends React.Component {
  static defaultProps = {
    label: "",
    className: "",
    title: ""
  };

  currentFeaturedImage = (() => {
    const wpConfig = this.props.globalConfig.wp;
    const { id, url, pointX, pointY } = wpConfig?.featuredImage || {};

    return {
      id: id || "",
      url: url || "",
      pointX: pointX || 50,
      pointY: pointY || 50
    };
  })();

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleImageChange = (value) => {
    const { globalConfig } = this.props;
    const { src: url, x: pointX, y: pointY } = value;

    if (url === "") {
      this.currentFeaturedImage = {
        id: "",
        url: "",
        pointX: 50,
        pointY: 50
      };

      removeFeaturedImage(globalConfig);
    } else {
      this.currentFeaturedImage.pointX = pointX;
      this.currentFeaturedImage.pointY = pointY;

      debouncedUpdateFeaturedImageFocalPoint(
        this.currentFeaturedImage.id,
        pointX,
        pointY,
        globalConfig
      );
    }

    this.forceUpdate();
  };

  handleImageUpload = () => {
    const wp = global.wp || global.parent.wp;

    if (!wp) {
      throw new Error("Could not find WordPress on global object (window.wp)");
    }

    if (!wp.media) {
      throw new Error(
        "Could not find WordPress media object (window.wp.media). Make sure the WordPress media script is enqueued."
      );
    }

    if (this.props.meta && this.props.meta.popover) {
      this.props.meta.popover.hide();
    }

    const iframe = parent.document.querySelector("#brz-ed-iframe");

    const frame = wp.media.featuredImage.frame();

    const { globalConfig } = this.props;

    frame.on("select", () => {
      const attachment = frame.state().get("selection").first();
      const { url, id } = attachment.attributes;

      updateFeaturedImage(id, globalConfig).then(() => {
        this.currentFeaturedImage.id = id;
        this.currentFeaturedImage.url = url;

        if (this.mounted) {
          this.forceUpdate();
        }
      });
    });
    frame.on("close", () => {
      iframe?.classList.remove("media-modal-open");

      if (this.props.meta && this.props.meta.popover) {
        this.props.meta.popover.show();
      }
    });

    iframe?.classList.add("media-modal-open");
    frame.open();
  };

  render() {
    const { className: _className, label, title } = this.props;
    const className = classnames(
      "brz-ed-sidebar__wp-feature__image",
      _className
    );
    const { pointX, pointY, url } = this.currentFeaturedImage;

    const addMedia = this.props.addMedia ?? {};

    return (
      <div className={className} title={title}>
        {label && <div className="brz-ed-option__label">{label}</div>}
        <div>
          <ImageSetter
            src={url}
            extension={getFileFormat(url)}
            customUrl={true}
            x={pointX}
            y={pointY}
            onUpload={this.handleImageUpload}
            onChange={this.handleImageChange}
            addMedia={addMedia}
          />
        </div>
      </div>
    );
  }
}
