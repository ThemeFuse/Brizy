import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Config from "visual/global/Config";
import ImageSetter from "visual/component/Controls/ImageSetter";
import {
  updateFeaturedImage,
  updateFeaturedImageFocalPoint,
  removeFeaturedImage
} from "visual/utils/api";
import { getImageFormat } from "visual/utils/image";

const { page } = Config.get("wp");
const debouncedUpdateFeaturedImageFocalPoint = _.debounce((...args) => {
  updateFeaturedImageFocalPoint(...args);
}, 1000);

export default class WPFeatureImage extends React.Component {
  static defaultProps = {
    label: "",
    className: "",
    title: ""
  };

  static currentFeaturedImage = (() => {
    const { id, url, pointX, pointY } = Config.get("wp").featuredImage || {};

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

  handleImageChange = value => {
    const { src: url, x: pointX, y: pointY } = value;

    if (url === "") {
      this.constructor.currentFeaturedImage = {
        id: "",
        url: "",
        pointX: 50,
        pointY: 50
      };

      removeFeaturedImage(page);
    } else {
      this.constructor.currentFeaturedImage.pointX = pointX;
      this.constructor.currentFeaturedImage.pointY = pointY;

      debouncedUpdateFeaturedImageFocalPoint(
        page,
        this.constructor.currentFeaturedImage.id,
        pointX,
        pointY
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

    const frame = wp.media.featuredImage.frame();
    frame.on("select", () => {
      const attachment = frame
        .state()
        .get("selection")
        .first();
      const { url, id } = attachment.attributes;

      updateFeaturedImage(page, id).then(() => {
        this.constructor.currentFeaturedImage.id = id;
        this.constructor.currentFeaturedImage.url = url;

        if (this.mounted) {
          this.forceUpdate();
        }
      });
    });
    frame.on("close", () => {
      if (this.props.meta && this.props.meta.popover) {
        this.props.meta.popover.show();
      }
    });
    frame.open();
  };

  render() {
    const { className: _className, label, title } = this.props;
    const className = classnames(
      "brz-ed-sidebar__wp-feature__image",
      _className
    );
    const { pointX, pointY, url } = this.constructor.currentFeaturedImage;

    return (
      <div className={className} title={title}>
        {label && <div className="brz-ed-option__label">{label}</div>}
        <div>
          <ImageSetter
            src={url}
            extension={getImageFormat(url)}
            customUrl={true}
            x={pointX}
            y={pointY}
            onUpload={this.handleImageUpload}
            onChange={this.handleImageChange}
          />
        </div>
      </div>
    );
  }
}
