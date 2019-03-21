import React, { Component, Fragment } from "react";
import classnames from "classnames";
import { preloadImage } from "visual/utils/image";
import EditorIcon from "visual/component/EditorIcon";

export default class ImageLoad extends Component {
  static defaultProps = {
    className: "",
    src: "",
    style: {},
    spinnerDelay: 250
  };

  state = {
    imageFetched: false,
    showSpinner: false
  };

  mounted = false;

  componentDidMount() {
    const { src, spinnerDelay } = this.props;

    this.mounted = true;

    preloadImage(src).then(() => {
      this.setState({
        imageFetched: true,
        showSpinner: false
      });
    });

    setTimeout(() => {
      if (this.mounted && !this.state.imageFetched) {
        this.setState({
          showSpinner: true
        });
      }
    }, spinnerDelay);
  }

  render() {
    const { imageFetched, showSpinner } = this.state;
    const { className: _className, src, style } = this.props;
    const className = classnames("brz-img", _className);

    return (
      <Fragment>
        {imageFetched && <img className={className} src={src} style={style} />}
        {showSpinner && (
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        )}
      </Fragment>
    );
  }
}
