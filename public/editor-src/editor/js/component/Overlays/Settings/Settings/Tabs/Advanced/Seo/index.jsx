import React from "react";
import _ from "underscore";
import classnames from "classnames";
import jQuery from "jquery";
import Globals from "visual/global/Globals";
import Notifications from "visual/global/Notifications";
import UploadImage, {
  getBase64,
  isValidExtension
} from "visual/helper/utils/UploadUtils";
import { url } from "visual/helper/utils/UrlUtils";

const ACCEPT = ["jpeg", "jpg", "png", "gif", "ico", "svg"];

class Seo extends React.Component {
  state = _.extend(
    {
      title: "",
      keywords: "",
      description: "",
      favicon: "",
      loading: false
    },
    Globals.get("seo")
  );

  componentWillMount() {
    const { favicon } = this.state;
    if (favicon) {
      const faviconUrl = url(favicon.name, {
        type: "open"
      });
      this.setState({
        favicon: faviconUrl
      });
    }
  }

  onChange = (type, event) => {
    this.setState({
      [type]: event.target.value
    });
  };

  onFaviconChange = () => {
    const files = this.fileupload.files;

    if (!files || !files[0] || !isValidExtension(ACCEPT, files[0].name)) {
      return;
    }

    getBase64(files[0]).then(base64 => {
      this.setState({
        favicon: base64
      });
    });
  };

  onRemoveImage = () => {
    jQuery(this.fileupload).val("");

    this.setState({
      favicon: ""
    });
  };

  onSave = event => {
    event.preventDefault();
    const files = this.fileupload.files;

    if (files && files[0]) {
      UploadImage(files, {
        type: "file",
        accept: ACCEPT,
        onUploadStart: () => {
          this.setState({
            loading: true
          });
        },
        onChange: data => {
          const imgUrl = url(data.name, {
            type: "open"
          });

          const newState = _.extend(_.omit(this.state, "loading"), {
            favicon: data
          });
          Globals.set("seo", newState, "project");

          const faviconElem = jQuery('link[rel="icon"]');
          if (faviconElem.length) {
            faviconElem.attr("href", imgUrl);
          } else {
            jQuery("head").append(`<link rel='icon' href='${imgUrl}' />`);
          }

          this.setState({
            favicon: imgUrl,
            loading: false
          });
        },
        onUploadFail: err => {
          if (err.name === "InvalidFile") {
            Notifications.addNotification({
              id: "image-upload-fail",
              type: Notifications.notificationTypes.error,
              text:
                "The uploaded file is not supported. Only JPG, PNG or GIFs allowed."
            });
          }

          this.setState({
            loading: false
          });
        }
      });
    } else {
      const seo = _.extend(
        {},
        Globals.get("seo"),
        _.omit(this.state, "loading")
      );
      Globals.set("seo", seo, "project");
    }
  };

  renderFavicon = () => {
    return this.state.favicon ? (
      <div
        className="brz-ed-popup-image-upload"
        style={{
          backgroundImage: `url(${this.state.favicon})`,
          backgroundSize: "contain"
        }}
      />
    ) : (
      <div className="brz-ed-popup-image-upload" />
    );
  };

  renderRemoveIcon = () => {
    return this.state.favicon ? (
      <div className="brz-ed-popup-image-remove" onClick={this.onRemoveImage}>
        <i className="brz-ed-icon-close-solid" />
      </div>
    ) : null;
  };

  render() {
    const className = classnames("brz-ed-popup-metrics-cols", {
      loading: this.state.loading
    });
    const imageStyle = this.state.favicon
      ? {
          backgroundImage: `url(${this.state.favicon})`,
          backgroundSize: "contain"
        }
      : null;

    return (
      <div className={className}>
        <div className="brz-ed-popup-metrics-head">
          <h3 className="brz-h3">Search Engines Optimization</h3>
          <p className="brz-p">Config your meta for search engines</p>
        </div>
        <div className="brz-ed-popup-metrics-body brz-ed-popup-meta-form">
          <div className="et-row">
            <div className="et-col-xs-3">
              <div className="brz-ed-popup-meta-group">
                <h4 className="brz-h4">Favicon</h4>
                <div className="brz-ed-popup-image-inner">
                  {this.renderRemoveIcon()}
                  <label className="brz-label brz-ed-popup-image-label">
                    <div className="brz-ed-loading">
                      <div
                        ref={el => {
                          this.fileImage = el;
                        }}
                        className="brz-ed-popup-image-upload"
                        style={imageStyle}
                      />
                    </div>
                    <input
                      className="brz-input"
                      type="file"
                      ref={el => {
                        this.fileupload = el;
                      }}
                      hidden
                      onChange={this.onFaviconChange}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="et-col-xs-9">
              <div className="brz-ed-popup-meta-group">
                <h4 className="brz-h4">Meta Title</h4>
                <input
                  className="brz-input brz-ed-popup-meta-input"
                  type="text"
                  value={this.state.title}
                  onChange={this.onChange.bind(null, "title")}
                  placeholder="Meta title"
                />
              </div>
              <div className="brz-ed-popup-meta-group">
                <h4 className="brz-h4">Meta Keywords</h4>
                <textarea
                  className="brz-textarea brz-ed-popup-meta-textarea"
                  type="text"
                  value={this.state.keywords}
                  onChange={this.onChange.bind(null, "keywords")}
                  placeholder="Meta keywords..."
                />
              </div>
              <div className="brz-ed-popup-meta-group">
                <h4 className="brz-h4">Meta Description</h4>
                <textarea
                  className="brz-textarea brz-ed-popup-meta-textarea"
                  value={this.state.description}
                  onChange={this.onChange.bind(null, "description")}
                  placeholder="Meta description..."
                />
              </div>
              <button
                className="brz-button brz-ed-btn brz-ed-btn-dark"
                onClick={this.onSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Seo;
