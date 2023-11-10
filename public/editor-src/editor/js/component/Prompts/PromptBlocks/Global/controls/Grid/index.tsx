import React, { ReactElement } from "react";
import Scrollbars from "react-custom-scrollbars";
import ThumbnailGrid from "../../../common/ThumbnailGrid";
import { Thumbnail } from "../../types";

export interface Props<T extends Thumbnail> {
  data: Array<T>;
  tags?: Array<string>;
  showTitle?: boolean;
  onAdd: (t: T) => void;
  onRemove?: (t: T) => void;
  onUpdate?: (t: T) => void;
}

export const Grid = <T extends Thumbnail>(props: Props<T>): ReactElement => {
  const { data, tags, showTitle, onAdd, onRemove, onUpdate } = props;
  return (
    <div className="brz-ed-popup-two-body__content">
      <Scrollbars>
        <ThumbnailGrid<T>
          showTitle={showTitle}
          data={data}
          tags={tags}
          onThumbnailAdd={onAdd}
          onThumbnailRemove={onRemove}
          onUpdate={onUpdate}
        />
      </Scrollbars>
    </div>
  );
};
