import { Str } from "@brizy/readers";
import type { Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";
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
  fontsSignatureSelector,
  globalBlocksPopupIdsSelector
} from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { ReduxState } from "visual/redux/types";
import { css1 } from "visual/utils/cssStyle";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeAttr } from "visual/utils/i18n/attribute";
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
type CheerioCallback = (arg: Cheerio<AnyNode>) => void;

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
  fontsSignature: string;
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
  onSelectionChange?: (data: {
    formats: Formats;
    selectionCoords: Coords;
    cursorIndex?: number;
    node?: Element | null;
  }) => void;
  textId?: string;
  isStoryMode?: boolean;
  isDCHandler?: boolean;
  isListOpen?: boolean;
  setPrepopulationData?: (data: PrepopulationData) => void;
  onTextChangeStart?: VoidFunction;
  v?: Value;
  globalBlocksPopupIds: string[];
};

type Timer = ReturnType<typeof setTimeout>;

type SelectionChangeHandler = (
  range: RangeStatic | null,
  oldRange: RangeStatic | null
) => void;

type TextChangeHandler = (delta: {
  ops: ReadonlyArray<{ insert?: unknown; delete?: number }>;
}) => void;

export class QuillComponent extends React.Component<Props> {
  isUnmounted = false;
  content = React.createRef<HTMLDivElement>();
  contentEditable = React.createRef<HTMLDivElement>();
  quill: null | QuillType = null;
  currentSelection: null | RangeStatic = null;
  quillUtils: QuillUtils;
  quillClass?: ReturnType<typeof GetQuill>;

  private lastUpdatedValue = "";

  // Pending timer ids. Tracked so unmount can clear them — otherwise the
  // browser keeps the callback alive, which closes over `this` and roots the
  // whole prop graph (store/sheet/v/dcGroups) until the timer fires.
  private initDelayTimerId: Timer | null = null;
  private pasteTimerIds = new Set<Timer>();

  // Quill event listener refs + rAF ids. Stored so destroyPlugin can detach
  // them by reference. Without explicit off()/cancelAnimationFrame, the
  // listener and rAF callbacks close over `this` and keep the orphaned
  // QuillComponent alive even after the Quill instance is nulled.
  private selectionChangeHandler: SelectionChangeHandler | null = null;
  private textChangeHandler: TextChangeHandler | null = null;
  private pendingRafIds = new Set<number>();

  // Refcounted owners returned by css1() for each rich-text line / tooltip /
  // heading that this Quill instance produced. Keyed by uniqId (the per-line
  // data-uniq-id). Each css1() call is one live owner of a shared <style>
  // node — without this Map the owners' clean() callbacks would be lost and
  // the shared refcount would leak indefinitely.
  private cssCleanups = new Map<string, VoidFunction>();

  // Pair every css1() increment with a matching decrement.
  // Same uniqId calls happen on every render (changeRichTextFonts, getClassName,
  // setGeneratedCss). If we did not fire the prior clean here, render N+1
  // would leak render N's increment and the shared <style> node would never
  // drop to refcount 0 even after the component unmounts.
  // Also handles content edits on the same line: prior clean targets the OLD
  // hash (decrementing it, freeing old node if last owner), then new css1
  // call increments the NEW hash.
  private trackCss = (uniqId: string, clean: VoidFunction): void => {
    this.cssCleanups.get(uniqId)?.();
    this.cssCleanups.set(uniqId, clean);
  };

