import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { uploadFile } from "visual/utils/api";

class FileUpload extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    acceptedExtensions: [],
    label: "",
    placeholder: "",
    helper: null,
    helperContent: null,
    value: "",
    onChange: _.noop
  };

  state = { loading: false, value: this.props.value };
  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleChange = async e => {
    const { files } = e.target;

    if (!files || !files[0]) {
      return;
    }

    this.setState({
      loading: true
    });

    try {
      const { name, filename } = await uploadFile(files[0]);
      const value = `${name}|||${filename}`;

      if (this.mounted) {
        this.setState({
          value,
          loading: false
        });
      }

      this.props.onChange(value);
    } catch (e) {
      if (this.mounted) {
        this.setState({
          loading: false,
          value: ""
        });
      }
      if (process.env.NODE_ENV === "development") {
        console.error("Image upload error", e);
      }
    }
  };

  handleRemove = () => {
    this.setState({ value: "" });
    this.props.onChange("");
  };

  renderLabel() {
    const { label, helper, helperContent } = this.props;

    return (
      <div className="brz-ed-option__label">
        {label}
        {helper && (
          <div className="brz-ed-option__helper">
            <EditorIcon icon="nc-alert-circle-que" />
            <div
              className="brz-ed-option__helper__content"
              dangerouslySetInnerHTML={{ __html: helperContent }}
            />
          </div>
        )}
      </div>
    );
  }

  renderUploadButton() {
    const { acceptedExtensions } = this.props;
    return (
      <div className="brz-file-upload">
        <EditorIcon icon="nc-add" />
        <input
          type="file"
          onChange={this.handleChange}
          accept={acceptedExtensions.join(",")}
        />
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="brz-file-upload">
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </div>
    );
  }

  renderFileName() {
    const lastSymbolsAmount = 20;
    const [, fileName] = this.state.value.split("|||", 2);

    const newFileName =
      fileName.length > lastSymbolsAmount
        ? "..." +
          fileName.substring(
            fileName.length - lastSymbolsAmount,
            fileName.length
          )
        : fileName;

    return (
      <div className="brz-file-name brz-ed-option__inline">
        <span className="brz-file-title" title={fileName}>
          {newFileName}
        </span>
        <span className="brz-file-remove">
          <EditorIcon icon="nc-remove" onClick={this.handleRemove} />
        </span>
      </div>
    );
  }

  render() {
    const { loading, value } = this.state;
    const { label, helper, className: _className } = this.props;
    const className = classnames(
      "brz-ed-option__inline",
      "brz-ed-option__file_upload",
      _className
    );

    return (
      <div className={className}>
        {(label || helper) && this.renderLabel()}
        {loading
          ? this.renderLoading()
          : value
          ? this.renderFileName()
          : this.renderUploadButton()}
      </div>
    );
  }
}

export default FileUpload;
