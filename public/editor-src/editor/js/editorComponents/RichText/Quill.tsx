import React, { ReactNode } from "react";
import _ from "underscore";
import jQuery from "jquery";
import { RangeStatic, BoundsStatic } from "quill";
import { connect } from "react-redux";
import { uuid } from "visual/utils/uuid";
import { currentStyleSelector } from "visual/redux/selectors";
import { unDeletedFontSelector } from "visual/redux/selectors-new";
import { css1 } from "visual/utils/cssStyle";
import Quill from "./utils/quill";
import bindings from "./utils/bindings";
import { getFormats, mapBlockElements } from "./utils";
import { ReduxState } from "visual/redux/types";
import {
  classNamesToV2,
  getDefaultValues,
  currentBlockValues,
  formatVToQuilValue
} from "./utils/transforms";
import { styleHeading } from "./styles";
import { ConfigDCItem } from "visual/global/Config/types/DynamicContent";

const instances: QuillComponent[] = [];

const classToDisableDnd = ["brz-ed-content-editable-focus", "brz-ed-dd-cancel"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuillValue = any;
type Formats = Record<string, QuillValue>;

type Coords = BoundsStatic & { top: number; left: number };
type Props = {
  value: string;
  componentId: string;
  initDelay: number;
  forceUpdate: boolean;
  currentStyle: ReduxState["currentStyle"];
  fonts: ReduxState["fonts"];

  onSelectionChange: (format: Formats, coords: Coords) => void;
  onTextChange: (text: string) => void;
};

class QuillComponent extends React.Component<Props> {
  isUnmounted = false;

  content = React.createRef<HTMLDivElement>();
  contentEditable = React.createRef<HTMLDivElement>();
  quill: null | Quill = null;
  currentSelection: null | RangeStatic = null;

  private lastUpdatedValue = "";

  componentDidMount(): void {
    const { initDelay } = this.props;
    this.lastUpdatedValue = this.props.value;

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

  componentWillReceiveProps({
    value,
    forceUpdate,
    currentStyle,
    fonts
  }: Props): void {
    let reInitPlugin = value !== this.lastUpdatedValue || forceUpdate;

    if (
      currentStyle !== this.props.currentStyle ||
      fonts !== this.props.fonts
    ) {
      reInitPlugin = true;
    }

    if (reInitPlugin) {
      this.reinitPluginWithValue(value);
    }
  }

  shouldComponentUpdate(): false {
    return false;
  }

  componentWillUnmount(): void {
    this.isUnmounted = true;
    this.destroyPlugin();
  }

  getCoords(range: RangeStatic | null): Coords {
    if (!range) {
      return {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0
      };
    }
    const node = this.content.current as HTMLDivElement;
    const { top, left } = node.getBoundingClientRect();
    const bounds = (this.quill as Quill).getBounds(range.index, range.length);

    return {
      ...bounds,
      top: bounds.top + top + window.scrollY,
      left: bounds.left + left
    };
  }

  reinitPluginWithValue(
    value: string,
    options?: { restoreSelectionIndex: number }
  ): void {
    this.destroyPlugin();
    if (this.contentEditable.current) {
      this.contentEditable.current.innerHTML = this.changeRichTextFonts(value);
    }
    this.initPlugin();

    if (options?.restoreSelectionIndex) {
      (this.quill as Quill).setSelection(options.restoreSelectionIndex, 0);
    }
  }

  initPlugin = (): void => {
    const quill = new Quill(this.contentEditable.current as HTMLDivElement, {
      placeholder: "Enter text here...",
      modules: {
        toolbar: false,
        history: {
          maxStack: 0
        },
        keyboard: { bindings },
        clipboard: {
          matchVisual: false
        }
      }
    });

    quill.on("selection-change", (range: RangeStatic | null, oldRange) => {
      this.currentSelection = range;
      if (quill.hasFocus()) {
        // TODO: make much less hacky
        if (range && !_.isEqual(range, oldRange)) {
          const format = this.getSelectionFormat();
          this.props.onSelectionChange(format, this.getCoords(range));
        }
      }
    });
    quill.on("text-change", () => {
      const range = quill.getSelection(true) as RangeStatic | null;
      const format = this.getSelectionFormat();
      // console.log("format", format);
      this.props.onSelectionChange(format, this.getCoords(range));
      this.save(quill.root.innerHTML);
    });

    this.quill = quill;
    // we add just one listener for all instances
    // because otherwise we would end up with tens of
    // listeners on the document
    // (and it's a little faster when adding just one)
    if (instances.length === 0) {
      document.addEventListener("mousedown", this.onBlurAll, false);
    }
    instances.push(this);
  };

  destroyPlugin(): void {
    this.quill = null;

    instances.splice(instances.indexOf(this), 1);
    if (instances.length === 0) {
      document.removeEventListener("mousedown", this.onBlurAll, false);
    }
  }

  restoreSelection({ index, length }: RangeStatic): void {
    const quill = this.quill as Quill;

    const lines = quill.getLines(index, length);
    const line = quill.getLine(index);
    const lineLength = line && line[0].domNode.textContent.length;
    if (lines.length === 1 && lineLength < length - index) {
      quill.setSelection(index, lineLength);
    }
  }

  getSelectionFormat(): Formats {
    const quill = this.quill as Quill;

    const selection = quill.getSelection(true);
    // it's small hack.sometimes null may be returned(if we select 2 paragraph and start write text)
    if (!selection) return getDefaultValues();

    const { index, length } = quill.getSelection(true);
    // it's small hack for triple click
    this.restoreSelection({ index, length });
    const [
      {
        parent: { domNode: $selectedDomNode }
      }
    ] = quill.getLeaf(index + length);
    const quillFormat = quill.getFormat();
    return getFormats(jQuery($selectedDomNode), quillFormat);
  }

  save = _.debounce((text: string) => {
    this.lastUpdatedValue = text;
    this.props.onTextChange(text);
  }, 1000);

  handleClick = (): void => {
    const node = this.content.current;

    node && node.classList.add(...classToDisableDnd);
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "#") {
      (this.quill as Quill).format("prepopulation", "visible");
    }
  };

  handlePaste = (e: React.ClipboardEvent): void => {
    const pastedData = e.clipboardData.getData("Text");
    const startIndex = this.currentSelection?.index ?? 0;

    setTimeout(() => {
      if (this.contentEditable?.current?.innerHTML) {
        this.reinitPluginWithValue(this.contentEditable.current.innerHTML, {
          restoreSelectionIndex: startIndex + pastedData.length + 1
        });
      }
    }, 0);
  };

  onBlurAll = (event: MouseEvent): void => {
    instances.forEach(instance => {
      const node = instance.content.current;

      if (node && !node.contains(event.target as Node)) {
        node.classList.remove(...classToDisableDnd);
      }
    });
  };

  changeRichTextFonts(html: string): string {
    if (IS_EDITOR) {
      return mapBlockElements(html, ($elem: JQuery) => {
        const uniqId = uuid(5);

        const className = this.getClassName($elem, uniqId);

        $elem.attr("data-generated-css", className);
        $elem.attr("data-uniq-id", uniqId);
      });
    } else {
      return mapBlockElements(html, ($elem: cheerio.Cheerio) => {
        const uniqId = uuid(5);

        const { v, vs, vd } = classNamesToV2($elem);
        const styles = styleHeading(v, vs, vd);

        const { className } = css1(
          uniqId,
          // data under the index 2 - contain element's style
          styles[2]
        );

        const extraClassNames = this.getExtraClassNames($elem);
        $elem.attr("class", [className, ...extraClassNames].join(" "));
      });
    }
  }

  render(): ReactNode {
    const { value } = this.props;

    const newValue = this.changeRichTextFonts(value);

    if (IS_PREVIEW) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: newValue
          }}
        />
      );
    }

    return (
      <div
        ref={this.content}
        className="brz-ed-content-editable-wrap"
        onPaste={this.handlePaste}
      >
        <div className="brz-ed-content-editable-child" />
        <div
          ref={this.contentEditable}
          dangerouslySetInnerHTML={{
            __html: newValue
          }}
          onClick={this.handleClick}
          onKeyPress={this.handleKeyPress}
        />
      </div>
    );
  }

  getExtraClassNames($elem: cheerio.Cheerio | JQuery): string[] {
    const extraClassNames = [];

    if ($elem.is("*[class*='brz-tp__dc-block']")) {
      extraClassNames.push("brz-tp__dc-block");
    }

    if ($elem.is("*[class*='brz-tp__dc-block-st1']")) {
      extraClassNames.push("brz-tp__dc-block-st1");
    }

    return extraClassNames;
  }

  getClassName($elem: JQuery | cheerio.Cheerio, uniqId: string): string {
    const { v, vs, vd } = classNamesToV2($elem);
    const styles = styleHeading(v, vs, vd);

    const { className } = css1(
      // uniqId - there can be multiple paragraphs into one richTextShortcode
      // so we need different classnames for them
      uniqId,
      // data under the index 2 - contain element's style
      styles[2],
      (styles, className) => {
        return styles.replace(/&&/gm, `[data-generated-css=${className}]`);
      }
    );

    return className;
  }

  setGeneratedCss(): void {
    const lines = (this.quill as Quill).getLines();
    const existingIds: string[] = [];

    lines.forEach(line => {
      const domNode = line.domNode;

      let uniqId = domNode.getAttribute("data-uniq-id");

      // it's needed for cases when new paragraph was created and we should set to him new id
      if (existingIds.includes(uniqId)) {
        uniqId = uuid(5);
        domNode.setAttribute("data-uniq-id", uniqId);
      }

      const className = this.getClassName(jQuery(domNode), uniqId);

      // temp to find out a better way to implement this
      // const { attributes = {} } = line.attributes || {};
      // if (
      //   attributes["intermediateTabletFontSize"] ||
      //   attributes["intermediateMobileFontSize"]
      // ) {
      //   this.applyLegacyKeys(line);
      // }
      line.format("generated-css", className);
      existingIds.push(uniqId);
    });
  }

  // api
  formatPopulation = (data: {
    label: ConfigDCItem["label"];
    display: ConfigDCItem["display"];
    placeholder: ConfigDCItem["placeholder"];
  }): void => {
    const { label: _label, display, placeholder } = data;
    const label = `#${_label}`;
    const population = placeholder.replace("{{", "").replace("}}", "");
    const quill = this.quill as Quill;
    const selection = quill.getSelection(true);
    const [leafBlot, offset] = quill.getLeaf(selection.index);
    const lineBlot = quill.getLine(selection.index)[0];
    const formats = quill.getFormat();
    let { index, length } = selection;

    if (formats.prepopulation || formats.population) {
      index = selection.index - offset;
      length = leafBlot.length();
    }

    quill.deleteText(index, length);

    const newFormats = {
      ...formats,
      population,
      dcBlock: false,
      populationColor: false
    };
    if (display === "inline") {
      quill.insertText(index, label, newFormats);
      // hack. {dcBlock: false} in previous line doesn't work
      quill.format("dcBlock", false);
      quill.format("populationColor", false);
    } else {
      newFormats.dcBlock = true;
      const paragraphLength = lineBlot.domNode.innerText;

      if (!paragraphLength.trim().length) {
        // dynamic Content is alone in the paragraph
        quill.insertText(index, label, newFormats);
        quill.format("dcBlock", true);
      } else if (lineBlot.offset() + paragraphLength.length === index) {
        // dynamicContent is in the end of paragraph
        quill.insertText(index, "\n");
        index += 1;
        quill.insertText(index, label, newFormats);
        quill.format("dcBlock", true);
      } else if (lineBlot.offset() === index) {
        // dynamicContent is in the begin of paragraph
        quill.insertText(index, `${label}\n`, newFormats);
      } else {
        // dynamicContent is in paragraph
        quill.insertText(index, "\n");
        index += 1;
        quill.insertText(index, `${label}\n`, newFormats);
      }
    }

    quill.insertText(index + label.length, " ", {
      population: null
    });

    quill.setSelection(index + label.length + 1, 0);
  };

  format = (type: string, value: QuillValue): void => {
    const quill = this.quill as Quill;
    const selection = quill.getSelection(true);
    const lineBlot = quill.getLine(selection.index)[0];

    if (!selection.length) {
      if (type === "link") {
        const [leafBlot] = quill.getLeaf(selection.index);
        quill.formatText(
          quill.getIndex(leafBlot.parent),
          leafBlot.parent.length(),
          type,
          value
        );
        return;
      }

      const newValue = value || false;

      let offset = lineBlot.offset();

      if (lineBlot.domNode.tagName.toLowerCase() === "li") {
        offset = lineBlot.parent.offset() + lineBlot.offset();
      }

      quill.formatText(offset, lineBlot.length(), type, newValue);
      return;
    }

    quill.format(type, value);
  };

  formatMultiple(values: Formats): void {
    // ! take a look later
    const blockKeys = Object.values(currentBlockValues)
      .map(value => Object.keys(value))
      .flat();

    // eslint-disable-next-line prefer-const
    for (let [key, value] of Object.entries(values)) {
      if (key !== "popups") {
        if (blockKeys.includes(key)) {
          value = formatVToQuilValue(value);
        }
        this.format(key, value);
      }
    }

    this.setGeneratedCss();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // applyLegacyKeys(line: any): void {
  //   const legacyKeys = [
  //     "fontStyle",
  //     "intermediateTabletFontSize",
  //     "intermediateMobileFontSize",
  //     "intermediateTabletFontSizeSuffix",
  //     "intermediateMobileFontSizeSuffix",
  //     "intermediateTabletLineHeight",
  //     "intermediateMobileLineHeight",
  //     "intermediateTabletWeight",
  //     "intermediateMobileWeight",
  //     "intermediateTabletLetterSpacing",
  //     "intermediateMobileLetterSpacing"
  //   ];

  //   legacyKeys.forEach(key => {
  //     line.format(key, null);
  //   });
  // }
}

const mapStateToProps = (
  state: ReduxState
): {
  currentStyle: ReduxState["currentStyle"];
  fonts: ReduxState["fonts"];
} => ({
  currentStyle: currentStyleSelector(state),
  fonts: unDeletedFontSelector(state)
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(
  QuillComponent
);
