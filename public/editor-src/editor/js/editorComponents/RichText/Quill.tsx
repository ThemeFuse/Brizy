import { debounce, isEqual, isFunction } from "es-toolkit";
import jQuery from "jquery";
import type QuillType from "quill";
import { BoundsStatic, RangeStatic } from "quill";
import React, { ReactNode } from "react";
import { connect } from "react-redux";
import { ElementModel } from "visual/component/Elements/Types";
import { Translate } from "visual/component/Translate";
import {
  ConfigDCItem,
  DCGroupCloud,
  DCGroups
} from "visual/global/Config/types/DynamicContent";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { EditorMode, isStory } from "visual/providers/EditorModeProvider";
import { RenderType, isEditor, isView } from "visual/providers/RenderProvider";
import { Sheet } from "visual/providers/StyleProvider/Sheet";
import {
  defaultFontSelector,
  unDeletedFontsSelector
} from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { ReduxState } from "visual/redux/types";
import { css1 } from "visual/utils/cssStyle";
import { makePlaceholder } from "visual/utils/dynamicContent";
import * as Arr from "visual/utils/reader/array";
import { diff } from "visual/utils/reader/object";
import { encodeToString, parseFromString } from "visual/utils/string";
import { uuid } from "visual/utils/uuid";
import { MValue } from "visual/utils/value";
import { styleHeading, styleTooltip } from "./styles";
import { PrepopulationData, QuillFormat, Value } from "./types";
import QuillUtils, { createLabel, getFormats } from "./utils";
import bindings from "./utils/bindings";
import { changeRichText } from "./utils/changeRichText";
import GetQuill, { Parchment } from "./utils/quill";
import {
  classNamesToV2,
  currentBlockValues,
  formatVToQuilValue,
  getDefaultValues
} from "./utils/transforms";

interface _Quill extends QuillType {
  selection: {
    savedRange: RangeStatic;
  };
  getFormat(range?: RangeStatic): QuillFormat;
  getFormat(index: number, length?: number): QuillFormat;
}

type JQueryCallback = (arg: JQuery) => void;
type CheerioCallback = (arg: cheerio.Cheerio) => void;

interface QuillUtils {
  mapElements: (html: string, fn: JQueryCallback | CheerioCallback) => string;
}

const instances: QuillComponent[] = [];

export const triggerCodes = ["#", "@"];

const classToDisableDnd = ["brz-ed-content-editable-focus", "brz-ed-dd-cancel"];

type DefaultFont = ReduxState["project"]["data"]["font"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuillValue = any;
export type Formats = Record<string, QuillValue>;

export type Coords = BoundsStatic & { top: number; left: number };
type Props = {
  value: string;
  defaultFont: DefaultFont;
  fonts: ReduxState["fonts"];
  store: Store;
  sheet: Readonly<Sheet>;
  renderContext: RenderType;
  editorMode: EditorMode;
  dcGroups: MValue<DCGroupCloud | DCGroups>;
  getConfig: GetConfig;
  initDelay?: number;
  componentId?: string;
  forceUpdate?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>, format: Formats) => void;
  selectedValue?: (v: string) => void;
  onTextChange?: (text: string) => void;
  isToolbarOpen?: () => boolean;
  onSelectionChange?: (
    format: Formats,
    coords: Coords,
    cursorIndex?: number,
    node?: Element | null
  ) => void;
  textId?: string;
  isStoryMode?: boolean;
  isDCHandler?: boolean;
  isListOpen?: boolean;
  setPrepopulationData?: (data: PrepopulationData) => void;
  v?: Value;
};

export class QuillComponent extends React.Component<Props> {
  isUnmounted = false;
  content = React.createRef<HTMLDivElement>();
  contentEditable = React.createRef<HTMLDivElement>();
  quill: null | QuillType = null;
  currentSelection: null | RangeStatic = null;
  quillUtils: QuillUtils;
  quillClass?: ReturnType<typeof GetQuill>;

  private lastUpdatedValue = "";
  save = debounce((text: string) => {
    this.lastUpdatedValue = text;
    if (typeof this.props.onTextChange === "function") {
      this.props.onTextChange(text);
    }
  }, 500);

  constructor(props: Props) {
    super(props);
    this.quillUtils = QuillUtils(this.props.renderContext) as QuillUtils;

    const { renderContext, getConfig } = this.props;

    if (isEditor(renderContext)) {
      this.quillClass = GetQuill(renderContext, getConfig);
    }
  }

