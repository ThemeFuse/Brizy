import { DangerouslySetHtmlContent } from "component/common/components/DangerouslySetHtmlContent";
import React, { ReactElement } from "react";
import { Props } from "./types";

export const EmbedCode = (props: Props): ReactElement => {
  const { code, className, ssr, tagName } = props;

  return (
    <div className="brz-embed-content">
      <DangerouslySetHtmlContent
        tagName={tagName ?? "div"}
        html={code}
        className={className}
        ssr={ssr}
      />
    </div>
  );
};
