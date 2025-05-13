import { ElementModel } from "visual/component/Elements/Types";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles: Styles = {
    ".brz &&": {
      standart: [
        "cssStyleSizeWidth",
        "cssStylePaddingBG",
        "cssStyleBorderRadius"
      ]
    },
    ".brz &&:hover": {
      standart: ["cssStyleBoxShadow", "cssStyleBgColor", "cssStyleBorder"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-comments__name": {
      standart: [
        "cssStyleElementCommentsNameFontFamily",
        "cssStyleElementCommentsNameFontSize",
        "cssStyleElementCommentsNameLineHeight",
        "cssStyleElementCommentsNameFontWeight",
        "cssStyleElementCommentsNameLetterSpacing",
        "cssStyleElementCommentsNameFontVariation",
        "cssStyleElementCommentsNameTextTransform"
      ]
    },
    ".brz && .brz-comments__name:hover": {
      standart: ["cssStyleElementCommentsNameColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-comments__date": {
      standart: [
        "cssStyleElementCommentsDateFontFamily",
        "cssStyleElementCommentsDateFontSize",
        "cssStyleElementCommentsDateLineHeight",
        "cssStyleElementCommentsDateFontWeight",
        "cssStyleElementCommentsDateLetterSpacing",
        "cssStyleElementCommentsDateFontVariation",
        "cssStyleElementCommentsDateTextTransform"
      ]
    },
    ".brz &&:hover .brz-comments__date": {
      standart: ["cssStyleElementCommentsCommentsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-comments__reply, .brz && .comment-reply-link": {
      standart: [
        "cssStyleElementCommentsReplyFontFamily",
        "cssStyleElementCommentsReplyFontSize",
        "cssStyleElementCommentsReplyLineHeight",
        "cssStyleElementCommentsReplyFontWeight",
        "cssStyleElementCommentsReplyLetterSpacing",
        "cssStyleElementCommentsReplyFontVariation",
        "cssStyleElementCommentsReplyTextTransform"
      ]
    },
    ".brz && .brz-comment-awaiting-moderation, .brz && .brz-comments__text": {
      standart: [
        "cssStyleElementCommentsCommentFontFamily",
        "cssStyleElementCommentsCommentFontSize",
        "cssStyleElementCommentsCommentLineHeight",
        "cssStyleElementCommentsCommentFontWeight",
        "cssStyleElementCommentsCommentLetterSpacing",
        "cssStyleElementCommentsCommentFontVariation",
        "cssStyleElementCommentsCommentTextTransform"
      ]
    },
    ".brz && .brz-comment-awaiting-moderation:hover": {
      standart: ["cssStyleElementCommentsCommentsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-comments__text:hover": {
      standart: ["cssStyleElementCommentsCommentsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-comment-respond .brz-submit": {
      standart: [
        "cssStyleElementCommentsPostButtonFontFamily",
        "cssStyleElementCommentsPostButtonFontSize",
        "cssStyleElementCommentsPostButtonLineHeight",
        "cssStyleElementCommentsPostButtonFontWeight",
        "cssStyleElementCommentsPostButtonLetterSpacing",
        "cssStyleElementCommentsPostButtonFontVariation",
        "cssStyleElementCommentsPostButtonTextTransform"
      ]
    },
    ".brz && .brz-comment-respond .brz-submit:hover": {
      standart: [
        "cssStyleElementCommentsPostButtonColor",
        "cssStyleElementCommentsPostButtonBg"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-comments__logo .brz-img": {
      standart: ["cssStyleElementCommentsLogoSize"]
    },
    ".brz && .brz-comments__right-date": {
      standart: ["cssStyleElementCommentsWidthContainer"]
    },
    ".brz && .brz-logged-in-as a, && .nav-links a, && .comment-reply-link, && #cancel-comment-reply-link":
      {
        standart: ["cssStyleElementCommentsColorLink"],
        interval: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      },
    ".brz && .brz-comments.brz-parent .brz-comments": {
      standart: ["cssStyleElementCommentsChildMargin"]
    },
    ".brz && .brz-comment-reply-title, && .brz-comment-form-comment > label": {
      standart: ["cssStyleElementCommentsNameFontFamily"]
    },
    ".brz && .review .brz-comments__rating .star-rating": {
      standart: ["cssStyleElementCommentsStarsSize"]
    },
    ".brz &&:hover .review .brz-comments__rating .star-rating": {
      standart: ["cssStyleElementCommentsStarsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .review .brz-comments__rating .star-rating:before": {
      standart: ["cssStyleElementCommentsStarsBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .stars a": {
      standart: ["cssStyleElementCommentsStarsSize"]
    },
    ".brz &&:hover .stars a": {
      standart: ["cssStyleElementCommentsStarsBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .stars:hover a::before": {
      standart: ["cssStyleElementCommentsStarsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .stars a:hover": {
      standart: ["cssStyleElementCommentsStarsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .stars a:hover ~ a::before": {
      standart: ["cssStyleElementCommentsStarsBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .stars a.active ~ a::before": {
      standart: ["cssStyleElementCommentsStarsBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .selected a::before": {
      standart: ["cssStyleElementCommentsStarsColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}
