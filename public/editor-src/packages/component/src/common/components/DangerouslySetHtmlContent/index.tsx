import React, { createElement, useEffect, useRef } from "react";
import type { Props } from "./types";

export const DangerouslySetHtmlContent: React.FC<Props> = ({
  html,
  tagName,
  className,
  ssr
}) => {
  const tagRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tag = tagRef.current;

    if (tag) {
      const slotHtml = document.createRange().createContextualFragment(html);
      tag.innerHTML = "";
      tag.appendChild(slotHtml);
    }
  }, [html, tagRef]);

  // If is server side rendering use dangerouslySetInnerHTML
  if (ssr) {
    return createElement(tagName, {
      className,
      dangerouslySetInnerHTML: { __html: html }
    });
  }

  return createElement(tagName, {
    className,
    ref: tagRef
  });
};
