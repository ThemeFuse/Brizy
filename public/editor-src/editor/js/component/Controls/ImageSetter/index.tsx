import classnames from "classnames";
import React, { ReactElement, ReactNode, ReactText } from "react";
import { noop } from "rxjs";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/Select2/Item";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { Extensions } from "visual/component/Options/types/dev/ImageUpload/Types";
import Config from "visual/global/Config";
import {
  AddImageData,
  Response,
  SizeType
} from "visual/global/Config/types/configs/common";
import { t } from "visual/utils/i18n";
import { getImageFormat, getImageUrl, preloadImage } from "visual/utils/image";
import Image from "./Image";
import { Meta } from "./types";

export interface Value {
  src: string;
  fileName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  extension: string;
}

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
  onUpload?: VoidFunction;
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

  handleImageChange = () => {
    const { api = {} } = Config.getAll();
    const { media = {} } = api;

    if (media.addMedia) {
      this.setState({ loading: true });

      const response: Response<AddImageData> = ({ uid, fileName }) => {
        if (!uid && !fileName) {
          ToastNotification.error(t("Invalid uid & fileName"));
          return;
        }

        const extension = getImageFormat(fileName);

        if (!extension) {
          ToastNotification.error(
            t(
              "Failed to upload file. Please upload a valid JPG, PNG, SVG or GIF image."
            )
          );
          return;
        }

        const src = getImageUrl({
          uid,
          fileName,
          sizeType: SizeType.original
        });

        preloadImage(src)
          .then(({ width, height }) => {
            const { x, y } = this.props;
            const newValue = {
              x,
              y,
              src: uid,
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
            this.setState({ loading: false });
            console.log(e);
          });
      };

      const reject: Response<string> = (message) => {
        this.setState({ loading: false });
        ToastNotification.error(message);
      };

      media.addMedia.handler(response, reject, {
        acceptedExtensions: this._extensions
      });
    } else {
      console.error("Config: Missing addMedia callback");
    }
  };

  onUpload = (): void => {
    const { onUpload, onlyPointer } = this.props;

    if (onlyPointer) {
      return;
    }

    onUpload ? onUpload() : this.handleImageChange();
  };

  renderDraggable(): ReactNode {
    const { customUrl, onlyPointer, showPointer, x, y } = this.props;
    const { src, width, height, extension, fileName } = this.state;

    const content = [
      <Image
        key={src}
        src={src}
        width={width}
        height={height}
        x={x}
        y={y}
        fileName={fileName}
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
    const { onlyPointer } = this.props;
    const { loading } = this.state;
    const className = classnames(
      "brz-label brz-ed-control__focal-point__label",
      {
        "brz-ed-control__focal-point__label--disable": onlyPointer
      }
    );

    return (
      <div className={className}>
        {loading ? (
          <div className="brz-ed-control__focal-point__upload brz-ed-control__focal-point__upload--loading">
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          </div>
        ) : (
          <div
            className="brz-ed-control__focal-point__upload"
            onClick={this.onUpload}
          >
            <EditorIcon icon="nc-upload" />
          </div>
        )}
      </div>
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
