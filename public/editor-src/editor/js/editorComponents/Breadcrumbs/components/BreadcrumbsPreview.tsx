import React from "react";
import {
  makeEndPlaceholder,
  makePlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";

export const BreadcrumbsPreview = () => {
  const startPlaceholder = makeStartPlaceholder({
    content: "{{brizy_dc_breadcrumbs}}"
  });

  const endPlaceholder = makeEndPlaceholder({
    content: "{{end_brizy_dc_breadcrumbs}}"
  });

  const titlePlaceholder = makePlaceholder({
    content: "{{brizy_dc_post_title}}"
  });

  const linkPlaceholder = makePlaceholder({
    content: "{{brizy_dc_url_post}}"
  });

  return (
    <nav className="brz-ui-ed-breadcrumbs">
      <ol>
        {startPlaceholder}
        <li>
          <a className="brz-ui-ed-breadcrumb-link" href={linkPlaceholder}>
            {titlePlaceholder}
          </a>
        </li>
        <li className="brz-ui-ed-breadcrumb-separator">
          <svg width="1em" height="1em" viewBox="0 0 16 16">
            <path
              fill="currentColor"
              d="M5.025 16 4 15.009 11.25 8 4 .991 5.025 0l7.762 7.504a.684.684 0 0 1 0 .992L5.025 16z"
            />
          </svg>
        </li>
        {endPlaceholder}
      </ol>
    </nav>
  );
};
