import React, { ReactElement } from "react";
import { Scrollbar } from "visual/component/Scrollbar";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import ThumbnailGrid from "../../../common/ThumbnailGrid";
import { Thumbnail } from "../../types";

export interface Props<T extends Thumbnail> {
  data: Array<T>;
  tags?: Array<string>;
  showTitle?: boolean;
  onAdd: (t: T) => void;
  onRemove?: (t: T) => void;
  onUpdate?: (t: T) => void;
  isPro: boolean;
  isStory: boolean;
  upgradeToPro?: string;
  config: ConfigCommon;
}

const widthStyle = {
  width: "100%"
};

const storyGrid = {
  columns: 5,
  responsive: [
    {
      breakpoint: 1460,
      settings: {
        columns: 4
      }
    },
    {
      breakpoint: 1200,
      settings: {
        columns: 3
      }
    }
  ]
};

export const Grid = <T extends Thumbnail>(props: Props<T>): ReactElement => {
  const {
    data,
    tags,
    showTitle,
    isPro,
    isStory,
    upgradeToPro,
    config,
    onAdd,
    onRemove,
    onUpdate
  } = props;
  return (
    <div className="brz-ed-popup-two-body__content">
      <Scrollbar theme="light" absolute style={widthStyle}>
        <ThumbnailGrid<T>
          showTitle={showTitle}
          data={data}
          tags={tags}
          onThumbnailAdd={onAdd}
          onThumbnailRemove={onRemove}
          onUpdate={onUpdate}
          isStory={isStory}
          isPro={isPro}
          upgradeToPro={upgradeToPro}
          config={config}
          {...(isStory ? storyGrid : {})}
        />
      </Scrollbar>
    </div>
  );
};
