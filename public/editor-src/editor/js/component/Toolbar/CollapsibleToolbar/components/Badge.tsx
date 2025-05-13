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
      {global && <EditorIcon icon="nc-global" />}
      {membership && <EditorIcon icon="nc-user" />}
      {language && <EditorIcon icon="nc-multi-languages" />}
    </div>
  );
}
