import React, { ReactElement } from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { Props } from "./types";

export const TwitterEmbedEditor = (props: Props): ReactElement => {
  const { height, theme, name } = props;
  return (
    <TwitterTimelineEmbed
      key={JSON.stringify(props)}
      sourceType="profile"
      screenName={name}
      options={{ height: height }}
      theme={theme}
    />
  );
};

export const TwitterEmbedPreview = ({ height, theme, name }: Props) => {
  return (
    <a
      className="twitter-timeline"
      href={`https://twitter.com/${name}`}
      data-height={height}
      data-theme={theme}
    />
  );
};
