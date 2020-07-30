import {
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2LineHeight,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleElementCommentsLogoSize,
  styleColor,
  styleBgColor,
  styleElementCommentsSkin
} from "visual/utils/style2";

import { cssStyleBgColor } from "./cssStyleBgColor";

export function cssStyleElementCommentsNameFontFamily({
  v,
  device,
  prefix = "name"
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix
      })};`
    : "";
}

export function cssStyleElementCommentsNameFontSize({
  v,
  device,
  prefix = "name"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementCommentsNameLineHeight({
  v,
  device,
  prefix = "name"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementCommentsNameFontWeight({
  v,
  device,
  prefix = "name"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementCommentsNameLetterSpacing({
  v,
  device,
  prefix = "name"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementCommentsCommentFontFamily({
  v,
  device,
  prefix = "comment"
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix
      })};`
    : "";
}

export function cssStyleElementCommentsCommentFontSize({
  v,
  device,
  prefix = "comment"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementCommentsCommentLineHeight({
  v,
  device,
  prefix = "comment"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementCommentsCommentFontWeight({
  v,
  device,
  prefix = "comment"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementCommentsCommentLetterSpacing({
  v,
  device,
  prefix = "comment"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementCommentsDateFontFamily({
  v,
  device,
  prefix = "date"
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix
      })};`
    : "";
}

export function cssStyleElementCommentsDateFontSize({
  v,
  device,
  prefix = "date"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementCommentsDateLineHeight({
  v,
  device,
  prefix = "date"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementCommentsDateFontWeight({
  v,
  device,
  prefix = "date"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix
  })};`;
}

export function cssStyleElementCommentsDateLetterSpacing({
  v,
  device,
  prefix = "date"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix
  })}px;`;
}

export function cssStyleElementCommentsReplyFontFamily({
  v,
  device,
  prefix = "reply"
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix
      })} !important;`
    : "";
}

export function cssStyleElementCommentsReplyFontSize({
  v,
  device,
  prefix = "reply"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsReplyLineHeight({
  v,
  device,
  prefix = "reply"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsReplyFontWeight({
  v,
  device,
  prefix = "reply"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsReplyLetterSpacing({
  v,
  device,
  prefix = "reply"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsPostButtonFontFamily({
  v,
  device,
  prefix = "postButton"
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix
      })} !important;`
    : "";
}

export function cssStyleElementCommentsPostButtonFontSize({
  v,
  device,
  prefix = "postButton"
}) {
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsPostButtonLineHeight({
  v,
  device,
  prefix = "postButton"
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsPostButtonFontWeight({
  v,
  device,
  prefix = "postButton"
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix
  })} !important;`;
}

export function cssStyleElementCommentsPostButtonLetterSpacing({
  v,
  device,
  prefix = "postButton"
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix
  })}px !important;`;
}

export function cssStyleElementCommentsLogoSize({
  v,
  device,
  state = "normal"
}) {
  const size = styleElementCommentsLogoSize({ v, device, state });
  return `width: ${size}px !important; height: ${size}px;`;
}

export function cssStyleElementCommentsWidthContainer({
  v,
  device,
  state = "normal"
}) {
  const size = styleElementCommentsLogoSize({
    v,
    device,
    state
  });

  const margin =
    styleElementCommentsSkin({ v, device, state }) === "skin3" ? 25 : 10;

  return `width: calc(100% - ${size + margin}px);`;
}

export function cssStyleElementCommentsPostButtonColor({
  v,
  device,
  state,
  prefix = "postButtonColor"
}) {
  const color = styleColor({ v, device, state, prefix });

  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleElementCommentsPostButtonBg({
  v,
  device,
  state,
  prefix = "postButtonBg"
}) {
  return cssStyleBgColor({ v, device, state, prefix });
}

export function cssStyleElementCommentsColorLink({
  v,
  device,
  state = "normal",
  prefix = "postButtonBg"
}) {
  const bgColor = styleBgColor({ v, device, state, prefix });

  return bgColor === undefined ? "" : `color:${bgColor} !important;`;
}

export function cssStyleElementCommentsNameColor({
  v,
  device,
  state,
  prefix = "nameColor"
}) {
  const color = styleColor({ v, device, state, prefix });

  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleElementCommentsCommentsColor({
  v,
  device,
  state,
  prefix = "commentsColor"
}) {
  const color = styleColor({ v, device, state, prefix });

  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleElementCommentsChildMargin({
  v,
  device,
  state = "normal"
}) {
  const size = styleElementCommentsLogoSize({
    v,
    device,
    state
  });

  const margin =
    styleElementCommentsSkin({ v, device, state }) === "skin3" ? 25 : 10;

  return `margin-left:${size + margin}px;`;
}
