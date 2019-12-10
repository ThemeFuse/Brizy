import React from "react";
import classnames from "classnames";
import Notifications from "visual/global/Notifications";
import EditorIcon from "visual/component/EditorIcon";
import {
  uploadImage,
  preloadImage,
  imageUrl,
  svgUrl,
  getImageFormat
} from "visual/utils/image";

import Image from "./Image";

const isSVG = extension => extension === "svg";

export default class ImageSetter extends React.Component {
  static defaultProps = {
    className: "",
    src: "",
    x: 50,
    y: 50,
    width: 0,
    height: 0,
    extension: null,
    onlyPointer: false,
    showPointer: true,
    customUrl: false,
    onUpload: null
  };

  state = {
    src: this.props.src,
    width: this.props.width,
    height: this.props.height,
    extension: this.props.extension,
    loading: false
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.setState({
        src: nextProps.src
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleChange = (value, meta) => {
    const { x, y, extension } = this.props;
    const { src, width, height } = this.state;

    this.props.onChange(
      { src, width, height, x, y, extension, ...value },
      meta
    );
  };

  handleRemove = () => {
    const newValue = {
      src: "",
      width: 0,
      height: 0
    };

    this.setState(newValue);
    this.props.onChange(newValue, { isChanged: "image" });
  };

  handleImageChange = e => {
    const { files } = e.target;

    if (!files || !files[0]) {
      return;
    }

    this.setState({ loading: true });

    uploadImage(files[0], {
      acceptedExtensions: ["jpeg", "jpg", "png", "gif", "svg"],
      onUpload: ({ name: src }) => {
        const extension = getImageFormat(src);
        const imgUrl = isSVG(extension) ? svgUrl(src) : imageUrl(src);

        preloadImage(imgUrl).then(({ width, height }) => {
          const { x, y } = this.props;
          const newValue = { x, y, src, width, height, extension };
          if (this.mounted) {
            this.setState({
              ...newValue,
              loading: false
            });
          }

          this.handleChange(newValue, { isChanged: "image" });
        });
      },
      onError: e => {
        Notifications.addNotification({
          id: "image-upload-fail",
          type: Notifications.notificationTypes.error,
          text:
            "Failed to upload file. Please upload a valid JPG, PNG, SVG or GIF image."
        });

        if (process.env.NODE_ENV === "development") {
          console.error("Image upload error", e);
        }
      }
    });
  };

  renderDraggable() {
    const { customUrl, onlyPointer, showPointer, x, y } = this.props;
    const { src, width, height, extension } = this.state;

    let content = [
      <Image
        key="image"
        src={src}
        width={width}
        height={height}
        x={x}
        y={y}
        customUrl={customUrl}
        extension={extension}
        showPointer={showPointer}
        onChange={this.handleChange}
      />
    ];

    if (!onlyPointer) {
      content.push(
        <div
          key="delete"
          className="brz-ed-control__focal-point__delete"
          onClick={this.handleRemove}
        >
          <EditorIcon icon="nc-circle-remove" />
        </div>
      );
    }

    return content;
  }

  renderUpload() {
    const { onlyPointer, onUpload } = this.props;
    const { loading } = this.state;
    const className = classnames(
      "brz-label brz-ed-control__focal-point__label",
      {
        "brz-ed-control__focal-point__label--disable": onlyPointer
      }
    );
    const hasCustomUpload = typeof onUpload === "function";

    return (
      <label className={className}>
        {loading ? (
          <div className="brz-ed-control__focal-point__upload brz-ed-control__focal-point__upload--loading">
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          </div>
        ) : (
          <div className="brz-ed-control__focal-point__upload">
            <EditorIcon icon="nc-upload" />
          </div>
        )}
        {!onlyPointer && (
          <input
            className="brz-input"
            type="file"
            accept="image/*"
            hidden
            onChange={hasCustomUpload ? onUpload : this.handleImageChange}
          />
        )}
      </label>
    );
  }

  render() {
    const className = classnames(
      "brz-ed-control__focal-point",
      this.props.className
    );

    return (
      <div className={className}>
        {this.state.src ? this.renderDraggable() : this.renderUpload()}
      </div>
    );
  }
}
