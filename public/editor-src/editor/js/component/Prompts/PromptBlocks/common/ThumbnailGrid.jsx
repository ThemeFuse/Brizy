import React from "react";
import Thumbnail from "./Thumbnail";

export default function ThumbnailGrid({
  data,
  onThumbnailAdd,
  onThumbnailRemove
}) {
  const columns = data
    .reduce(
      (acc, thumbnailData, index) => {
        const element = (
          <Thumbnail
            key={index}
            data={thumbnailData}
            onAdd={onThumbnailAdd}
            onRemove={onThumbnailRemove}
          />
        );
        const columnIndex = index % 3;

        acc[columnIndex].push(element);

        return acc;
      },
      [[], [], []]
    )
    .map((column, index) => (
      <div key={index} className="brz-ed-popup-blocks__grid__column">
        {column}
      </div>
    ));

  return <div className="brz-ed-popup-blocks__grid">{columns}</div>;
}
