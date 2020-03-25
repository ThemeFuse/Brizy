import React, { Component } from "react";
import classnames from "classnames";
import { WPShortcode } from "visual/editorComponents/WordPress/common/WPShortcode";
import { dataPeople } from "./dataPeople";

class WPComments extends Component {
  static defaultProps = {
    limit: 0,
    skin: "",
    linkPage: ""
  };

  templateComment(item, skin) {
    const { name, photo, message, children } = item;
    const nameDateClassName = classnames("brz-li", {
      "brz-comments__name": skin === "skin1" || skin === "skin3",
      "brz-comments__name-date": skin === "skin2"
    });

    if (skin === "skin4") {
      return (
        <>
          <ul className="brz-ul brz-comments__right-date">
            <li className="brz-li brz-comments__name-date">
              <span className="brz-span brz-comments__name">
                <a href="#">{name}</a>
              </span>
              <span className="brz-span brz-comments__date">
                <a href="#">
                  <span className="brz-span">23.09.2019, 14:35</span>
                </a>
              </span>
            </li>
            <li className="brz-comments__logo">
              <a href="#">
                <img src={photo} className="brz-img brz-comments__logo-img" />
              </a>
            </li>
            <li className="brz-li brz-comments__text">
              <p>
                {message}
                <a className="comment-reply-link" href="#">
                  Reply
                </a>
              </p>
            </li>
          </ul>
          {children && (
            <ul className="brz-comments-children">
              <li className="comment even depth-2 brz-comments brz-comments__skin-skin4">
                {this.templateComment(children[0], skin)}
              </li>
            </ul>
          )}
        </>
      );
    }

    return (
      <>
        <div className="brz-comments__logo">
          <a href="#">
            <img src={photo} className="brz-img brz-comments__logo-img" />
          </a>
        </div>

        <ul className="brz-ul brz-comments__right-date">
          <li className={nameDateClassName}>
            {(skin === "skin1" || skin === "skin3") && <a href="#">{name}</a>}

            {skin === "skin2" && (
              <>
                <span className="brz-span brz-comments__name">
                  <a href="#">{name}</a>
                </span>
                <span className="brz-span brz-comments__date">
                  <a href="#">
                    <span className="brz-span">23.09.2019, 14:35</span>
                  </a>
                </span>
              </>
            )}
          </li>

          {(skin === "skin1" || skin === "skin3") && (
            <li className="brz-li brz-comments__date">
              <a href="#">
                <span className="brz-span">23.09.2019, 14:35</span>
              </a>
            </li>
          )}

          {skin === "skin1" && (
            <li className="brz-li brz-comments__reply">
              <a className="comment-reply-link" href="#">
                Reply
              </a>
            </li>
          )}

          <li className="brz-comment-awaiting-moderation">
            {message}
            {skin === "skin3" && (
              <a className="comment-reply-link" href="#">
                Reply
              </a>
            )}
          </li>

          {skin === "skin2" && (
            <li className="brz-li brz-comments__reply">
              <a className="comment-reply-link" href="#">
                Reply
              </a>
            </li>
          )}
        </ul>

        {children && (
          <ul className="brz-comments-children">
            <li
              className={`comment even depth-2 brz-comments brz-comments__skin-${skin}`}
            >
              {this.templateComment(children[0], skin)}
            </li>
          </ul>
        )}
      </>
    );
  }

  renderForEdit() {
    const { skin } = this.props;
    const comments = dataPeople[skin];

    return (
      <div className="brz-comments-parrent">
        <div>
          <div className="brz-blocked">
            <ul className="brz-comments">
              {comments.map((item, key) => (
                <li
                  key={key}
                  className={`comment even depth-2 brz-comments brz-comments__skin-${skin}`}
                >
                  {this.templateComment(item, skin)}
                </li>
              ))}
            </ul>
            <div className="brz-comment-respond">
              <h3 id="reply-title" className="brz-comment-reply-title">
                Leave a comment
              </h3>
              <form className="brz-form brz--comment__form-reply-body">
                <p className="brz-comment-form-comment">
                  <textarea
                    name="comment"
                    cols="45"
                    rows="8"
                    aria-required="true"
                  />
                </p>
                <p className="brz-form-submit">
                  <input
                    name="submit"
                    type="submit"
                    id="brz-submit"
                    className="brz-submit"
                    value="Post Comment"
                  />
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderForView() {
    const { limit, skin, linkPage } = this.props;
    const attributes = { limit, skin, linkPage };

    return (
      <WPShortcode
        className="brz-comments-parrent"
        name="brizy_comments"
        attributes={attributes}
        placeholderIcon="wp-shortcode"
      />
    );
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}

export default WPComments;
