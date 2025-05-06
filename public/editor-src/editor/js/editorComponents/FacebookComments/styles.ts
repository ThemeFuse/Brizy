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
      standart: ["cssStyleBoxShadow", "cssStyleBgColor", "cssStyleBorder"]
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
      standart: ["cssStyleElementCommentsNameColor"]
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
      standart: ["cssStyleElementCommentsCommentsColor"]
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
      standart: ["cssStyleElementCommentsCommentsColor"]
    },
    ".brz && .brz-comments__text:hover": {
      standart: ["cssStyleElementCommentsCommentsColor"]
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
        standart: ["cssStyleElementCommentsColorLink"]
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
      standart: ["cssStyleElementCommentsStarsColor"]
    },
    ".brz &&:hover .review .brz-comments__rating .star-rating:before": {
      standart: ["cssStyleElementCommentsStarsBgColor"]
    },
    ".brz && .stars a": {
      standart: ["cssStyleElementCommentsStarsSize"]
    },
    ".brz &&:hover .stars a": {
      standart: ["cssStyleElementCommentsStarsBgColor"]
    },
    ".brz &&:hover .stars:hover a::before": {
      standart: ["cssStyleElementCommentsStarsColor"]
    },
    ".brz &&:hover .stars a:hover": {
      standart: ["cssStyleElementCommentsStarsColor"]
    },
    ".brz &&:hover .stars a:hover ~ a::before": {
      standart: ["cssStyleElementCommentsStarsBgColor"]
    },
    ".brz &&:hover .stars a.active ~ a::before": {
      standart: ["cssStyleElementCommentsStarsBgColor"]
    },
    ".brz &&:hover .selected a::before": {
      standart: ["cssStyleElementCommentsStarsColor"]
    },
    ".brz &&, .brz && .brz-comments__name, .brz && .brz-comments__date, .brz && .brz-comment-awaiting-moderation, .brz && .brz-comments__text, .brz && .brz-comment-respond .brz-submit, .brz && .brz-logged-in-as a, && .nav-links a, && .comment-reply-link, && #cancel-comment-reply-link, .brz && .review .brz-comments__rating .star-rating, .brz && .review .brz-comments__rating .star-rating:before, .brz && .stars a, .brz && .stars a::before, .brz && .stars a, .brz && .stars a ~ a::before, .brz && .stars a.active ~ a::before, .brz && .selected a::before":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...data, styles });
}
