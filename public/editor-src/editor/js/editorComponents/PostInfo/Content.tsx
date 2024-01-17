import React, { ReactElement } from "react";
import { useDC } from "visual/editorComponents/EditorComponent/DynamicContent/useDC";
import { PostInfoEditor, PostInfoHtml } from "visual/component/BrizyBuilder";
import Placeholder from "visual/component/Placeholder";
import { getPlaceholder } from "./utils";
import { Slug } from "./types";

export const Content = ({
  postElements
}: {
  postElements: Slug[];
}): ReactElement => {
  const {
    author: authorPlaceholder,
    date: datePlaceholder,
    time: timePlaceholder
  } = getPlaceholder(postElements);

  const author = useDC(authorPlaceholder);
  const date = useDC(datePlaceholder);
  const time = useDC(timePlaceholder);

  const PostInfo = IS_EDITOR ? PostInfoEditor : PostInfoHtml;

  const res = [author, date, time];
  if (res.every((data) => data.status !== "success")) {
    return <Placeholder icon="wp-post-info" />;
  }

  const [authorData, dateData, timeData] = res.map((item) =>
    item.status === "success" ? item.data : ""
  );

  return <PostInfo author={authorData} date={dateData} time={timeData} />;
};
