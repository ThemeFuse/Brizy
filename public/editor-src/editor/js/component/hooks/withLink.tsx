import React, { ComponentType, ReactElement } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Link from "visual/component/Link";
import { StoryAnchorAttribute } from "visual/component/Link/types/Slide";
import { useConfig } from "visual/providers/ConfigProvider";
import { getLinkData } from "visual/utils/models/link";
import { read } from "visual/utils/reader/object";

export interface LinkProps {
  className?: string;
  draggable?: boolean;
  slide?: StoryAnchorAttribute;
}

export const withLink =
  <T extends ElementModel = ElementModel>(WrapperComponent: ComponentType<T>) =>
  (
    props: T & {
      linkProps: LinkProps;
    }
  ): ReactElement => {
    const link = read(props.v) ?? {};
    const { linkProps } = props;

    const config = useConfig();
    const linkData = getLinkData(link, config);

    if (linkData.href) {
      return (
        <Link
          type={linkData.type}
          href={linkData.href}
          target={linkData.target}
          rel={linkData.rel}
          {...(linkProps ?? {})}
        >
          <WrapperComponent {...props} />
        </Link>
      );
    }

    return <WrapperComponent {...props} />;
  };
