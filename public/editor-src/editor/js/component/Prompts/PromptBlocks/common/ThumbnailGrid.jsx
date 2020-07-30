import React, { Component } from "react";
import Thumbnail from "./Thumbnail";

export default class ThumbnailGrid extends Component {
  static defaultProps = {
    columns: 4,
    showSync: false,
    responsive: [
      {
        breakpoint: 1460,
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

  componentDidMount() {
    this.handleResize();

    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    const windowW = window.innerWidth;
    const { responsive: _responsive, columns } = this.props;

    if (_responsive && _responsive.length) {
      const responsive = _responsive.reduce((acc, item) => {
        return item.breakpoint > windowW &&
          (acc.breakpoint === undefined || acc.breakpoint > item.breakpoint)
          ? item
          : acc;
      }, {});

      this.setState({
        currentColumns:
          (responsive.settings && responsive.settings.columns) || columns
      });
    }
  };

  render() {
    const {
      data,
      showSync,
      onThumbnailAdd,
      onThumbnailRemove,
      onThumbnailSync,
      ThumbnailComponent
    } = this.props;
    const { currentColumns } = this.state;
    let arr = [];

    for (let idx = 0; idx < currentColumns; idx++) {
      arr.push([]);
    }

    const columns = data
      .reduce((acc, thumbnailData, index) => {
        const element = (
          <ThumbnailComponent
            key={thumbnailData.uid || index}
            animation={true}
            showSync={showSync}
            data={thumbnailData}
            onAdd={onThumbnailAdd}
            onRemove={onThumbnailRemove}
            onSync={onThumbnailSync}
          />
        );
        const columnIndex = index % currentColumns;

        acc[columnIndex].push(element);

        return acc;
      }, arr)
      .map((column, index) => (
        <div
          key={index}
          className="brz-ed-popup-two-blocks__grid__column"
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
