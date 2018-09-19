import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import jQuery from "jquery";
import { getDynamicContentByPlaceholder } from "visual/utils/options";
import { getStore } from "visual/redux/store";
import Quill, { Delta, Keyboard } from "./utils/quill";
import bindings from "./utils/bindings";
import { getFormats } from "./utils";

const DEFAULT = {
  bold: false,
  color: "#000",
  colorPalette: null,
  population: null,
  font: null,
  fontStyle: null,
  height: 1.6,
  horizontalAlign: "left",
  intermediateHeight: null,
  intermediateSize: null,
  italic: false,
  letterSpacing: null,
  linkType: "anchor",
  linkAnchor: "",
  linkExternal: "",
  linkExternalBlank: "off",
  linkExternalRel: "off",
  linkType: "anchor",
  linkPopulation: "",
  linkExternalType: "external",
  linkPopup: "",
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
    if (!this.quill.hasFocus() && (forceUpdate || this.props.value !== value)) {
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

  getCoords(range) {
    const node = ReactDOM.findDOMNode(this);
    const { top, left } = node.getBoundingClientRect();
    const bounds = this.quill.getBounds(range);

    return {
      ...bounds,
      top: bounds.top + top + window.scrollY,
      left: bounds.left + left
    };
  }

  handleContentEditableRef = el => {
    this.contentEditable = el;
  };

  initPlugin = () => {
    this.quill = new Quill(this.contentEditable, {
      placeholder: "Enter text here...",
      modules: {
        toolbar: false,
        history: {
          maxStack: 0
        },
        keyboard: { bindings }
      }
    });
    this.quill.on("selection-change", (range, oldRange) => {
      if (this.quill.hasFocus()) {
        // TODO: make much less hacky
        if (!_.isEqual(range, oldRange)) {
          const format = this.getSelectionFormat();
          this.props.onSelectionChange(format, this.getCoords(range));
        }
      }
    });
    this.quill.on("text-change", () => {
      const range = this.quill.getSelection(true);
      const format = this.getSelectionFormat();
      this.props.onSelectionChange(format, this.getCoords(range));
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

    window.quill = this.quill;
    // we add just one listener for all instances
    // because otherwise we would end up with tens of
    // listeners on the document
    // (and it's a little faster when adding just one)
    if (instances.length === 0) {
      document.addEventListener("mousedown", this.onBlurAll, false);
    }
    instances.push(this);
  };

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

  handleKeyPress = event => {
    if (event.key === "#") {
      this.quill.format("prepopulation", "visible");
    }
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
          onKeyPress={this.handleKeyPress}
        />
        <div ref={el => (this.population = el)} />
      </div>
    );
  }

  setPopulation(selection, value) {
    let [leafBlot, offset] = this.quill.getLeaf(selection.index);
    let { label } = getDynamicContentByPlaceholder("richText", value);
    label = `#${label}`;
    const formats = this.quill.getFormat();
    let { index, length } = selection;
    if (formats.prepopulation || formats.population) {
      index = selection.index - offset;
      length = leafBlot.length();
    }
    const population = value.replace("{{", "").replace("}}", "");

    this.quill.deleteText(index, length);
    this.quill.insertText(index, String(label), {
      ...formats,
      population
    });
    this.quill.insertText(index + String(label).length, " ", {});

    this.quill.setSelection(index + String(label).length + 1, 0);
  }

  // api
  format = (type, value) => {
    const selection = this.quill.getSelection(true);
    const lineBlot = this.quill.getLine(selection.index)[0];

    if (type === "population") {
      this.setPopulation(selection, value);

      return;
    }

    if (!selection.length) {
      const newValue = value || false;
      this.quill.formatText(
        lineBlot.offset(),
        lineBlot.length(),
        type,
        newValue
      );
      return;
    }

    this.quill.format(type, value);
  };
}
