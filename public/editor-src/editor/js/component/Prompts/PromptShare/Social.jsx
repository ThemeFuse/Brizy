import React from "react";
import jQuery from "jquery";
import classnames from "classnames";
import Globals from "visual/global/Globals";
import Notifications from "visual/global/Notifications";
import imageUrl from "visual/helper/utils/UrlUtils/imageUrl";
import UploadImage from "visual/helper/utils/Media/Upload";

const TITLE_MAX_LENGTH = 70;
const DESC_MAX_LENGTH = 160;
const TWITTER_MAX_LENGTH = 140;

class Share extends React.Component {
  constructor(props) {
    super(props);
    const { title = "", description = "", img = "", twitter = "" } =
      Globals.get("socialMeta") || {};

    this.state = {
      title,
      description,
      img,
      twitter,
      loading: false
    };
  }

  onSave = event => {
    event.preventDefault();
    event.stopPropagation();

    const { title, description, img, twitter } = this.state;
    Globals.set(
      "socialMeta",
      { title, description, img, twitter },
      "project"
    ).then(() => {
      this.setState({
        loading: false
      });
      this.props.onChange();
    });

    this.setState({
      loading: true
    });
  };

  handleChangeSocial = (property, event) => {
    if (property === "img") {
      this.uploadImage(event.target.files);
      return;
    }
    this.setState({
      [property]: event.target.value
    });
  };

  removeImage = () => {
    const img = "";
    this.setState({ img });
    Globals.set("socialMeta", { img }, "project");
    jQuery(this.inputFile).val("");
  };

  uploadImage = () => {
    const _this = this;
    UploadImage({
      accept: ["jpeg", "jpg", "png", "gif"],
      onPreview() {
        jQuery(_this.fileImage).addClass("brz-invisible");
      },
      onChange(data) {
        data.size = "520x*xR";
        const imgSrc = imageUrl(data);
        _this.setState({ img: imgSrc });
        Globals.set("socialMeta", { img: imgSrc }, "project");
        jQuery(_this.fileImage).removeClass("brz-invisible");
      },
      onUploadFail(err) {
        if (err.name === "InvalidFile") {
          Notifications.addNotification({
            id: "image-upload-fail",
            type: Notifications.notificationTypes.error,
            text:
              "The uploaded file is not supported. Only JPG, PNG or GIFs allowed."
          });
        }
      }
    });
  };

  render() {
    const { title, description, img, twitter } = this.state;
    const twitterCharsLeft = TWITTER_MAX_LENGTH - twitter.length;
    const imageStyle = img
      ? { backgroundImage: `url(${img})`, backgroundSize: "contain" }
      : null;
    const removeImage = img ? (
      <div className="brz-ed-popup-image-remove" onClick={this.removeImage}>
        <i className="brz-ed-icon-close-solid" />
      </div>
    ) : null;

    const className = classnames("brz-ed-popup-content", {
      loading: this.state.loading
    });

    return (
      <div className={className}>
        <div className="brz-ed-popup-metrics-head">
          <h3 className="brz-h3">SOCIAL META</h3>
          <p className="brz-p">
            Enter social meta tags that will represent the page on the social
            networks
          </p>
        </div>
        <div className="brz-ed-popup-metrics-body brz-ed-popup-meta-form">
          <div className="et-row">
            <div className="et-col-xs-3">
              <h4 className="brz-h4">Thumbnail Image</h4>
              <div className="brz-ed-popup-image-inner">
                {removeImage}
                <label
                  className="brz-label brz-ed-popup-image-label"
                  onClick={this.uploadImage}
                >
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
                    accept="image/*"
                    ref={el => {
                      this.inputFile = el;
                    }}
                    hidden
                    onChange={this.handleChangeSocial.bind(null, "img")}
                  />
                </label>
              </div>
            </div>
            <div className="et-col-xs-9">
              <div className="brz-ed-popup-meta-group">
                <h4 className="brz-h4">Facebook, Linkedin, G+</h4>
                <input
                  type="text"
                  maxLength={TITLE_MAX_LENGTH}
                  value={title}
                  className="brz-input brz-ed-popup-meta-input"
                  onChange={this.handleChangeSocial.bind(null, "title")}
                  placeholder="Status message..."
                />
              </div>
              <div className="brz-ed-popup-meta-group">
                <textarea
                  maxLength={DESC_MAX_LENGTH}
                  value={description}
                  className="brz-textarea brz-ed-popup-meta-textarea"
                  onChange={this.handleChangeSocial.bind(null, "description")}
                  placeholder="Description"
                />
              </div>
              <div className="brz-ed-popup-meta-group">
                <div className="brz-ed-popup-meta-count">
                  <h4 className="brz-h4">Twitter</h4>
                  <p className="brz-p">
                    <strong>{twitterCharsLeft}</strong>
                  </p>
                </div>
                <textarea
                  maxLength={TWITTER_MAX_LENGTH}
                  value={twitter}
                  className="brz-textarea brz-ed-popup-meta-textarea"
                  onChange={this.handleChangeSocial.bind(null, "twitter")}
                  placeholder="Status message..."
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

export default Share;
