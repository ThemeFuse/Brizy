import classnames from "classnames";
import React, { Component, RefObject } from "react";
import Scrollbars from "react-custom-scrollbars";
import { t } from "visual/utils/i18n";
import { isOptgroup } from "visual/utils/options/Population/utils";

type Props = {
  className: string;
  minItems: number;
  maxItems: number;
  itemHeight: number;
  style: { [key: string]: string | number };
  choices: Choice[];
  onChange: (s: string) => void;
  containerRef?: RefObject<HTMLDivElement>;
};

type Choice = {
  title: string;
  value: string;
  optgroup?: Choice[];
};

interface State {
  active: string | null;
}

const renderTrack = ({ style }: Props): React.ReactElement => {
  return (
    <div
      style={{ ...style, top: 0, bottom: 0, right: "3px", width: "3px" }}
      className="track-vertical"
    />
  );
};
const renderThumbs = ({ style }: Props) => {
  return (
    <div
      style={{
        ...style,
        borderRadius: "inherit",
        backgroundColor: "rgba(129, 138, 145, 0.5)"
      }}
    />
  );
};

const UP_KEY = 38;
const DOWN_KEY = 40;
const ENTER_KEY = 13;

class ListBox extends Component<Props, State> {
  static defaultProps = {
    className: "",
    minItems: 1,
    maxItems: 5,
    itemHeight: 30,
    style: {},
    choices: []
  };

  state = {
    active: null
  };

  scrollbar: RefObject<Scrollbars> = React.createRef();

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleUpdateScrollPosition() {
    const { choices: _choices, itemHeight } = this.props;
    const choices = _choices.flatMap((choice) => choice.optgroup || choice);
    const activeIndex = choices.findIndex(
      (choice) => choice.value === this.state.active
    );
    const heightByActive = itemHeight * activeIndex;
    const scrollBar = this.scrollbar.current;

    if (scrollBar) {
      scrollBar.scrollTop(heightByActive);
    }
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const { choices: _choices, onChange } = this.props;

    if (_choices.length === 0) {
      return;
    }

    const choices = _choices.flatMap((choice) => choice.optgroup || choice);
    const active = this.state.active ?? choices[0].value;
    const currentActiveIndex = choices.findIndex(
      (choice) => choice.value === active
    );

    switch (event.which) {
      case ENTER_KEY: {
        onChange(active);
        break;
      }
      case UP_KEY: {
        const active = choices[currentActiveIndex - 1] || {};
        this.setState(
          { active: active.value ?? choices[0].value },
          this.handleUpdateScrollPosition
        );
        break;
      }
      case DOWN_KEY: {
        const active = choices[currentActiveIndex + 1] || {};
        this.setState(
          { active: active.value ?? choices[choices.length - 1].value },
          this.handleUpdateScrollPosition
        );
        break;
      }
    }
  };

  renderList(choices: Props["choices"], active: string | null) {
    return choices.map((choice, index) => {
      if (isOptgroup(choice)) {
        return (
          <div key={index} className="brz-ed-listbox__optgroup">
            <div className="brz-ed-listbox__optgroup-label">{choice.title}</div>
            {this.renderList(choice.optgroup, active)}
          </div>
        );
      }

      const { title, value } = choice;
      const className = classnames("brz-ed-listbox__item", {
        "brz-ed-listbox__item--active": active === value
      });

      return (
        <div
          key={index}
          title={title}
          className={className}
          onClick={() => this.props.onChange(value)}
        >
          {title}
        </div>
      );
    });
  }

  render() {
    const {
      className: _className,
      style,
      choices,
      itemHeight,
      minItems,
      maxItems,
      containerRef
    } = this.props;
    const className = classnames("brz-ed-listbox", _className);
    const minHeight = itemHeight * minItems;
    const maxHeight = Math.max(minHeight, itemHeight * maxItems);
    const content = choices.length ? (
      this.renderList(choices, this.state.active)
    ) : (
      <div className="brz-ed-listbox__item brz-ed-listbox__item--disable">
        {t("No matches found")}
      </div>
    );

    return (
      <div className={className} style={style} ref={containerRef}>
        <Scrollbars
          ref={this.scrollbar}
          renderTrackVertical={() => renderTrack(this.props)}
          renderThumbVertical={renderThumbs}
          autoHeight={true}
          autoHeightMin={minHeight}
          autoHeightMax={maxHeight}
        >
          {content}
        </Scrollbars>
      </div>
    );
  }
}

export default ListBox;
