import React from "react";
import classnames from "classnames";
import Notifications from "visual/global/Notifications";
import Draggable from "./Draggable";
import EditorIcon from "visual/component/EditorIcon";
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
    onlyPointer: false,
    customUrl: false,
    onUpload: null
  };

  state = {
    ...this.props,
    loading: false
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.src !== nextProps.src ||
      this.props.x !== nextProps.x ||
      this.props.y !== nextProps.y
    ) {
      this.setState({
        src: nextProps.src,
        x: nextProps.x,
        y: nextProps.y
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getNewValue = value => {
    return Object.assign({}, this.state, { ...value });
  };

  handleChangePosition = value => {
    const newValue = this.getNewValue(value);
    this.setState(newValue);
    this.props.onChange(newValue, { isChanged: "pointer" });
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
          this.props.onChange(newValue, { isChanged: "image" });
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
    this.props.onChange(newValue, { isChanged: "image" });
  };

  renderDraggable() {
    const { customUrl } = this.props;
    const {
      src,
      x,
      y,
      width: _width,
      height: _height,
      onlyPointer
    } = this.state;
    const position = { x, y };
    const imgUrl = customUrl
      ? src
      : imageUrl(src, {
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
