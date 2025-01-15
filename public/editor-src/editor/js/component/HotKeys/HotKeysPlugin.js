import React from "react";
import { ReactReduxContext } from "react-redux";
import { toCode, _modifier } from "./utils";

let listeningKeys = {};
let downKeysMap = [];

class HotKeysPlugin extends React.Component {
  static defaultProps = {
    id: null,
    items: [],
    shouldKeyDownHandle: () => true,
    shouldKeyUpHandle: () => true,
    filterItems: (items) => items
  };

  static contextType = ReactReduxContext;

  componentDidMount() {
    const { items } = this.props;

    if (Object.keys(listeningKeys).length === 0) {
      document.addEventListener("keyup", this.handleKeyUp);
      document.addEventListener("keydown", this.handleKeyDown);
      window.parent.document.addEventListener("keyup", this.handleKeyUp);
      window.parent.document.addEventListener("keydown", this.handleKeyDown);

      window.addEventListener("blur", this.handleBlur);
      window.parent.addEventListener("blur", this.handleBlur);
    }

    items.forEach(({ keyNames, ...rest }) => {
      const newKeyNames = keyNames.map((keyName) =>
        keyName
          .split("+")
          .map((item) => toCode(item))
          .join("+")
      );

      newKeyNames.forEach((key, index) => {
        const newValue = { ...rest, keyName: keyNames[index] };
        if (!listeningKeys[key]) {
          listeningKeys[key] = [newValue];
        } else {
          const index = listeningKeys[key].findIndex(
            ({ id }) => id === newValue.id
          );

          if (index === -1) {
            listeningKeys[key].push(newValue);
          } else {
            listeningKeys[key][index] = newValue;
          }
        }
      });

      newKeyNames.forEach((key, index) => {
        const newValue = { ...rest, keyName: keyNames[index] };
        if (!listeningKeys[key]) {
          listeningKeys[key] = [newValue];
        } else if (!listeningKeys[key].find(({ id }) => id === newValue.id)) {
          listeningKeys[key].push(newValue);
        }
      });
    });
  }

  componentWillUnmount() {
    const { id } = this.props;

    listeningKeys = Object.entries(listeningKeys).reduce(
      (acc, [key, value]) => {
        acc[key] = value.filter((item) => item.id !== id);
        if (acc[key].length === 0) {
          delete acc[key];
        }
        return acc;
      },
      {}
    );

    if (Object.keys(listeningKeys).length === 0) {
      document.removeEventListener("keyup", this.handleKeyUp);
      document.removeEventListener("keydown", this.handleKeyDown);
      window.parent.document.removeEventListener("keyup", this.handleKeyUp);
      window.parent.document.removeEventListener("keydown", this.handleKeyDown);

      window.removeEventListener("blur", this.handleBlur);
      window.parent.removeEventListener("blur", this.handleBlur);
    }
  }

  handleBlur = () => {
    downKeysMap = [];
  };

  handleKeyUp = (e) => {
    this.handleChange(e);
    if (
      _modifier["⌘"] === e.keyCode ||
      _modifier["right_⌘"] === e.keyCode ||
      _modifier["ctrl"] === e.keyCode
    ) {
      downKeysMap = [];
    } else {
      downKeysMap = downKeysMap.filter((key) => key !== e.keyCode);
    }
  };

  handleKeyDown = (e) => {
    if (
      downKeysMap.includes(_modifier["⌘"]) ||
      downKeysMap.includes(_modifier["right_⌘"])
    ) {
      downKeysMap = downKeysMap.filter((key) =>
        Object.values(_modifier).includes(key)
      );
    }

    if (!downKeysMap.includes(e.keyCode)) {
      downKeysMap.push(e.keyCode);
      this.handleChange(e);
    }
  };

  handleChange(e) {
    const pressedKeys = downKeysMap.join("+");
    if (listeningKeys[pressedKeys]) {
      // to think how to do it less hackly
      /* eslint-disable no-unused-vars */
      // Extracting the store from redux-context to minimize performance issues
      // caused by re-rendering all components on the page
      const { store } = this.context;
      const state = store.getState();
      const filteredItems = this.props.filterItems(
        listeningKeys[pressedKeys],
        state
      );
      if (e.type === "keydown") {
        filteredItems.forEach(({ onKeyDown, onKeyUp, ...rest }) => {
          this.props.shouldKeyDownHandle(e, rest) && onKeyDown(e, rest);
        });
      }
      if (e.type === "keyup") {
        filteredItems.forEach(
          ({ onKeyDown, onKeyUp, ...rest }) =>
            this.props.shouldKeyUpHandle(e, rest) && onKeyUp(e, rest)
        );
      }
      /* eslint-enabled no-unused-vars */
    }
  }

  render() {
    return null;
  }
}

export default HotKeysPlugin;
