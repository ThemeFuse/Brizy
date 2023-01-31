import classnames from "classnames";
import React, { Component, ComponentType, ReactElement } from "react";
import Config from "visual/global/Config";
import { ArrayType } from "visual/utils/array/types";
import { isStory } from "visual/utils/models";
import Thumbnail from "./Thumbnail";

export interface Responsive {
  breakpoint: number;
  settings: {
    columns: number;
  };
}

export interface Data {
  type?: string;
  uid?: string;
}

export interface Props<T extends Data> {
  data: T[];
  columns: number;
  showSync?: boolean;
  showDownload?: boolean;
  responsive?: Responsive[];
  ThumbnailComponent: ComponentType<ThumbnailProps<T>>;
  onThumbnailAdd: (b: T) => void;
  onThumbnailRemove?: (b: T) => void;
}

export interface ThumbnailProps<T extends Data> {
  animation: boolean;
  showSync: Props<T>["showSync"];
  showDownload: Props<T>["showDownload"];
  data: ArrayType<Props<T>["data"]>;
  onAdd: Props<T>["onThumbnailAdd"];
  onRemove: Props<T>["onThumbnailRemove"];
}

interface State {
  currentColumns: number;
}

export default class ThumbnailGrid<T extends Data> extends Component<
  Props<T>,
  State
> {
  static defaultProps = {
    columns: isStory(Config.getAll()) ? 5 : 4,
    responsive: [
      {
        breakpoint: 1460,
        settings: {
          columns: isStory(Config.getAll()) ? 4 : 3
        }
      },
      {
        breakpoint: 1200,
        settings: {
          columns: 3
        }
      }
    ],
    ThumbnailComponent: Thumbnail
  };

  state = {
    currentColumns: this.props.columns
  };

  componentDidMount(): void {
    this.handleResize();

    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = (): void => {
    const windowW = window.innerWidth;
    const { responsive: _responsive, columns } = this.props;

    if (_responsive && _responsive.length) {
      const responsive = _responsive.reduce((acc, item) => {
        return item.breakpoint > windowW &&
          (acc.breakpoint === undefined || acc.breakpoint > item.breakpoint)
          ? item
          : acc;
      }, {} as Responsive);

      this.setState({
        currentColumns:
          (responsive.settings && responsive.settings.columns) || columns
      });
    }
  };

  render(): ReactElement {
    const {
      data,
      showSync,
      showDownload,
      onThumbnailAdd,
      onThumbnailRemove,
      ThumbnailComponent
    } = this.props;
    const { currentColumns } = this.state;
    const arr: Array<Array<ReactElement>> = [];

    for (let idx = 0; idx < currentColumns; idx++) {
      arr.push([]);
    }

    const gridClassName = classnames(
      "brz-ed-popup-two-blocks__grid__column",
      isStory(Config.getAll()) &&
        "brz-ed-popup-two-blocks__grid__column-stories"
    );

    const columns = data
      .reduce((acc, thumbnailData, index) => {
        const thumbnailType = thumbnailData.type ?? "block";
        const element: ReactElement = (
          <ThumbnailComponent
            key={`${index}-${thumbnailType}`}
            animation={true}
            showSync={showSync}
            showDownload={showDownload}
            data={thumbnailData}
            onAdd={onThumbnailAdd}
            onRemove={onThumbnailRemove}
          />
        );
        const columnIndex = index % currentColumns;

        acc[columnIndex].push(element);

        return acc;
      }, arr)
      .map((column, index) => (
        <div
          key={index}
          className={gridClassName}
          style={{
            width: `${100 / currentColumns}%`,
            flexBasis: `${100 / currentColumns}%`
          }}
        >
          {column}
        </div>
      ));

    return <div className="brz-ed-popup-two-blocks__grid">{columns}</div>;
  }
}
