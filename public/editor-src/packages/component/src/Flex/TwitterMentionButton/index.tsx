import React, { ReactElement } from "react";
import { TwitterMentionButton } from "react-twitter-embed";
import { Props, PropsPreview } from "./types";

export const TwitterMentionEditor = (props: Props): ReactElement => {
  const { name, size } = props;
  return (
    <TwitterMentionButton
      key={JSON.stringify(props)}
      screenName={name}
      options={{
        size: size
      }}
    />
  );
};

export const TwitterMentionPreview = ({ name, size, tweet }: PropsPreview) => {
  return (
    <a
      className="twitter-mention-button"
      href={`https://twitter.com/${name}?screen_name=${name}`}
      data-text={tweet}
      data-size={size}
    />
  );
};
