import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import jQuery from "jquery";
import Quill, { Delta, Keyboard } from "./utils/quill";
import { getFormats } from "./utils";
import { getStore } from "visual/redux/store";

const DEFAULT = {
  bold: false,
  color: "#000",
  colorPalette: null,
  font: null,
  fontStyle: null,
  height: 1.6,
  horizontalAlign: "left",
  intermediateHeight: null,
  intermediateSize: null,
  italic: false,
  letterSpacing: null,
  linkAnchor: "",
  linkExternal: "",
  linkExternalBlank: "on",
  linkExternalRel: "off",
  linkType: "anchor",
  list: null,
  marginBottom: "0",
  marginTop: "0",
  mobileHeight: null,
  mobileSize: null,
  size: 16,
  tagName: null,
  weight: ""
};

let instances = [];

export default class QuillComponent extends React.Component {
  componentDidMount() {
    this.initPlugin();
  }

  componentWillReceiveProps({ forceUpdate, value }) {
    if (!this.quill.hasFocus() && forceUpdate && this.props.value !== value) {
      this.destroyPlugin();
      this.contentEditable.innerHTML = value;
      this.initPlugin();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.destroyPlugin();
  }

  handleContentEditableRef = el => {
    this.contentEditable = el;
  };

  initPlugin = () => {
    const handleEnter = function({ index, length }, context) {
      if (length === 0) {
        const [{ domNode: elem }, offset] = this.quill.getLine(index);
        const currentTextLength = elem.textContent.length;

        let delta;
        let selectionOffset;
        // enter was triggered in the end of line
        if (currentTextLength === offset) {
          delta = new Delta().retain(index + 1).insert(" \n", context.format);
          selectionOffset = index + 1;
          // enter was triggered in the middle of line
        } else if (offset > 0) {
          delta = new Delta().retain(index).insert("\n", context.format);
          selectionOffset = index + 1;
          // enter was triggered in the start of line
        } else {
          delta = new Delta().retain(index).insert(" \n", context.format);
          selectionOffset = index + 2;
        }

        this.quill.updateContents(delta);
        this.quill.setSelection(selectionOffset, 0);

        return;
      }

      return true;
    };

    const handleBackspace = function({ index, length }, context) {
      const lines = this.quill.getLines(index, length);
      const [{ domNode: elem }, offset] = this.quill.getLine(index);
      const currentTextLength = elem.textContent.length;

      if (currentTextLength === length || lines.length > 1) {
        this.quill.deleteText(index, length);
        this.quill.updateContents(
          new Delta().retain(index).insert(" ", context.format)
        );
        return;
      }
      if (currentTextLength === 1) {
        // Check for astral symbols
        let length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix)
          ? 2
          : 1;
        this.quill.deleteText(index - length, length);
        if (offset > 0) {
          this.quill.updateContents(
            new Delta().retain(index - 1).insert(" ", context.format)
          );
        }
        return;
      }

      return true;
    };

    const handleDelete = function({ index, length }, context) {
      const lines = this.quill.getLines(index, length);
      const [{ domNode: elem }, offset] = this.quill.getLine(index);
      const currentText = elem.textContent;

      if (currentText.length === length || lines.length > 1) {
        this.quill.deleteText(index, length);
        this.quill.updateContents(
          new Delta().retain(index).insert(" ", context.format)
        );

        return;
      }

      if (
        offset === 0 &&
        currentText.length === 1 &&
        currentText.replace(/ /gi, "").length === 0
      ) {
        this.quill.deleteText(index, 2);

        return;
      }

      if (offset === 0 && currentText.length === 1) {
        this.quill.deleteText(index, 1);
        this.quill.updateContents(
          new Delta().retain(index).insert(" ", context.format)
        );

        return;
      }

      return true;
    };

    this.quill = new Quill(this.contentEditable, {
      placeholder: "Enter text here...",
      modules: {
        toolbar: false,
        history: {
          maxStack: 0
        },
        keyboard: {
          bindings: {
            enter: {
              key: Keyboard.keys.ENTER,
              handler: handleEnter
            },
            "header enter": handleEnter,
            backspace: {
              key: Keyboard.keys.BACKSPACE,
              handler: handleBackspace
            },
            delete: {
              key: Keyboard.keys.DELETE,
              handler: handleDelete
            }
          }
        }
      }
    });
    this.quill.on("selection-change", (range, oldRange) => {
      if (this.quill.hasFocus()) {
        // TODO: make much less hacky
        if (!_.isEqual(range, oldRange)) {
          const format = this.getSelectionFormat();
          this.props.onSelectionChange(format);
        }
      }
    });
    this.quill.on("text-change", () => {
      const format = this.getSelectionFormat();
      this.props.onSelectionChange(format);
      const html = this.quill.root.innerHTML.replace(
        /(?=^|>)(\s+)|(\s+)(?=<|$)/g,
        "&nbsp;"
      );
      this.save(html);
    });

    this.quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      const { color, colorPalette } = this.quill.getFormat();
      const attributers =
        color || colorPalette ? { color, colorPalette } : null;
      return new Delta().insert(node.textContent, attributers);
    });

    // we add just one listener for all instances
    // because otherwise we would end up with tens of
    // listeners on the document
    // (and it's a little faster when adding just one)
    if (instances.length === 0) {
      document.addEventListener("mousedown", this.onBlurAll, false);
    }
    instances.push(this);
  }

  destroyPlugin() {
    this.quill = null;

    instances.splice(instances.indexOf(this), 1);
    if (instances.length === 0) {
      document.removeEventListener("mousedown", this.onBlurAll, false);
    }
  }

  restoreSelection(index, length) {
    const lines = this.quill.getLines(index, length);
    const line = this.quill.getLine(index);
    const lineLength = line && line[0].domNode.textContent.length;
    if (lines.length === 1 && lineLength < length - index) {
      this.quill.setSelection(index, lineLength);
    }
  }

  getSelectionFormat() {
    const { deviceMode } = getStore().getState().ui;
    const selection = this.quill.getSelection(true);
    // it's small hack.sometimes null may be returned(if we select 2 paragraph and start write text)
    if (!selection) return DEFAULT;

    const { index, length } = this.quill.getSelection(true);
    // it's small hack for triple click
    this.restoreSelection(index, length);
    const [
      {
        parent: { domNode: $selectedDomNode }
      }
    ] = this.quill.getLeaf(index + length);
    const quillFormat = this.quill.getFormat();
    const formats = getFormats(
      jQuery($selectedDomNode),
      quillFormat,
      deviceMode
    );

    return { ...DEFAULT, ...formats };
  }

  save = _.debounce(text => {
    this.props.onTextChange(text);
  }, 1000);

  handleClick = () => {
    jQuery(ReactDOM.findDOMNode(this)).addClass(
      "brz-ed-content-editable-focus brz-ed-dd-cancel"
    );
  };

  onBlurAll = event => {
    instances.forEach(instance => {
      const node = ReactDOM.findDOMNode(instance);
      const clickedOutsideTextEditor = !node.contains(event.target);

      if (clickedOutsideTextEditor) {
        node.classList.remove(
          "brz-ed-content-editable-focus",
          "brz-ed-dd-cancel"
        );
      }
    });
  };

  render() {
    const { value } = this.props;

    return (
      <div className="brz-ed-content-editable-wrap">
        <div className="brz-ed-content-editable-child" />
        <div
          ref={this.handleContentEditableRef}
          dangerouslySetInnerHTML={{ __html: value }}
          onClick={this.handleClick}
        />
      </div>
    );
  }

  // api
  format = (type, value) => {
    const selection = this.quill.getSelection(true);
    if (!selection.length) {
      const lineBlot = this.quill.getLine(selection.index)[0];
      const index = lineBlot.offset();
      const length = lineBlot.length();

      const newValue = value || false;
      this.quill.formatText(index, length, type, newValue);
      return;
    }

    this.quill.format(type, value);
  };
}
