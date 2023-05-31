import React, { ReactElement } from "react";
import { TwitterFollowButton } from "react-twitter-embed";
import { Props } from "./types";

export const TwitterFollowEditor = (props: Props): ReactElement => {
  const { name, size, showCount, showScreenName } = props;
  return (
    <TwitterFollowButton
      key={JSON.stringify(props)}
      screenName={name}
      options={{
        size: size,
        showCount: showCount,
        showScreenName: showScreenName
      }}
    />
  );
};

export const TwitterFollowPreview = ({
  name,
  size,
  showCount,
  showScreenName
}: Props) => {
  return (
    <a
      className="twitter-follow-button"
      href={`https://twitter.com/${name}`}
      data-related={name}
      data-show-screen-name={showScreenName}
      data-size={size}
      data-show-count={showCount}
    />
  );
};