  componentDidMount(): void {
    const { initDelay } = this.props;
    this.lastUpdatedValue = this.props.value;

    if (isEditor(this.props.renderContext) && typeof initDelay === "number") {
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
  }

  componentDidUpdate(props: Props): void {
    const { fonts } = props;
    const { value, forceUpdate, onSelectionChange, isToolbarOpen } = this.props;
    const reinitForFonts = !isEqual(fonts, this.props.fonts);
    const reinitForValue = value !== this.lastUpdatedValue || forceUpdate;
    const quill = this.quill as _Quill;

    if (
      isEditor(this.props.renderContext) &&
      (reinitForValue || reinitForFonts) &&
      quill
    ) {
      this.reinitPluginWithValue(value);

      // If toolbar is opened need synchronize the state
      if (
        reinitForValue &&
        !isStory(this.props.editorMode) &&
        typeof isToolbarOpen === "function" &&
        isToolbarOpen() &&
        typeof onSelectionChange === "function"
      ) {
        onSelectionChange(
          this.getSelectionFormat(),
          this.getCoords(quill.selection.savedRange)
        );
      }
    }
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    const { fonts, value } = nextProps;

    if (!isEqual(fonts, this.props.fonts) || value !== this.lastUpdatedValue) {
      return true;
    }

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
    const bounds = (this.quill as _Quill).getBounds(range.index, range.length);

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
      this.lastUpdatedValue = value;
      this.contentEditable.current.innerHTML = this.changeRichTextFonts(value);
    }
    this.initPlugin();

    if (options?.restoreSelectionIndex) {
      (this.quill as _Quill).setSelection(options.restoreSelectionIndex, 0);
    }
  }

  getIsListOpen = () => {
    return this.props.isListOpen;
  };

