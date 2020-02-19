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

  renderForEdit() {
    const { skin } = this.props;

    const classNameStyle = classnames(
      "brz-wp__sidebar",
      "brz-comments-parrent"
    );

    let renderComments = (data, skin) => {
      function renderChildren(children, skin) {
        return children.map((items, key) => {
          let childrenSkin = {
            skin1: (
              <>
                <li className="comment even depth-2 brz-comments brz-comments__skin-skin1">
                  <div className="brz-comments__logo">
                    <a href="#">
                      <img
                        src={items.photo}
                        className="brz-img brz-comments__logo-img"
                      />
                    </a>
                  </div>
                  <ul className="brz-ul brz-comments__right-date">
                    <li className="brz-li brz-comments__name">
                      <a href="#">{items.name}</a>
                    </li>
                    <li className="brz-li brz-comments__date">
                      <a href="#">
                        <span className="brz-span">23.09.2019, 14:36</span>
                      </a>
                    </li>

                    <li className="brz-li brz-comments__reply">
                      <a className="comment-reply-link" href="#">
                        Reply
                      </a>
                    </li>
                    <li className="brz-comment-awaiting-moderation">
                      {items.message}
                    </li>
                  </ul>
                </li>
                {items.children && renderChildren(items.children, "skin1")}
              </>
            ),
            skin2: (
              <>
                <li className="brz-comments brz-comments__skin-skin2">
                  <div className="brz-comments__logo">
                    <a href="#">
                      <img
                        src={items.photo}
                        className="brz-img brz-comments__logo-img"
                      />
                    </a>
                  </div>
                  <ul className="brz-ul brz-comments__right-date">
                    <li className="brz-li brz-comments__name-date">
                      <span className="brz-span brz-comments__name">
                        <a href="#">{items.name}</a>
                      </span>
                      <span className="brz-span brz-comments__date">
                        <a href="#">
                          <span className="brz-span">23.09.2019, 14:36</span>
                        </a>
                      </span>
                    </li>

                    <li className="brz-comment-awaiting-moderation">
                      {items.message}
                    </li>

                    <li className="brz-li brz-comments__reply">
                      <a className="comment-reply-link" href="#">
                        Reply
                      </a>
                    </li>
                  </ul>
                </li>
                {items.children && renderChildren(items.children, "skin2")}
              </>
            ),
            skin3: (
              <>
                <li className="brz-comments brz-comments__skin-skin3">
                  <div className="brz-comments__logo">
                    <a href="#">
                      <img
                        src={items.photo}
                        className="brz-img brz-comments__logo-img"
                      />
                    </a>
                  </div>
                  <ul className="brz-ul brz-comments__right-date">
                    <li className="brz-li brz-comments__name">
                      <a href="#">{items.name}</a>
                    </li>
                    <li className="brz-li brz-comments__date">
                      <a href="#">
                        <span className="brz-span">23.09.2019, 14:36</span>
                      </a>
                    </li>

                    <li className="brz-comment-awaiting-moderation">
                      {items.message}
                      <a className="comment-reply-link" href="#">
                        Reply
                      </a>
                    </li>
                  </ul>
                </li>
                {items.children && renderChildren(items.children, "skin3")}
              </>
            ),
            skin4: (
              <>
                <li className="brz-comments brz-comments__skin-skin4">
                  <ul className="brz-ul brz-comments__right-date">
                    <li className="brz-li brz-comments__name-date">
                      <span className="brz-span brz-comments__name">
                        <a href="#">{items.name}</a>
                      </span>
                      <span className="brz-span brz-comments__date">
                        <a href="#">
                          <span className="brz-span">23.09.2019, 14:36</span>
                        </a>
                      </span>
                    </li>

                    <li className="brz-comments__logo">
                      <a href="#">
                        <img
                          src={items.photo}
                          className="brz-img brz-comments__logo-img"
                        />
                      </a>
                    </li>
                    <li className="brz-li brz-comments__text">
                      <p>
                        {items.message}
                        <a className="comment-reply-link" href="#">
                          Reply
                        </a>
                      </p>
                    </li>
                  </ul>
                </li>
                {items.children && renderChildren(items.children, "skin4")}
              </>
            )
          };

          return (
            <ul key={key} className="brz-comments-children">
              {childrenSkin[skin]}
            </ul>
          );
        });
      }

      return data[skin].map((i, key) => {
        let skinDom = {
          skin1: (
            <li key={key} className="brz-comments brz-comments__skin-skin1">
              <div className="brz-comments__logo">
                <a href="#">
                  <img
                    src={i.photo}
                    className="brz-img brz-comments__logo-img"
                  />
                </a>
              </div>
              <ul className="brz-ul brz-comments__right-date">
                <li className="brz-li brz-comments__name">
                  <a href="#">{i.name}</a>
                </li>
                <li className="brz-li brz-comments__date">
                  <a href="#">
                    <span className="brz-span">23.09.2019, 14:35</span>
                  </a>
                </li>

                <li className="brz-li brz-comments__reply">
                  <a className="comment-reply-link" href="#">
                    Reply
                  </a>
                </li>
                <li className="brz-comment-awaiting-moderation">{i.message}</li>
              </ul>
              {i.children && renderChildren(i.children, "skin1")}
            </li>
          ),
          skin2: (
            <li key={key} className="brz-comments brz-comments__skin-skin2">
              <div className="brz-comments__logo">
                <a href="#">
                  <img
                    src={i.photo}
                    className="brz-img brz-comments__logo-img"
                  />
                </a>
              </div>
              <ul className="brz-ul brz-comments__right-date">
                <li className="brz-li brz-comments__name-date">
                  <span className="brz-span brz-comments__name">
                    <a href="#">{i.name}</a>
                  </span>
                  <span className="brz-span brz-comments__date">
                    <a href="#">
                      <span className="brz-span">23.09.2019, 14:35</span>
                    </a>
                  </span>
                </li>

                <li className="brz-comment-awaiting-moderation">{i.message}</li>

                <li className="brz-li brz-comments__reply">
                  <a className="comment-reply-link" href="#">
                    Reply
                  </a>
                </li>
              </ul>
              {i.children && renderChildren(i.children, "skin2")}
            </li>
          ),
          skin3: (
            <li key={key} className="brz-comments brz-comments__skin-skin3">
              <div className="brz-comments__logo">
                <a href="#">
                  <img
                    src={i.photo}
                    className="brz-img brz-comments__logo-img"
                  />
                </a>
              </div>
              <ul className="brz-ul brz-comments__right-date">
                <li className="brz-li brz-comments__name">
                  <a href="#">{i.name}</a>
                </li>
                <li className="brz-li brz-comments__date">
                  <a href="#">
                    <span className="brz-span">23.09.2019, 14:35</span>
                  </a>
                </li>

                <li className="brz-comment-awaiting-moderation">
                  {i.message}
                  <a className="comment-reply-link" href="#">
                    Reply
                  </a>
                </li>
              </ul>
              {i.children && renderChildren(i.children, "skin3")}
            </li>
          ),
          skin4: (
            <li key={key} className="brz-comments brz-comments__skin-skin4">
              <ul className="brz-ul brz-comments__right-date">
                <li className="brz-li brz-comments__name-date">
                  <span className="brz-span brz-comments__name">
                    <a href="#">{i.name}</a>
                  </span>
                  <span className="brz-span brz-comments__date">
                    <a href="#">
                      <span className="brz-span">23.09.2019, 14:35</span>
                    </a>
                  </span>
                </li>

                <li className="brz-comments__logo">
                  <a href="#">
                    <img
                      src={i.photo}
                      className="brz-img brz-comments__logo-img"
                    />
                  </a>
                </li>
                <li className="brz-li brz-comments__text">
                  <p>
                    {i.message}
                    <a className="comment-reply-link" href="#">
                      Reply
                    </a>
                  </p>
                </li>
              </ul>
              {i.children && renderChildren(i.children, "skin4")}
            </li>
          )
        };

        return skinDom[skin];
      });
    };

    return (
      <div className={classNameStyle}>
        <div>
          <div className="brz-blocked">
            <ul className="brz-comments">{renderComments(dataPeople, skin)}</ul>
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

    const classNameStyle = classnames(
      "brz-wp__sidebar",
      "brz-comments-parrent"
    );

    return (
      <WPShortcode
        className={classNameStyle}
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
