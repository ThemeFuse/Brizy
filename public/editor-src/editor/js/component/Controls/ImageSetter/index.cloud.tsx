import classnames from "classnames";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  ReactElement,
  ReactNode,
  ReactText
} from "react";
import { noop } from "rxjs";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { Select2 } from "visual/component/Controls/Select2";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { Extensions } from "visual/component/Options/types/dev/ImageUpload/Types";
import { t } from "visual/utils/i18n";
import {
  getImageFormat,
  imageUrl,
  isSVG,
  preloadImage,
  svgUrl
} from "visual/utils/image";
import { uploadImage } from "visual/utils/image/uploadImage";
import Image from "./Image";
import { getExtensionsMessage } from "./utils";

export interface Value {
  src: string;
  fileName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  extension: string;
}

export type Meta = {
  isChanged: "image" | "pointer";
};

export interface Props<T extends ReactText> {
  className?: string;
  src: string;
  fileName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  extension: string;
  onlyPointer: boolean;
  showPointer: boolean;
  customUrl?: boolean;
  size: T;
  onUpload?: (e?: ChangeEvent<HTMLInputElement>) => void;
  onChange: (v: Value, meta: Meta) => void;
  sizes?: Array<{ value: T; label: string }>;
  onSizeChange?: (v: T) => void;
  acceptedExtensions?: Extensions[];
}

interface State {
  src: string;
  fileName: string;
  width: number;
  height: number;
  extension: string;
  loading: boolean;
}

export class ImageSetter<T extends ReactText> extends React.Component<
  Props<T>,
  State
> {
  state = {
    src: this.props.src,
    fileName: this.props.fileName,
    width: this.props.width,
    height: this.props.height,
    extension: this.props.extension,
    loading: false
  };

  mounted = false;
  defaultExtensions: Extensions[] = ["jpeg", "jpg", "png", "gif", "svg"];
  _extensions =
    this.props.acceptedExtensions && this.props.acceptedExtensions.length > 0
      ? this.props.acceptedExtensions
      : this.defaultExtensions;

  componentDidMount(): void {
    this.mounted = true;
  }

  componentDidUpdate(nextProps: Props<T>): void {
    if (this.props.src !== nextProps.src) {
      this.setState({
        src: this.props.src,
        fileName: this.props.fileName,
        width: this.props.width,
        height: this.props.height,
        extension: this.props.extension
      });
    }
  }

  componentWillUnmount(): void {
    this.mounted = false;
  }

  handleChange = (value: Partial<Value>, meta: Meta): void => {
    const { x, y, extension } = this.props;
    const { src, fileName, width, height } = this.state;

    this.props.onChange(
      { src, fileName, width, height, x, y, extension, ...value },
      meta
    );
  };

  handleRemove = (): void => {
    const newValue: Value = {
      src: "",
      fileName: "",
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      extension: ""
    };

    this.setState<"src" | "width" | "height" | "extension">(newValue);
    this.props.onChange(newValue, { isChanged: "image" });
  };

  handleImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;
    const file = files?.[0];

    if (!file) {
      return;
    }

    this.setState({ loading: true });

    uploadImage(file, {
      acceptedExtensions: this._extensions,
      onUpload: ({ name: src, fileName }) => {
        const extension = getImageFormat(src);

        if (!extension) {
          ToastNotification.error(
            t(
              "Failed to upload file. Please upload a valid JPG, PNG, SVG or GIF image."
            )
          );
          return;
        }

        const imgUrl = isSVG(src)
          ? svgUrl(src, { fileName })
          : imageUrl(src, { fileName });

        preloadImage(imgUrl)
          .then(({ width, height }) => {
            const { x, y } = this.props;
            const newValue = {
              x,
              y,
              src,
              width,
              height,
              extension,
              fileName
            };
            if (this.mounted) {
              this.setState({
                ...newValue,
                loading: false
              });
            }

            this.handleChange(newValue, { isChanged: "image" });
          })
          .catch((e) => {
            console.log(e);
          });
      },
      onError: (e) => {
        let errorMsg;

        if ((e as { status: number }).status === 413) {
          errorMsg =
            (e as { message?: string }).message ||
            t("Image file is too large.");
        } else {
          const extension = getExtensionsMessage(this._extensions);
          errorMsg = `${t(
            "Failed to upload file. Please upload a valid "
          )}${extension} ${t("image")}`;
        }

        ToastNotification.error(errorMsg);

        if (this.mounted) {
          this.setState({ loading: false });
        }

        if (process.env.NODE_ENV === "development") {
          console.error("Image upload error", e);
        }
      }
    });
  };

  renderDraggable(): ReactNode {
    const { customUrl, onlyPointer, showPointer, x, y } = this.props;
    const { src, width, height, extension } = this.state;

    const content = [
      <Image
        key={src}
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

  renderUpload(): ReactNode {
    const { onlyPointer, onUpload } = this.props;
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
        {!onlyPointer && (
          <input
            className="brz-input"
            type="file"
            accept="image/*"
            hidden
            onChange={onUpload ?? this.handleImageChange}
          />
        )}
      </label>
    );
  }

  renderSelect(): ReactElement | null {
    return this.props.sizes ? (
      <Select2<T>
        className="brz-control__select--dark brz-control__select__auto brz-ed-control__colorPickerSelect--select"
        value={this.props.size}
        editable={false}
        onChange={this.props.onSizeChange ?? noop}
        size="short"
      >
        {this.props.sizes?.map((s) => (
          <Item key={s.value} value={s.value}>
            <span title={s.label}>{s.label}</span>
          </Item>
        ))}
      </Select2>
    ) : null;
  }

  render(): ReactElement {
    const className = classnames(
      "brz-ed-control__focal-point",
      this.props.className
    );

    return (
      <div className={className}>
        {this.state.src ? this.renderDraggable() : this.renderUpload()}
        {this.state.src ? this.renderSelect() : null}
      </div>
    );
  }
}

export default ImageSetter;