  initPlugin = (): void => {
    const { renderContext, onSelectionChange } = this.props;

    const hasSelectionHandler = typeof onSelectionChange === "function";

    if (!isEditor(renderContext) || typeof this.quillClass === "undefined") {
      return;
    }
    const quill = new this.quillClass(
      this.contentEditable.current as HTMLDivElement,
      {
        placeholder: "Enter text here...",
        modules: {
          toolbar: false,
          history: {
            maxStack: 0
          },
          keyboard: {
            bindings: isEditor(renderContext)
              ? bindings(this.getIsListOpen)
              : {}
          },
          clipboard: {
            matchVisual: false
          }
        }
      }
    ) as _Quill;

    quill.on("selection-change", (range: RangeStatic | null, oldRange) => {
      const selection = quill.selection?.savedRange;
      let domNode: Element | null = null;

      if (selection) {
        const [leaf] = quill.getLeaf(selection.index) || [];
        const parent = leaf?.parent;

        if (parent && parent.domNode instanceof Element) {
          domNode = parent.domNode;
        }
      }

      this.currentSelection = range;
      if (quill.hasFocus()) {
        // TODO: make much less hacky
        if (hasSelectionHandler && range && !isEqual(range, oldRange)) {
          const format = this.getSelectionFormat();
          this.props.onSelectionChange?.(
            format,
            this.getCoords(range),
            quill.selection.savedRange.index,
            domNode
          );
        }
      }
    });
    quill.on("text-change", () => {
      const { textId, isStoryMode } = this.props;
      const range = quill.selection.savedRange;
      const format = this.getSelectionFormat();
      if (hasSelectionHandler) {
        this.props.onSelectionChange?.(format, this.getCoords(range));
      }

      const container = this.contentEditable.current;

      if (isStoryMode && container) {
        // This case is only for the Story because the RichText is rendered twice with the same content
        // (once for the StoryItem, and once for the StoryDot) and only the StoryItem is editable so we need to sync the
        // content also for the StoryDot

        const duplicatedInstances = instances.filter((instance) => {
          return (
            instance.contentEditable.current !== container &&
            instance.props.textId === textId
          );
        });

        duplicatedInstances.forEach((instance) => {
          if (instance.contentEditable.current) {
            instance.contentEditable.current.innerHTML = container.innerHTML;
          }
          instance.lastUpdatedValue = quill.root.innerHTML;
        });
      }

      this.save(quill.root.innerHTML);

      requestAnimationFrame(() => {
        if (!quill.getSelection() && quill.hasFocus()) {
          const { index, length } = range ?? { index: 0, length: 0 };
          quill.setSelection(index, length);
        }
      });
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
    const quill = this.quill as _Quill;

    const lines = quill.getLines(index, length);
    const line = quill.getLine(index);
    const lineLength = line && line[0].domNode.textContent.length;
    if (lines.length === 1 && lineLength < length - index) {
      quill.setSelection(index, lineLength);
    }
  }

  getSelectionFormat(): Formats {
    const quill = this.quill as _Quill;

    const selection = quill.selection.savedRange;
    // it's small hack.sometimes null may be returned(if we select 2 paragraph and start write text)
    if (!selection) return getDefaultValues();

    const sValue = quill.getText(selection.index, selection.length);
    if (typeof this.props.selectedValue === "function") {
      this.props.selectedValue(sValue);
    }

    const { index, length } = selection;
    // it's small hack for triple click
    this.restoreSelection({ index, length });

    const selectedDomNode = quill.getLeaf(index + length);

    const _selectedDomNode = Arr.read(selectedDomNode)
      ? selectedDomNode[0]?.parent?.domNode
      : undefined;

    if (_selectedDomNode) {
      const quillFormat = quill.getFormat(selection);
      return getFormats(
        jQuery(_selectedDomNode),
        quillFormat,
        this.props.dcGroups
      );
    } else {
      return {};
    }
  }

  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = this.content.current;
    const format = this.getSelectionFormat();

    if (typeof this.props.onClick === "function") {
      this.props.onClick(event, format);
    }

    node && node.classList.add(...classToDisableDnd);
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (triggerCodes.includes(event.key)) {
      const { isDCHandler, setPrepopulationData } = this.props;
      const selection = (this.quill as _Quill).selection.savedRange;

      if (isDCHandler) {
        this.formatPrepopulation();
      } else {
        if (isFunction(setPrepopulationData)) {
          setPrepopulationData({ show: true, index: selection.index });
        }
      }
    }
  };

  getSelectionRange() {
    return (this.quill as _Quill).selection.savedRange;
  }

  formatPrepopulation(): void {
    (this.quill as _Quill).format("prepopulation", "visible");
  }

  deleteText(index: number, length: number): void {
    (this.quill as _Quill).deleteText(index, length);
  }

  handlePaste = (e: React.ClipboardEvent): void => {
    const pastedData = e.clipboardData.getData("Text");
    const startIndex = this.currentSelection?.index ?? 0;

    setTimeout(() => {
      if (this.contentEditable?.current?.innerHTML) {
        this.reinitPluginWithValue(this.contentEditable.current.innerHTML, {
          restoreSelectionIndex: startIndex + pastedData.length + 1
        });
      }
    }, 1);
  };

  onBlurAll = (event: MouseEvent): void => {
    instances.forEach((instance) => {
      const node = instance.content.current;

      if (node && !node.contains(event.target as Node)) {
        node.classList.remove(...classToDisableDnd);
      }
    });
  };

  changeRichTextFonts(html: string): string {
    const { store, sheet, renderContext, editorMode, getConfig } = this.props;

    if (isEditor(renderContext) && typeof this.quillUtils !== "undefined") {
      return this.quillUtils.mapElements(html, ($elem: JQuery) => {
        const isTooltip = !!$elem.attr("data-tooltip");

        if (isTooltip) {
          return;
        }

        const uniqId = uuid(5);

        const className = this.getClassName(
          $elem.attr("class")?.split(" ") ?? [],
          uniqId
        );

        $elem.attr("data-generated-css", className);
        $elem.attr("data-uniq-id", uniqId);
      });
    } else {
      return this.quillUtils.mapElements(html, ($elem: cheerio.Cheerio) => {
        const uniqId = uuid(5);
        const tooltipAttr = $elem.attr("data-tooltip");

        if (tooltipAttr) {
          const { v } = this.props;

          const value = parseFromString<ElementModel>(tooltipAttr) ?? {};

          const contexts = {
            renderContext,
            mode: editorMode,
            getConfig
          };

          const styles = styleTooltip({
            v: {
              ...v,
              ...value
            },
            vs: {},
            vd: {},
            store,
            contexts
          });

          const { className } = css1(uniqId, styles[2], sheet);

          const {
            tooltipText,
            tooltipPlacement,
            tooltipOffset,
            tooltipTriggerClick
          } = value;

          const encoded = encodeToString({
            tooltipText: tooltipText ?? v?.tooltipText,
            tooltipPlacement: tooltipPlacement ?? v?.tooltipPlacement,
            tooltipOffset: tooltipOffset ?? v?.tooltipOffset,
            tooltipTriggerClick:
              tooltipTriggerClick === "on" ? "click" : "hover"
          });

          $elem.attr("data-tooltip", encoded);
          $elem.addClass(className);

          return;
        }

        const { v, vs, vd } = classNamesToV2(
          $elem.attr("class")?.split(" ") ?? []
        );
        const contexts = {
          renderContext,
          mode: editorMode,
          getConfig
        };
        const styles = styleHeading({
          v,
          vs,
          vd,
          store,
          contexts
        });

        const { className } = css1(
          uniqId,
          // data under the index 2 - contain element's style
          styles[2],
          sheet
        );

        const extraClassNames = this.getExtraClassNames($elem);
        $elem.addClass([className, ...extraClassNames].join(" "));
      });
    }
  }

  render(): ReactNode {
    const { value, store, renderContext, getConfig } = this.props;
    let markup = this.changeRichTextFonts(value);

    if (isView(renderContext)) {
      try {
        markup = changeRichText(markup, store, getConfig());
      } catch (e) {
        let msg = "Something wen wrong with richText VIEW compilation";
        if (process.env.NODE_ENV === "development") {
          msg += `: ${e}`;
        }
        console.log(msg);
      }

      return (
        <Translate
          dangerouslySetInnerHTML={{
            __html: markup
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
            __html: markup
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

  getClassName(classList: string[], uniqId: string): string {
    const { v, vs, vd } = classNamesToV2(classList);
    const { store, sheet, renderContext, editorMode, getConfig } = this.props;

    const styles = styleHeading({
      v,
      vs,
      vd,
      store,
      contexts: {
        renderContext,
        mode: editorMode,
        getConfig
      }
    });

    const { className } = css1(
      // uniqId - there can be multiple paragraphs into one richTextShortcode
      // so we need different classnames for them
      uniqId,
      // data under the index 2 - contain element's style
      styles[2],
      sheet,
      (styles, className) => {
        return styles.replace(/&&/gm, `[data-generated-css=${className}]`);
      }
    );

    return className;
  }

  setGeneratedCss(): void {
    const lines = (this.quill as _Quill).getLines();
    const existingIds: string[] = [];

    lines.forEach((line) => {
      const domNode: Element = line.domNode;

      let uniqId = domNode.getAttribute("data-uniq-id") as string;

      // it's needed for cases when new paragraph was created and we should set to him new id
      if (existingIds.includes(uniqId)) {
        uniqId = uuid(5);
        domNode.setAttribute("data-uniq-id", uniqId);
      }

      const className = this.getClassName(
        Array.from(domNode.classList),
        uniqId
      );

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
    const dcOptionRichText = this.props.dcGroups?.richText;
    const { label: _label, display, placeholder } = data;

    let label = createLabel(_label);

    if (!Array.isArray(dcOptionRichText) && dcOptionRichText?.handler) {
      label = _label;
    }

    const quill = this.quill as _Quill;
    const selection = quill.selection.savedRange;
    const [leafBlot, offset] = quill.getLeaf(selection.index);
    const lineBlot = quill.getLine(selection.index)[0];
    const formats = quill.getFormat();
    let { index, length } = selection;

    if (formats.prepopulation || formats.population) {
      index = selection.index - offset;
      length = leafBlot.length();
    }

    quill.deleteText(index, length);

    const population = makePlaceholder({ content: placeholder });
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
      } else if (lineBlot.offset() + paragraphLength.length === index) {
        // dynamicContent is in the end of paragraph
        quill.insertText(index, "\n");
        index += 1;
        quill.insertText(index, label, newFormats);
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
    const quill = this.quill as _Quill;
    const selection = quill.selection.savedRange;

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
      const lineBlot = quill.getLine(selection.index)[0];
      let offset = lineBlot.offset();

      if (lineBlot.domNode.tagName.toLowerCase() === "li") {
        offset = lineBlot.parent.offset() + lineBlot.offset();
      }

      quill.formatText(offset, lineBlot.length(), type, newValue);
      return;
    }

    if (Parchment.query(type, Parchment.Scope.BLOCK)) {
      quill.formatLine(selection.index, selection.length, { [type]: value });
    } else {
      quill.formatText(selection.index, selection.length, { [type]: value });
    }
  };

  formatMultiple(values: Formats): void {
    // ! take a look later
    const blockKeys = Object.values(currentBlockValues)
      .map((value) => Object.keys(value))
      .flat();

    // this is needed for extract only the one value that was changed for the textTransform,
    // because quill  can't format this patch : {bold: true, italic: true}, it will format only the last one
    const objectDifference = diff(this.getSelectionFormat(), values);
    const exceptionKeys = [
      "bold",
      "italic",
      "underline",
      "strike",
      "script",
      "capitalize",
      "typographyUppercase",
      "typographyLowercase",
      "typographyScript",
      "popups"
    ];

    // eslint-disable-next-line prefer-const
    for (let [key, value] of Object.entries(values)) {
      if (!exceptionKeys.includes(key)) {
        if (blockKeys.includes(key)) {
          value = formatVToQuilValue(value);
        }
        this.format(key, value);
      }
    }

    const textTransformValues = Object.entries(objectDifference).reduce<
      Record<string, unknown>
    >((acc, [key, value]) => {
      if (exceptionKeys.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {});

    for (const [key, value] of Object.entries(textTransformValues)) {
      this.format(key, value);
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
  defaultFont: DefaultFont;
  fonts: ReduxState["fonts"];
} => ({
  defaultFont: defaultFontSelector(state),
  fonts: unDeletedFontsSelector(state)
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(
  QuillComponent
);
