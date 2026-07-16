import React from "react";
import EditorIcon from "visual/component/EditorIcon";

export interface BadgeProps {
  language: boolean;
  membership: boolean;
  global: boolean;
}

export function Badge(props: BadgeProps) {
  const { language, membership, global } = props;

  return (
    <div className="brz-ed-collapsible__badge">
      {global && (
        <span data-section-global="true">
          <EditorIcon icon="nc-global" />
        </span>
      )}
      {membership && (
        <span data-section-membership="true">
          <EditorIcon icon="nc-user" />
        </span>
      )}
      {language && (
        <span data-section-multi-language="true">
          <EditorIcon icon="nc-multi-languages" />
        </span>
      )}
    </div>
  );
}
