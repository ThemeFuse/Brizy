import React, { ReactElement } from "react";
import { PostInfoEditor, PostInfoPreview } from "visual/component/BrizyBuilder";
import Placeholder from "visual/component/Placeholder";
import { useDC } from "visual/editorComponents/EditorComponent/DynamicContent/useDC";
import { Slug } from "./types";
import { getPlaceholder } from "./utils";

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

  const PostInfo = IS_EDITOR ? PostInfoEditor : PostInfoPreview;

  const res = [author, date, time];
  if (res.every((data) => data.status !== "success")) {
    return <Placeholder icon="wp-post-info" />;
  }

  const [authorData, dateData, timeData] = res.map((item) =>
    item.status === "success" ? item.data : ""
  );

  return <PostInfo author={authorData} date={dateData} time={timeData} />;
};
