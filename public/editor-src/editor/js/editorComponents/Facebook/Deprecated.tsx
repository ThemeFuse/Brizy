import React, { JSX } from "react";

export const Deprecated = React.forwardRef<HTMLDivElement>(
  (_, ref): JSX.Element => (
    <div ref={ref}>
      The Facebook Groups API has been deprecated. For more details, see the
      <a
        href="https://developers.facebook.com/blog/post/2024/01/23/introducing-facebook-graph-and-marketing-api-v19/"
        target="_blank"
        rel="noopener noreferrer"
      >
        &nbsp;official announcement
      </a>
      .
    </div>
  )
);
