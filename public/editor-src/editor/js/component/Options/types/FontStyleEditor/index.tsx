import classnames from "classnames";
import React, { Component, RefObject } from "react";
import Scrollbars from "react-custom-scrollbars";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar } from "visual/component/Scrollbar";
import { t } from "visual/utils/i18n";
import { printf } from "visual/utils/string";
import { uuid } from "visual/utils/uuid";
import { FontStyleItems } from "./FontStyle";
import {
  FontStyleEditorData,
  FontStyleEditorProps,
  FontStyleEditorState,
  FontStyleProps
} from "./types";

const animateClassName = "brz-ed-option__font-style-editor--animate";

export default class FontStyleEditor extends Component<
  FontStyleEditorProps,
  FontStyleEditorState
> {
  static defaultProps = {
    value: {
      fontStyles: [],
      extraFontStyles: []
    }
  };

  state: FontStyleEditorState = {
    brzNewItem: false,
    numItems:
      this.props.value.fontStyles.length +
      this.props.value.extraFontStyles.length,
    animationCounter: 0
  };

  scrollRef: RefObject<Scrollbars> = React.createRef();

  handleChange = (id: string, newValue: Partial<FontStyleProps>) => {
    const { value: _value, onChange } = this.props;
    const fonts = [..._value.extraFontStyles, ..._value.fontStyles];

    const updatedFonts = fonts.map((el) =>
      id === el.id ? { ...el, ...newValue } : el
    );

    onChange(updatedFonts);

    this.setState({ brzNewItem: false });
  };

  handleAnimationEnd = (event: AnimationEvent) => {
    const { numItems, animationCounter } = this.state;
    const targetEvent = event.target as HTMLElement;

    targetEvent.classList.remove(animateClassName);
    targetEvent.removeEventListener("animationend", this.handleAnimationEnd);

    if (animationCounter < numItems - 1) {
      this.setState((prevState) => ({
        animationCounter: prevState.animationCounter + 1
      }));
    }
  };

  handleAddNew = () => {
    const { value, onChange } = this.props;

    const lastFont = value.fontStyles.find((v) => v.id === "paragraph");
    const valuesLength = value.extraFontStyles.length + value.fontStyles.length;

    const newFont: FontStyleEditorData = {
      ...(lastFont ?? value.fontStyles[0]),
      deletable: "on",
      id: uuid(),
      title: printf(t("New Style #%s"), valuesLength.toString())
    };

    const newValue = [...value.fontStyles, ...value.extraFontStyles, newFont];

    onChange(newValue);

    this.setState((prevState) => ({
      brzNewItem: true,
      numItems: prevState.numItems + 1,
      animationCounter: prevState.animationCounter + 1
    }));

    const getAllItems = window.parent.document.querySelectorAll(
      ".brz-ed-option__font-style-editor"
    );

    getAllItems.forEach((element, index) => {
      const endAnimation = element.addEventListener(
        "animationend",
        this.handleAnimationEnd as EventListener
      );

      element.classList.remove(animateClassName);

      if (index === 0) {
        requestAnimationFrame(() => {
          element.classList.add(animateClassName);
          endAnimation;
        });
      } else {
        element.classList.add(animateClassName);
        endAnimation;
      }
    });

    if (this.scrollRef.current) {
      this.scrollRef.current.scrollToTop();
    }
  };

  render() {
    const { value: _value } = this.props;
    const { brzNewItem, numItems, animationCounter } = this.state;
    const reversedExtraFontStyles = _value.extraFontStyles.slice().reverse();
    const value = [...reversedExtraFontStyles, ..._value.fontStyles];

    const items = value
      .filter((el) => !el.deleted)
      .map((el, index) => (
        <FontStyleItems
          {...el}
          key={el.id}
          showDeleteIcon={el.deletable === "on"}
          onChange={(newValue) => this.handleChange(el.id, newValue)}
          itemIndex={index}
          numItems={numItems}
          animationCounter={animationCounter}
        />
      ));

    const className = classnames("brz-ed-option__font-styles", {
      "brz-ed-option__font-styles--new-item": brzNewItem
    });

    return (
      <div className={className}>
        <Scrollbar theme="dark" ref={this.scrollRef}>
          {items}
        </Scrollbar>
        <div
          className="brz-ed-option__font-styles--add"
          onClick={this.handleAddNew}
        >
          <EditorIcon icon="nc-add" />
          <span className="brz-span">{t("Add New")}</span>
        </div>
      </div>
    );
  }
}
