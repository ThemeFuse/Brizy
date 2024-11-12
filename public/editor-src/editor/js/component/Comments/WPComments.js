import classnames from "classnames";
import React, { Component } from "react";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { getDataSkin } from "./getDataSkin";

class WPComments extends Component {
  static defaultProps = {
    limit: 0,
    skin: "",
    linkPage: "",
    review: ""
  };

  templateComment(item, skin, review) {
    const { name, photo, message, children } = item;
    const nameDateClassName = classnames({
      "brz-comments__name": skin === "skin1" || skin === "skin3",
      "brz-comments__name-date": skin === "skin2"
    });

    const _review = review === "true";
    const commentType = _review ? "review" : "comment";

    const renderStars = _review && (
      <div className="brz-comments__rating">
        <div className="star-rating">
          <span style={{ width: "60%" }} />
        </div>
      </div>
    );

    if (skin === "skin4")
      return (
        <>
          <div className="brz-ul brz-comments__right-date">
            <div className="brz-comments__name-date">
              <span className="brz-span brz-comments__name">
                <a href="#">{name}</a>
              </span>
              <div className="brz-comments__left-side">
                <span className="brz-span brz-comments__date">
                  <a href="#">
                    <span className="brz-span">23.09.2019, 14:35</span>
                  </a>
                </span>
                {renderStars}
              </div>
            </div>
            <div className="brz-comments__logo">
              <a href="#">
                <img src={photo} className="brz-img brz-comments__logo-img" />
              </a>
            </div>
            <div className="brz-comments__text">
              <p>
                {message}
                {!_review && (
                  <a className="comment-reply-link" href="#">
                    Reply
                  </a>
                )}
              </p>
            </div>
          </div>
          {children && (
            <div
              className={`${commentType} even depth-2 brz-comments brz-comments__skin-skin4 brz-parent`}
            >
              {this.templateComment(children[0], skin, review)}
            </div>
          )}
        </>
      );

    return (
      <>
        <div className="brz-comments__logo">
          <a href="#">
            <img src={photo} className="brz-img brz-comments__logo-img" />
          </a>
        </div>

        <div className="brz-ul brz-comments__right-date">
          <div className={nameDateClassName}>
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
                {_review && skin === "skin2" && renderStars}
              </>
            )}
          </div>

          {skin === "skin1" && (
            <div className="brz-comments__right-side">
              {renderStars}
              <div className="brz-comments__date">
                <a href="#">
                  <span className="brz-span">23.09.2019, 14:35</span>
                </a>
              </div>
            </div>
          )}

          {skin === "skin3" && (
            <>
              <div className="brz-comments__date">
                <a href="#">
                  <span className="brz-span">23.09.2019, 14:35</span>
                </a>
              </div>
              {renderStars}
            </>
          )}

          {skin === "skin1" && !_review && (
            <div className="brz-comments__reply">
              <a className="comment-reply-link" href="#">
                Reply
              </a>
            </div>
          )}

          <div className="brz-comment-awaiting-moderation">
            {message}
            {skin === "skin3" && !_review && (
              <a className="comment-reply-link" href="#">
                Reply
              </a>
            )}
          </div>

          {skin === "skin2" && !_review && (
            <div className="brz-comments__reply">
              <a className="comment-reply-link" href="#">
                Reply
              </a>
            </div>
          )}
        </div>

        {children && (
          <div
            className={`${commentType} even depth-2 brz-comments brz-comments__skin-${skin} brz-parent`}
          >
            {this.templateComment(children[0], skin, review)}
          </div>
        )}
      </>
    );
  }

  renderForEdit() {
    const { skin, review } = this.props;
    const comments = getDataSkin()[skin];

    const commentType = review === "true" ? "review" : "comment";
    const reviewText =
      commentType === "review" ? "Add a review" : "Leave a comment";

    return (
      <div className="brz-comments-parrent">
        <div>
          <div className="brz-blocked">
            <div className="brz-comments">
              {comments.map((item, key) => (
                <div
                  key={key}
                  className={`${commentType} even depth-2 brz-comments brz-comments__skin-${skin} brz-parent`}
                >
                  {this.templateComment(item, skin, review)}
                </div>
              ))}
            </div>
            <div className="brz-comment-respond">
              <div className="brz--comment__form-reply-body">
                <h3 id="reply-title" className="brz-comment-reply-title">
                  {reviewText}
                </h3>
                {commentType === "review" && (
                  <div className="comment-form-rating">
                    <label>Your rating</label>
                    <p className="stars selected">
                      <a>1</a>
                      <a>2</a>
                      <a className="active">3</a>
                      <a>4</a>
                      <a>5</a>
                    </p>
                  </div>
                )}
              </div>
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
    const placeholder = makePlaceholder({
      content: "{{editor_comments}}",
      attr: { limit, skin, linkPage }
    });

    return (
      <DynamicContentHelper
        placeholder={placeholder}
        tagName="div"
        props={{ className: "brz-comments-parrent" }}
      />
    );
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}

export default WPComments;
