import classnames from "classnames";
import React from "react";
import Link from "visual/component/Link";
import { getLinkData } from "visual/utils/models/link";
import { ImageProps } from "../types";

function withLink(
  WrappedComponent: React.ComponentType<ImageProps>
): React.FC<ImageProps> {
  const linkComponent: React.FC<ImageProps> = (props) => {
    const { actionClosePopup } = props.v;
    const link = getLinkData(props.v);

    if (link.href) {
      const className = classnames({
        "brz-popup2__action-close":
          link.type === "action" && actionClosePopup === "on"
      });

      return (
        <Link
          className={className}
          type={link.type}
          href={link.href}
          target={link.target}
          rel={link.rel}
          slide={link.slide}
          draggable={false}
        >
          <WrappedComponent {...props} />
        </Link>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return linkComponent;
}

export default withLink;
