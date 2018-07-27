import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Notifications from "visual/global/Notifications";
import Draggable from "./Draggable";
import EditorIcon from "visual/component-new/EditorIcon";
import {
  uploadImage,
  preloadImage,
  imageUrl,
  imageWrapperSize
} from "visual/utils/image";

const MAX_IMAGE_SETTER_WIDTH = 140;

export default class ImageSetter extends React.Component {
  static defaultProps = {
    className: "",
    src: "",
    x: 50,
    y: 50,
    width: 0,
    height: 0,
    onlyPointer: false
  };

  state = {
    ...this.props,
    loading: false
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getNewValue = value => {
    return _.extend({}, this.state, { ...value });
  };

  handleChangePosition = value => {
    const newValue = this.getNewValue(value);
    this.setState(newValue);
    this.props.onChange(newValue);
  };

  handleImageChange = e => {
    const { files } = e.target;

    if (!files || !files[0]) {
      return;
    }

    this.setState({ loading: true });

    uploadImage(files[0], {
      acceptedExtensions: ["jpeg", "jpg", "png", "gif"],
      onUpload: ({ name: imageSrc }) => {
        const imgUrl = imageUrl(imageSrc);

        preloadImage(imgUrl).then(({ width, height }) => {
          const newValue = this.getNewValue({
            src: imageSrc,
            loading: false,
            width,
            height
          });
          if (this.mounted) {
            this.setState(newValue);
          }
          this.props.onChange(newValue);
        });
      },
      onError: e => {
        Notifications.addNotification({
          id: "image-upload-fail",
          type: Notifications.notificationTypes.error,
          text:
            "Failed to upload file. Please upload a valid JPG, PNG or GIF image."
        });

        if (process.env.NODE_ENV === "development") {
          console.error("Image upload error", e);
        }
      }
    });
  };

  handleRemove = () => {
    const newValue = this.getNewValue(this.constructor.defaultProps);
    this.setState(newValue);
    this.props.onChange(newValue);
  };

  renderDraggable = () => {
    const {
      src,
      x,
      y,
      width: _width,
      height: _height,
      onlyPointer
    } = this.state;
    const position = { x, y };
    const imgUrl = imageUrl(src, {
      iW: MAX_IMAGE_SETTER_WIDTH,
      iH: "any"
    });

    const { width, height } = imageWrapperSize(
      _width,
      _height,
      MAX_IMAGE_SETTER_WIDTH
    );

    let content = [
      <div
        key="setter"
        className="brz-ed-control__focal-point__setter"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <img className="brz-img" src={imgUrl} />
        <Draggable
          bounds="parent"
          position={position}
          onDrag={this.handleChangePosition}
          onDragEnd={this.handleChangePosition}
        >
          <div className="brz-ed-control__focal-point__point" />
        </Draggable>
      </div>
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
  };

  renderUpload = () => {
    const { onlyPointer } = this.props;
    const { loading } = this.state;
    const className = classnames(
      "brz-label brz-ed-control__focal-point__label",
      {
        "brz-ed-control__focal-point__label--disable": onlyPointer
      }
    );

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
        {!onlyPointer ? (
          <input
            className="brz-input"
            type="file"
            accept="image/*"
            hidden
            onChange={this.handleImageChange}
          />
        ) : null}
      </label>
    );
  };

  render() {
    const className = classnames(
      "brz-ed-control__focal-point",
      this.props.className
    );

    return (
      <div className={className}>
        {Boolean(this.state.src) ? this.renderDraggable() : this.renderUpload()}
      </div>
    );
  }
}
