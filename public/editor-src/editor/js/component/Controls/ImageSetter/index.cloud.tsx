import React, {
  ChangeEvent,
  ChangeEventHandler,
  ReactElement,
  ReactNode,
  ReactText
} from "react";
import classnames from "classnames";
import ToastNotification from "cogo-toast";
import EditorIcon from "visual/component/EditorIcon";
import {
  uploadImage,
  preloadImage,
  imageUrl,
  svgUrl,
  getImageFormat
} from "visual/utils/image";
import { t } from "visual/utils/i18n";

import Image from "./Image";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { noop } from "rxjs";

const isSVG = (extension: string): extension is "svg" => extension === "svg";

export interface Value {
  src: string;
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
}

interface State {
  src: string;
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
    width: this.props.width,
    height: this.props.height,
    extension: this.props.extension,
    loading: false
  };

  mounted = false;

  componentDidMount(): void {
    this.mounted = true;
  }

  componentWillReceiveProps(nextProps: Props<T>): void {
    if (this.props.src !== nextProps.src) {
      this.setState({
        src: nextProps.src
      });
    }
  }

  componentWillUnmount(): void {
    this.mounted = false;
  }

  handleChange = (value: Partial<Value>, meta: Meta): void => {
    const { x, y, extension } = this.props;
    const { src, width, height } = this.state;

    this.props.onChange(
      { src, width, height, x, y, extension, ...value },
      meta
    );
  };

  handleRemove = (): void => {
    const newValue: Value = {
      src: "",
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      extension: ""
    };

    this.setState<"src" | "width" | "height" | "extension">(newValue);
    this.props.onChange(newValue, { isChanged: "image" });
  };

  handleImageChange: ChangeEventHandler<HTMLInputElement> = e => {
    const { files } = e.target;
    const file = files?.[0];

    if (!file) {
      return;
    }

    this.setState({ loading: true });

    uploadImage(file, {
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
        let errorMsg;

        if (e.status === 413) {
          errorMsg = e.message || t("Image file is too large.");
        } else {
          errorMsg = t(
            "Failed to upload file. Please upload a valid JPG, PNG, SVG or GIF image."
          );
        }

        ToastNotification.error(errorMsg);

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
        {this.props.sizes?.map(s => (
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
