import { ElementModel } from "visual/component/Elements/Types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { DynamicStylesProps } from "visual/types";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles: {
    [k: string]: {
      interval?: string[];
      standart?: string[];
    };
  } = {
    ".brz &&:hover": {
      standart: [
        "cssStyleSizeWidth",
        "cssStyleBoxShadow",
        "cssStyleBgColor",
        "cssStyleBorder",
        "cssStylePaddingBG",
        "cssStyleBorderRadius"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-comments__name:hover": {
      standart: [
        "cssStyleElementCommentsNameColor",
        "cssStyleElementCommentsNameFontFamily",
        "cssStyleElementCommentsNameFontSize",
        "cssStyleElementCommentsNameLineHeight",
        "cssStyleElementCommentsNameFontWeight",
        "cssStyleElementCommentsNameLetterSpacing",
        "cssStyleElementCommentsNameFontVariation",
        "cssStyleElementCommentsNameTextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-comments__date": {
      standart: [
        "cssStyleElementCommentsCommentsColor",
        "cssStyleElementCommentsDateFontFamily",
        "cssStyleElementCommentsDateFontSize",
        "cssStyleElementCommentsDateLineHeight",
        "cssStyleElementCommentsDateFontWeight",
        "cssStyleElementCommentsDateLetterSpacing",
        "cssStyleElementCommentsDateFontVariation",
        "cssStyleElementCommentsDateTextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-comments__reply": {
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
    ".brz && .brz-comment-awaiting-moderation:hover": {
      standart: [
        "cssStyleElementCommentsCommentsColor",
        "cssStyleElementCommentsCommentFontFamily",
        "cssStyleElementCommentsCommentFontSize",
        "cssStyleElementCommentsCommentLineHeight",
        "cssStyleElementCommentsCommentFontWeight",
        "cssStyleElementCommentsCommentLetterSpacing",
        "cssStyleElementCommentsCommentFontVariation",
        "cssStyleElementCommentsCommentTextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz && .brz-comments__text:hover": {
      standart: [
        "cssStyleElementCommentsCommentsColor",
        "cssStyleElementCommentsCommentFontFamily",
        "cssStyleElementCommentsCommentFontSize",
        "cssStyleElementCommentsCommentLineHeight",
        "cssStyleElementCommentsCommentFontWeight",
        "cssStyleElementCommentsCommentLetterSpacing",
        "cssStyleElementCommentsCommentFontVariation",
        "cssStyleElementCommentsCommentTextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .comment-reply-link": {
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
    ".brz && .brz-comment-respond .brz-submit:hover": {
      standart: [
        "cssStyleElementCommentsPostButtonColor",
        "cssStyleElementCommentsPostButtonBg",
        "cssStyleElementCommentsPostButtonFontFamily",
        "cssStyleElementCommentsPostButtonFontSize",
        "cssStyleElementCommentsPostButtonLineHeight",
        "cssStyleElementCommentsPostButtonFontWeight",
        "cssStyleElementCommentsPostButtonLetterSpacing",
        "cssStyleElementCommentsPostButtonFontVariation",
        "cssStyleElementCommentsPostButtonTextTransform"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover .brz-comments__logo .brz-img": {
      standart: ["cssStyleElementCommentsLogoSize"]
    },
    ".brz &&:hover .brz-comments__right-date": {
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
    ".brz &&:hover .stars a": {
      standart: [
        "cssStyleElementCommentsStarsSize",
        "cssStyleElementCommentsStarsBgColor"
      ],
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