  save = debounce(() => {
    if (typeof this.props.onTextChange === "function") {
      this.props.onTextChange(this.lastUpdatedValue);
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
        this.initDelayTimerId = setTimeout(() => {
          this.initDelayTimerId = null;
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
    const { fontsSignature, globalBlocksPopupIds: prevPopupIds } = props;
    const {
      value,
      forceUpdate,
      onSelectionChange,
      isToolbarOpen,
      globalBlocksPopupIds: nextPopupIds
    } = this.props;
    const reinitForFonts = fontsSignature !== this.props.fontsSignature;
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
        const selectionNode = this.getDomNodeBySelection(quill);
        const parentNode = this.content.current?.closest(".brz-rich-text");

        const node = document.contains(selectionNode)
          ? selectionNode
          : parentNode;

        onSelectionChange({
          formats: this.getSelectionFormat(),
          selectionCoords: this.getCoords(quill.selection.savedRange),
          node
        });
      }
    }

    if (
      prevPopupIds !== nextPopupIds &&
      prevPopupIds.length > nextPopupIds.length
    ) {
      this.reinitPluginWithValue(this.props.value);

      const containerNode = this.content.current;

      if (containerNode) {
        const allPopupLinksNodes =
          containerNode.querySelectorAll<HTMLAnchorElement>("a.link--popup");
        const prevSet = new Set(prevPopupIds);
        const nextSet = new Set(nextPopupIds);

        allPopupLinksNodes.forEach((linkNode) => {
          const { href } = linkNode.dataset;

          if (href) {
            const linkData = parseFromString<Record<string, unknown>>(href);

            if (linkData) {
              const _popupId = Str.read(linkData.popup);

              if (_popupId) {
                const popupId = _popupId.replace("#", "");

                const existsInPrev = prevSet.has(popupId);
                const existsInNext = nextSet.has(popupId);

                if (!existsInPrev && !existsInNext) {
                  return;
                }

                if (existsInPrev) {
                  linkNode.classList.remove("link--popup");
                }
              }
            }
          }
        });
      }
    }
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    const {
      fontsSignature,
      value,
      globalBlocksPopupIds: nextPopupIds
    } = nextProps;
    const { globalBlocksPopupIds: prevPopupIds } = this.props;

    const hasFocus = this.quill && this.quill.hasFocus();
    const isListOpen = this.props.isListOpen === true;

    const reinitForValue = value !== this.lastUpdatedValue;

    const shouldReinitValue = reinitForValue && !hasFocus && !isListOpen;
    if (fontsSignature !== this.props.fontsSignature || shouldReinitValue) {
      return true;
    }

    if (
      prevPopupIds !== nextPopupIds &&
      prevPopupIds.length > nextPopupIds.length
    ) {
      return true;
    }

    return false;
  }

  componentWillUnmount(): void {
    this.isUnmounted = true;

    // Cancel pending debounced save: the lodash/es-toolkit debounce wrapper
    // schedules a timer that closes over `this` and would retain the whole
    // prop graph until the 500ms expires.
    this.save.cancel();

    if (this.initDelayTimerId !== null) {
      clearTimeout(this.initDelayTimerId);
      this.initDelayTimerId = null;
    }

    this.pasteTimerIds.forEach((id) => clearTimeout(id));
    this.pasteTimerIds.clear();

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

    const onSelectionChangeListener: SelectionChangeHandler = (
      range,
      oldRange
    ) => {
      const domNode = this.getDomNodeBySelection(quill);

      this.currentSelection = range;
      if (quill.hasFocus()) {
        // TODO: make much less hacky
        if (hasSelectionHandler && range && !isEqual(range, oldRange)) {
          const format = this.getSelectionFormat();
          this.props.onSelectionChange?.({
            formats: format,
            selectionCoords: this.getCoords(range),
            cursorIndex: quill.selection.savedRange.index,
            node: domNode
          });
        }
      }
    };

    const onTextChangeListener: TextChangeHandler = (delta) => {
      const { onTextChangeStart, onSelectionChange } = this.props;
      const wasTextChanged = delta.ops.some(
        (op) => typeof op.insert === "string" || typeof op.delete === "number"
      );

      if (wasTextChanged) {
        onTextChangeStart?.();
      }

      const domNode = this.getDomNodeBySelection(quill);
      const { textId, isStoryMode } = this.props;
      const range = quill.selection.savedRange;
      const format = this.getSelectionFormat();

      if (hasSelectionHandler) {
        onSelectionChange?.({
          formats: format,
          selectionCoords: this.getCoords(range),
          node: domNode
        });
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

      this.lastUpdatedValue = quill.root.innerHTML;
      this.save();

      const rafId = requestAnimationFrame(() => {
        this.pendingRafIds.delete(rafId);

        if (this.isUnmounted || this.quill !== quill) {
          return;
        }

        if (!quill.getSelection() && quill.hasFocus()) {
          const { index, length } = range ?? { index: 0, length: 0 };
          quill.setSelection(index, length);
        }
      });
      this.pendingRafIds.add(rafId);
    };

    quill.on("selection-change", onSelectionChangeListener);
    quill.on("text-change", onTextChangeListener);

    this.selectionChangeHandler = onSelectionChangeListener;
    this.textChangeHandler = onTextChangeListener;

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

  getDomNodeBySelection(quill: _Quill): Element | null {
    const selection = quill.selection?.savedRange;
    let domNode: Element | null = null;

    if (selection) {
      const [leaf] = quill.getLeaf(selection.index) || [];
      const parent = leaf?.parent;

      if (parent && parent.domNode instanceof Element) {
        domNode = parent.domNode;
      }
    }

    return domNode;
  }

  /**
   * Returns the last updated value from the Quill editor.
   * Note: This may include changes that haven't been propagated to the parent
   * component yet due to the 500ms debounce on text changes.
   * @returns The current HTML content of the Quill editor
   */
  getCurrentValue(): string {
    return this.lastUpdatedValue;
  }

  destroyPlugin(): void {
    // Detach Quill listeners by reference before dropping the instance.
    // quill.off() removes the specific handler; without it the listener
    // closures keep the orphan Quill (and `this` via closure) alive even
    // after `this.quill = null` clears our own reference.
    const quill = this.quill;

    if (quill) {
      if (this.selectionChangeHandler) {
        quill.off("selection-change", this.selectionChangeHandler);
      }
      if (this.textChangeHandler) {
        quill.off("text-change", this.textChangeHandler);
      }
    }

    this.selectionChangeHandler = null;
    this.textChangeHandler = null;

    // Cancel any rAF callbacks scheduled by the text-change handler. Each
    // rAF closure captures the old quill + range; leaving them queued
    // retains the prior instance until the next frame fires.
    this.pendingRafIds.forEach((id) => cancelAnimationFrame(id));
    this.pendingRafIds.clear();

    this.quill = null;

    // Drain every css1 owner this instance registered. Called on both
    // unmount and reinit (e.g. after paste handler swaps quill content),
    // so refcount drops correctly each lifecycle boundary instead of
    // accumulating across reinits.
    this.cssCleanups.forEach((clean) => clean());
    this.cssCleanups.clear();

    // Only splice when this instance was actually registered. initPlugin
    // pushes; view mode + missing initDelay skip init entirely, so a blind
    // `splice(indexOf(this), 1)` would pass -1 and pop the LAST (live)
    // entry instead, orphaning a real instance from the array and
    // potentially detaching the shared mousedown listener prematurely.
    const idx = instances.indexOf(this);
    if (idx !== -1) {
      instances.splice(idx, 1);
      if (instances.length === 0) {
        document.removeEventListener("mousedown", this.onBlurAll, false);
      }
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

    const id = setTimeout(() => {
      this.pasteTimerIds.delete(id);

      if (this.isUnmounted) {
        return;
      }

      if (this.quill?.root.innerHTML) {
        this.reinitPluginWithValue(this.quill?.root.innerHTML, {
          restoreSelectionIndex: startIndex + pastedData.length + 1
        });
      }
    }, 1);

    this.pasteTimerIds.add(id);
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
        const isTooltip =
          !!$elem.attr(makeAttr("tooltip")) || !!$elem.attr("data-tooltip");

        if (isTooltip) {
          return;
        }

        // Reuse existing data-uniq-id when present so the same line keeps a
        // stable trackCss key across re-renders. Without reuse, every render
        // would mint a fresh uuid and trackCss would never match the prior
        // owner — refcount on the shared <style> node would leak +1 per render.
        const existingId = $elem.attr("data-uniq-id");
        const uniqId =
          existingId && existingId.length > 0 ? existingId : uuid(5);

        // getClassName() runs css1() and registers a clean callback via
        // trackCss(uniqId, ...) — see Quill.getClassName below.
        const className = this.getClassName(
          $elem.attr("class")?.split(" ") ?? [],
          uniqId
        );

        $elem.attr("data-generated-css", className);

        if (!existingId) {
          $elem.attr("data-uniq-id", uniqId);
        }
      });
    } else {
      return this.quillUtils.mapElements(html, ($elem: Cheerio<AnyNode>) => {
        const uniqId = uuid(5);
        const tooltipAttr =
          $elem.attr(makeAttr("tooltip")) || $elem.attr("data-tooltip");

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

          // Tooltip variant: register one css1 owner per tooltip. Identical
          // tooltip styling across instances → same content hash → shared
          // <style> node. trackCss pairs the increment from css1 with a
          // matching decrement on re-render / unmount.
          const { className, clean } = css1(uniqId, styles[2], sheet);
          this.trackCss(uniqId, clean);

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

          $elem.removeAttr("data-tooltip");
          $elem.attr(makeAttr("tooltip"), encoded);
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

        // View-branch heading line: register one css1 owner per heading.
        // styles[2] is the element-level style (default + rules at indexes
        // 0/1 are baked elsewhere). Caveat: cheerio path mints a fresh uuid
        // per render — refcount stays correct because trackCss won't match
        // any prior key, so each render is a brand-new owner whose clean()
        // fires on next destroyPlugin / unmount.
        const { className, clean } = css1(
          uniqId,
          // data under the index 2 - contain element's style
          styles[2],
          sheet
        );
        this.trackCss(uniqId, clean);

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
        let msg = "Something went wrong with richText VIEW compilation";
        if (process.env.NODE_ENV === "development") {
          msg += `: ${e}`;
        }
        // eslint-disable-next-line no-console
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

  getExtraClassNames($elem: Cheerio<AnyNode> | JQuery): string[] {
    const extraClassNames = [];

    // @ts-expect-error: The this context of type Cheerio<AnyNode> | JQuery<HTMLElement>
    // is not assignable to method’s this of type Cheerio<AnyNode>
    if ($elem.is("*[class*='brz-tp__dc-block']")) {
      extraClassNames.push("brz-tp__dc-block");
    }

    // @ts-expect-error: The this context of type Cheerio<AnyNode> | JQuery<HTMLElement>
    // is not assignable to method’s this of type Cheerio<AnyNode>
    if ($elem.is("*[class*='brz-tp__dc-block-st1']")) {
      extraClassNames.push("brz-tp__dc-block-st1");
    }

    return extraClassNames;
  }

  // Editor-branch entry point. Called per heading line by changeRichTextFonts
  // and again by setGeneratedCss for the live Quill DOM. Returns the
  // content-hashed className that gets written to data-generated-css.
  // Each invocation registers a css1 owner via trackCss — re-renders for the
  // same uniqId retire the prior owner and increment the (possibly new) hash.
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

    const { className, clean } = css1(
      // uniqId - there can be multiple paragraphs into one richTextShortcode
      // so we need different classnames for them
      uniqId,
      // data under the index 2 - contain element's style
      styles[2],
      sheet,
      // Custom placeholder replacer: target lines via data-generated-css
      // attribute selector instead of class. The selector value embeds the
      // content-hashed className so two cloned RichTexts with identical
      // styling write the same data-generated-css and match the same single
      // <style> rule.
      (styles, className) => {
        return styles.replace(/&&/gm, `[data-generated-css=${className}]`);
      }
    );
    this.trackCss(uniqId, clean);

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
  fontsSignature: string;
  globalBlocksPopupIds: string[];
} => ({
  defaultFont: defaultFontSelector(state),
  fontsSignature: fontsSignatureSelector(state),
  globalBlocksPopupIds: globalBlocksPopupIdsSelector(state)
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(
  QuillComponent
);
