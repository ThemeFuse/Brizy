import React from "react";
import _ from "underscore";
import jQuery from "jquery";
import { getDynamicContentByPlaceholder } from "visual/utils/options";
import { getStore } from "visual/redux/store";
import Quill, { Delta } from "./utils/quill";
import bindings from "./utils/bindings";
import { getFormats } from "./utils";

const DEFAULT = {
  backgroundImage: null,
  backgroundGradient: null,
  bold: false,
  color: "#000",
  colorPalette: null,
  population: null,
  shadow: null,
  shadowColorPalette: null,
  populationColor: {
    p: {
      hex: null,
      opacity: 1,
      colorPalette: null
    },
    h1: {
      hex: null,
      opacity: 1,
      colorPalette: null
    },
    h2: {
      hex: null,
      opacity: 1,
      colorPalette: null
    },
    h3: {
      hex: null,
      opacity: 1,
      colorPalette: null
    },
    h4: {
      hex: null,
      opacity: 1,
      colorPalette: null
    },
    h5: {
      hex: null,
      opacity: 1,
      colorPalette: null
    },
    h6: {
      hex: null,
      opacity: 1,
      colorPalette: null
    }
  },
  fontFamily: null,
  fontType: "google",
  fontStyle: null,
  lineHeight: 1.6,
  horizontalAlign: "left",
  italic: false,
  letterSpacing: null,
  linkType: "external",
  linkAnchor: "",
  linkExternal: "",
  linkExternalBlank: "off",
  linkExternalRel: "off",
  linkPopulation: "",
  linkExternalType: "external",
  linkPopup: "",
  list: null,
  marginBottom: "0",
  marginTop: "0",
  mobileLineHeight: null,
  mobileFontSize: null,
  fontSize: 16,
  fontSizeSuffix: "px",
  tabletFontSizeSuffix: "px",
  mobileFontSizeSuffix: "px",
  tagName: null,
  fontWeight: ""
};

let instances = [];

const classToDisableDnd = ["brz-ed-content-editable-focus", "brz-ed-dd-cancel"];

export default class QuillComponent extends React.Component {
  isUnmounted = false;

  content = React.createRef();
  contentEditable = React.createRef();

  componentDidMount() {
    const { initDelay } = this.props;

    if (initDelay > 0) {
      setTimeout(() => {
        if (!this.isUnmounted) {
          this.initPlugin();
        }
      }, initDelay);
    } else {
      this.initPlugin();
    }
  }

  componentWillReceiveProps({ value, forceUpdate }) {
    const reInitPlugin =
      value !== this.props.value &&
      (forceUpdate || getStore().getState().historyTravelling);

    if (reInitPlugin) {
      this.destroyPlugin();
      this.contentEditable.current.innerHTML = value;
      this.initPlugin();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    this.destroyPlugin();
  }

  getCoords(range) {
    const node = this.content.current;
    const { top, left } = node.getBoundingClientRect();
    const bounds = this.quill.getBounds(range);

    return {
      ...bounds,
      top: bounds.top + top + window.scrollY,
      left: bounds.left + left
    };
  }

  initPlugin = () => {
    this.quill = new Quill(this.contentEditable.current, {
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
      this.save(this.quill.root.innerHTML);
    });

    this.quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      let ops = [];
      delta.ops.forEach(d => {
        if (typeof d.insert === "string") {
          ops.push({
            insert: d.insert.trim().length === 0 ? d.insert : d.insert.trim(),
            attributes: {
              italic: d?.attributes?.italic ?? null,
              bold: d?.attributes?.bold ?? null,
              color: d?.attributes?.color ?? null,
              colorPalette: d?.attributes?.colorPalette ?? null,
              header: d?.attributes?.header ?? null,

              newFontStyle: "paragraph",
              tabletFontStyle: "paragraph",
              mobileFontStyle: "paragraph"
            }
          });
        }
      });

      // delta can be empty. Quill throw error in this case
      if (ops.length === 0) {
        ops.push({
          insert: "\n",
          newFontStyle: "paragraph",
          tabletFontStyle: "paragraph",
          mobileFontStyle: "paragraph"
        });
      }

      return { ops };
    });

    this.quill.clipboard.addMatcher(Node.TEXT_NODE, node => {
      const { color = null, colorPalette = null } = this.quill.getFormat();
      const attributers =
        color || colorPalette ? { color, colorPalette } : null;

      return new Delta().insert(
        // eslint-disable-next-line no-control-regex
        node.data.replace(new RegExp("\n", "g"), " "),
        attributers
      );
    });

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
    const node = this.content.current;

    node && node.classList.add(...classToDisableDnd);
  };

  handleKeyPress = event => {
    if (event.key === "#") {
      this.quill.format("prepopulation", "visible");
    }
  };

  onBlurAll = event => {
    instances.forEach(instance => {
      const node = instance.content.current;

      if (node && !node.contains(event.target)) {
        node.classList.remove(...classToDisableDnd);
      }
    });
  };

  render() {
    const { value } = this.props;

    return (
      <div ref={this.content} className="brz-ed-content-editable-wrap">
        <div className="brz-ed-content-editable-child" />
        <div
          ref={this.contentEditable}
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
    const lineBlot = this.quill.getLine(selection.index)[0];
    let { label, display = "inline" } = getDynamicContentByPlaceholder(
      "richText",
      value
    );
    label = `#${label}`;
    const formats = this.quill.getFormat();
    let { index, length } = selection;
    if (formats.prepopulation || formats.population) {
      index = selection.index - offset;
      length = leafBlot.length();
    }
    const population = value.replace("{{", "").replace("}}", "");

    this.quill.deleteText(index, length);

    let newFormats = {
      ...formats,
      population,
      dcBlock: false,
      populationColor: false
    };
    if (display === "inline") {
      this.quill.insertText(index, label, newFormats);
      // hack. {dcBlock: false} in previous line doesn't work
      this.quill.format("dcBlock", false);
      this.quill.format("populationColor", false);
      this.quill.insertText(index + label.length, " ", {
        population: null
      });
      index += 1;
    } else {
      newFormats.dcBlock = true;
      const paragraphLength = lineBlot.domNode.innerText;

      if (!paragraphLength.trim().length) {
        // dynamic Content is alone in the paragraph
        this.quill.insertText(index, label, newFormats);
        this.quill.format("dcBlock", true);
      } else if (lineBlot.offset() + paragraphLength.length === index) {
        // dynamicContent is in the end of paragraph
        this.quill.insertText(index, "\n");
        index += 1;
        this.quill.insertText(index, label, newFormats);
        this.quill.format("dcBlock", true);
      } else if (lineBlot.offset() === index) {
        // dynamicContent is in the begin of paragraph
        this.quill.insertText(index, `${label}\n`, newFormats);
      } else {
        // dynamicContent is in paragraph
        this.quill.insertText(index, "\n");
        index += 1;
        this.quill.insertText(index, `${label}\n`, newFormats);
      }
    }

    this.quill.setSelection(index + label.length, 0);
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
      if (type === "link") {
        let [leafBlot] = this.quill.getLeaf(selection.index);
        this.quill.formatText(
          this.quill.getIndex(leafBlot.parent),
          leafBlot.parent.length(),
          type,
          value
        );
        return;
      }

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
