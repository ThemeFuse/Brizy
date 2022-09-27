import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleSizeWidth",
        "cssStyleBoxShadow",
        "cssStyleBgColor",
        "cssStyleBorder"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz && .brz-comments__name:hover": {
      standart: [
        "cssStyleElementCommentsNameColor",
        "cssStyleElementCommentsNameFontFamily",
        "cssStyleElementCommentsNameFontSize",
        "cssStyleElementCommentsNameLineHeight",
        "cssStyleElementCommentsNameFontWeight",
        "cssStyleElementCommentsNameLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-comments__date": {
      standart: [
        "cssStyleElementCommentsCommentsColor",
        "cssStyleElementCommentsDateFontFamily",
        "cssStyleElementCommentsDateFontSize",
        "cssStyleElementCommentsDateLineHeight",
        "cssStyleElementCommentsDateFontWeight",
        "cssStyleElementCommentsDateLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-comments__reply": {
      standart: [
        "cssStyleElementCommentsReplyFontFamily",
        "cssStyleElementCommentsReplyFontSize",
        "cssStyleElementCommentsReplyLineHeight",
        "cssStyleElementCommentsReplyFontWeight",
        "cssStyleElementCommentsReplyLetterSpacing"
      ]
    },
    ".brz && .brz-comment-awaiting-moderation:hover": {
      standart: [
        "cssStyleElementCommentsCommentsColor",
        "cssStyleElementCommentsCommentFontFamily",
        "cssStyleElementCommentsCommentFontSize",
        "cssStyleElementCommentsCommentLineHeight",
        "cssStyleElementCommentsCommentFontWeight",
        "cssStyleElementCommentsCommentLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz && .brz-comments__text:hover": {
      standart: [
        "cssStyleElementCommentsCommentsColor",
        "cssStyleElementCommentsCommentFontFamily",
        "cssStyleElementCommentsCommentFontSize",
        "cssStyleElementCommentsCommentLineHeight",
        "cssStyleElementCommentsCommentFontWeight",
        "cssStyleElementCommentsCommentLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .comment-reply-link": {
      standart: [
        "cssStyleElementCommentsReplyFontFamily",
        "cssStyleElementCommentsReplyFontSize",
        "cssStyleElementCommentsReplyLineHeight",
        "cssStyleElementCommentsReplyFontWeight",
        "cssStyleElementCommentsReplyLetterSpacing"
      ]
    },
    ".brz && .brz-comment-respond .brz-submit:hover": {
      standart: [
        "cssStyleElementCommentsPostButtonColor",
        "cssStyleElementCommentsPostButtonBg",
        "cssStyleElementCommentsPostButtonFontFamily",
        "cssStyleElementCommentsPostButtonFontSize",
        "cssStyleElementCommentsPostButtonLineHeight",
        "cssStyleElementCommentsPostButtonFontWeight",
        "cssStyleElementCommentsPostButtonLetterSpacing"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-comments__logo .brz-img": {
      standart: ["cssStyleElementCommentsLogoSize"]
    },
    ".brz &&:hover .brz-comments__right-date": {
      standart: ["cssStyleElementCommentsWidthContainer"]
    },
    ".brz && .brz-logged-in-as a, && .nav-links a, && .comment-reply-link, && #cancel-comment-reply-link": {
      standart: ["cssStyleElementCommentsColorLink"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .brz-comments.brz-parent .brz-comments": {
      standart: ["cssStyleElementCommentsChildMargin"]
    },
    ".brz && .brz-comment-reply-title, && .brz-comment-form-comment > label": {
      standart: ["cssStyleElementCommentsNameFontFamily"]
    },
    ".brz &&:hover .review .brz-comments__rating .star-rating": {
      standart: [
        "cssStyleElementCommentsStarsSize",
        "cssStyleElementCommentsStarsColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .review .brz-comments__rating .star-rating:before": {
      standart: ["cssStyleElementCommentsStarsBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .stars a": {
      standart: [
        "cssStyleElementCommentsStarsSize",
        "cssStyleElementCommentsStarsBgColor"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .stars:hover a::before": {
      standart: ["cssStyleElementCommentsStarsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .stars a:hover": {
      standart: ["cssStyleElementCommentsStarsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .stars a:hover ~ a::before": {
      standart: ["cssStyleElementCommentsStarsBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .stars a.active ~ a::before": {
      standart: ["cssStyleElementCommentsStarsBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    },
    ".brz &&:hover .selected a::before": {
      standart: ["cssStyleElementCommentsStarsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementFacebookCommentsPropertyHoverTransition"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
