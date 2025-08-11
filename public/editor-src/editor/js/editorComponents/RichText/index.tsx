import classNames from "classnames";
import { isNumber } from "es-toolkit/compat";
import React, { Fragment, RefObject, createRef } from "react";
import ReactDOM from "react-dom";
import { omit } from "timm";
import BoxResizer from "visual/component/BoxResizer";
import type { Patch as BoxResizerPatch } from "visual/component/BoxResizer/types";
import ClickOutside from "visual/component/ClickOutside";
import ContextMenu from "visual/component/ContextMenu";
import ListBox from "visual/component/Controls/ListBox";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import CustomCSS from "visual/component/CustomCSS";
import {
  ElementModel,
  ElementModelType2
} from "visual/component/Elements/Types";
import HotKeys from "visual/component/HotKeys";
import Link from "visual/component/Link";
import { ToastNotification } from "visual/component/Notifications";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import { PortalToolbarType } from "visual/component/Toolbar/PortalToolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import {
  NewToolbarConfig,
  SidebarConfig
} from "visual/editorComponents/EditorComponent/types";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { isCloud } from "visual/global/Config/types";
import {
  BaseDCItem,
  DCTypes,
  isDCItemHandler
} from "visual/global/Config/types/DynamicContent";
import { isPopup, isStory } from "visual/providers/EditorModeProvider";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import { Block } from "visual/types/Block";
import { t } from "visual/utils/i18n";
import { getLinkData } from "visual/utils/models/link";
import { defaultValueKey2 } from "visual/utils/onChange/device";
import {
  getDynamicContentByPlaceholder,
  getDynamicContentChoices
} from "visual/utils/options";
import { Choice } from "visual/utils/options/getDynamicContentChoices";
import { attachRefs } from "visual/utils/react";
import * as ResponsiveMode from "visual/utils/responsiveMode";
import { Wrapper } from "../tools/Wrapper";
import { withMigrations } from "../tools/withMigrations";
import Quill, { Coords, Formats, QuillComponent, triggerCodes } from "./Quill";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import { migrations } from "./migrations";
import * as RichTextPatch from "./patch";
import * as sidebarConfig from "./sidebar";
import { style, styleDC } from "./styles";
import toolbarConfigFn from "./toolbar";
import { TypographyTags, isTypographyTags, tagId } from "./toolbar/utils";
import type { Patch, PrepopulationData, Value } from "./types";
import {
  dcItemOptionParser,
  getFilteredPopups,
  getTextBackground,
  parseColor,
  parseShadow
} from "./utils";
import {
  getInnerElement,
  handleClearFormatting,
  handlePasteStyles
} from "./utils/ContextMenu";
import { handleChangeLink } from "./utils/dependencies";
import { getImagePopulation } from "./utils/requests/ImagePopulation";
import { classNamesToV } from "./utils/transforms";

const resizerPoints = ["centerLeft", "centerRight"];

interface State {
  formats: Formats;
  prepopulation: Formats["prepopulation"] | null;
  population: Formats["population"] | null;
  selectionCoords: Coords | null;
  selectedValue: unknown | null;
  prepopulationData: PrepopulationData;
}

type ToolbarOption =
  | {
      manualControl: boolean;
      repositionOnUpdates: boolean;
      onOpen: VoidFunction;
      onClose: VoidFunction;
    }
  | Record<string, never>;

class RichText extends EditorComponent<Value, Record<string, unknown>, State> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  prepopulation: string | null = null;

  state: State = {
    formats: {},
    prepopulation: null,
    population: null,
    selectionCoords: null,
    selectedValue: null,
    prepopulationData: {
      show: false,
      index: null
    }
  };

  quillRef = createRef<QuillComponent>();
  toolbarRef = createRef<PortalToolbarType>();
  nodeRef = createRef<HTMLDivElement>();
  toolbarOpen = false;
  tmpPopups: Value["popups"] | null = null;

  setPrepopulationData = (newPrepopulationData: Partial<PrepopulationData>) =>
    this.setState((state) => ({
      ...state,
      prepopulationData: {
        ...state.prepopulationData,
        ...newPrepopulationData
      }
    }));

  renderDC =
    !(
      typeof this.getGlobalConfig().dynamicContent?.getPlaceholderData ===
      "function"
    ) || isView(this.props.renderContext);

  // Can be enabled by Config

  static get componentId() {
    return "RichText";
  }

  handleResizerChange = (patch: BoxResizerPatch) => this.patchValue(patch);

  componentDidMount() {
    const node = this.nodeRef.current;

    if (!(node instanceof Element)) {
      return;
    }

    const itemId = this.context.dynamicContent.itemId;
    itemId && node.setAttribute("data-item_id", itemId);
    const populations = node.querySelectorAll<HTMLElement>(
      "[data-image_population]"
    );

    if (populations.length > 0 && this.renderDC) {
      populations.forEach(async (element) => {
        const placeholder = element.getAttribute("data-image_population");

        if (placeholder) {
          const newUrl = await getImagePopulation(
            placeholder,
            itemId,
            this.getGlobalConfig()
          );
          if (newUrl) {
            element.classList.add("brz-population-mask__style");
            element.style.backgroundImage = `url("${newUrl}")`;
          }
        }
      });
    }
  }

  handleToolbarOpen = () => {
    this.toolbarOpen = true;
  };

  handleToolbarClose = () => {
    this.toolbarOpen = false;
  };

  getSelectedValue = (selection: string) => {
    this.setState({ ...this.state, selectedValue: selection });
  };

  handleCustomDCOption = (formats: Formats) => {
    const res = (option: BaseDCItem) => {
      try {
        const dcOption = dcItemOptionParser(option);

        if (!(this.quillRef.current !== null)) {
          return;
        }
        this.prepopulation = dcOption.label;

        this.quillRef.current.formatPopulation({
          label: dcOption.label,
          display: dcOption.display,
          placeholder: dcOption.placeholder
        });

        this.quillRef.current.format("prepopulation", null);
        this.prepopulation = null;
      } catch (e) {
        ToastNotification.error(t("Invalid Dynamic Option"));
      }
    };
    const rej = (msg: string) => {
      ToastNotification.error(msg);
    };

    const keyCode = formats.prepopulation?.at(-1);

    const extra = {
      ...(keyCode && { keyCode }),
      ...(formats.population && {
        placeholder: formats.population.population,
        label: formats.population.label
      })
    };

    return { res, rej, extra };
  };

  handleSelectionChange = (
    formats: Formats,
    selectionCoords: Coords,
    cursorIndex?: number
  ) => {
    const newState = {
      formats
    };
    const dynamicContentGroups = this.getGlobalConfig().dynamicContent?.groups;

    if (
      isDCItemHandler(dynamicContentGroups?.richText) &&
      dynamicContentGroups
    ) {
      if (selectionCoords && this.state.selectionCoords !== selectionCoords) {
        Object.assign(newState, { selectionCoords });

        const prepopulation = formats.prepopulation?.trim();

        if (prepopulation && this.prepopulation !== prepopulation) {
          const { res, rej, extra } = this.handleCustomDCOption(formats);

          if (extra.keyCode && triggerCodes.some((k) => k === extra.keyCode)) {
            dynamicContentGroups.richText.handler(res, rej, extra);
          }
        }

        this.setState(newState, () => this.toolbarRef.current?.show());
      }
      return;
    }

    if (
      this.state.prepopulation !== formats.prepopulation ||
      (selectionCoords && this.state.selectionCoords !== selectionCoords) ||
      formats.population
    ) {
      Object.assign(newState, {
        prepopulation: formats.prepopulation || null,
        population: formats.population || null,
        selectionCoords
      });
    }

    const {
      prepopulationData: { show, index }
    } = this.state;

    if (show && index && cursorIndex && cursorIndex - 1 !== index) {
      Object.assign(newState, {
        prepopulationData: {
          index: null,
          show: false
        }
      });
    }

    this.setState(newState, () => this.toolbarRef.current?.show());
  };

  handleActiveClick = (
    event: React.MouseEvent<HTMLDivElement>,
    formats: Formats
  ) => {
    this.toolbarRef.current?.handleNodeClick(event as unknown as Event);

    const dynamicContentGroups = this.getGlobalConfig().dynamicContent?.groups;

    if (
      isDCItemHandler(dynamicContentGroups?.richText) &&
      formats.population &&
      dynamicContentGroups
    ) {
      const { res, rej, extra } = this.handleCustomDCOption(formats);

      dynamicContentGroups.richText.handler(res, rej, extra);
      this.setState({ formats }, () => this.toolbarRef.current?.show());
    }
  };

  handleTextChange = (text: string) => {
    let popups: Value["popups"] | undefined;

    // making use of the popups hack
    if (this.tmpPopups) {
      popups = this.tmpPopups;
      this.tmpPopups = null;
    }

    const { blocksData } = this.getReduxState();
    const modelPopups = popups ?? this.getValue().popups;
    const filteredPopups = getFilteredPopups(text, modelPopups, blocksData);

    this.patchValue({
      text,
      ...(filteredPopups.length !== modelPopups.length
        ? { popups: filteredPopups }
        : {})
    });
  };

  handlePopulationSet = (value: string) => {
    if (this.quillRef.current === null) {
      return;
    }

    const {
      prepopulationData: { index: cursorIndex }
    } = this.state;

    this.quillRef.current.formatPrepopulation();

    const finalCursorIndex = this.quillRef.current.getSelectionRange().index;

    const dcConfig = this.context.dynamicContent.config;

    const dcOption = dcConfig
      ? getDynamicContentByPlaceholder(dcConfig, value)
      : undefined;

    if (dcOption) {
      this.quillRef.current.formatPopulation({
        label: dcOption.label,
        display: dcOption.display ?? "inline",
        placeholder: value
      });
    }

    const stateData: Partial<PrepopulationData> = {
      show: false
    };

    if (isNumber(cursorIndex) && isNumber(finalCursorIndex)) {
      this.quillRef.current.deleteText(
        cursorIndex,
        finalCursorIndex - cursorIndex
      );
      stateData.index = null;
    }

    this.quillRef.current.format("prepopulation", null);
    this.setPrepopulationData(stateData);
  };

  handlePopulationClickOutside = () => {
    this.setState({
      prepopulation: null,
      prepopulationData: {
        show: false,
        index: null
      },
      population: null
    });
  };

  handleBlockTag = (value: string) => {
    switch (value) {
      case "heading1":
        return { pre: false, header: "h1" };
      case "heading2":
        return { pre: false, header: "h2" };
      case "heading3":
        return { pre: false, header: "h3" };
      case "heading4":
        return { pre: false, header: "h4" };
      case "heading5":
        return { pre: false, header: "h5" };
      case "heading6":
        return { pre: false, header: "h6" };
      case "paragraph":
      default:
        return { pre: false, header: null };
    }
  };

  handleChange = (values: Patch) => {
    // after Quill applies formatting it steals the focus to itself,
    // we try to fight back by remembering the previous focused element
    // and restoring it's focus after Quill steals it
    const prevActive = document.activeElement;

    // this is a hack to somehow make RichText be able to save
    // popups inside it's value
    if (values.popups) {
      this.tmpPopups = values.popups;
    }

    const node = this.nodeRef?.current;

    if (
      node &&
      prevActive instanceof HTMLElement &&
      !node.contains(prevActive)
    ) {
      prevActive.focus(); // Safely call focus
    }

    if (this.quillRef && this.quillRef.current) {
      if (
        values.hasOwnProperty("typographyFontStyle") &&
        typeof values.typographyFontStyle !== "undefined"
      ) {
        this.quillRef.current.formatMultiple(
          this.handleBlockTag(values.typographyFontStyle)
        );
      }

      const quillNode = this.quillRef.current;

      if (quillNode) {
        quillNode.formatMultiple(values);
      }
    }

    this.patchValue(values);
  };

  handleKeyDown = (e: MouseEvent, { keyName }: { keyName: string }) => {
    e.preventDefault();

    const config = this.getGlobalConfig();

    const handlePaste = () => {
      const state = this.getReduxState();
      const innerElement = getInnerElement(state, config.menuData);
      const device = deviceModeSelector(state);
      if (!innerElement) return;

      handlePasteStyles({
        innerElement,
        onChange: this.handleChange,
        v: this.getValue(),
        device,
        config
      });
    };

    // TODO: Create a list of shortcuts
    switch (keyName) {
      case "alt+shift+V":
      case "ctrl+shift+V":
      case "cmd+shift+V":
      case "right_cmd+shift+V":
      case "shift+alt+V":
      case "shift+ctrl+V":
      case "shift+cmd+V":
      case "shift+right_cmd+V":
        handlePaste();
        return;
      case "alt+\\":
      case "ctrl+\\":
      case "cmd+\\":
      case "right_cmd+\\":
        handleClearFormatting({
          onChange: this.handleChange,
          editorMode: this.props.editorMode,
          config
        });
        return;
      default:
        break;
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleKeyUp = () => {};

  getClassName(v: Value, vs: Value, vd: Value) {
    const cssDCStyle =
      v.textPopulation &&
      this.css(
        "dc" + this.getComponentId(),
        "dc" + this.getId(),
        styleDC({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      );

    return classNames(
      "brz-rich-text",
      {
        notranslate: isEditor(this.props.renderContext),
        "brz-rich-text__custom": !v.textPopulation,
        "brz-rich-text__population": v.textPopulation,
        "brz-rich-text__population-cloud":
          v.textPopulation && isCloud(this.getGlobalConfig())
      },
      v.className,
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      ),
      cssDCStyle
    );
  }

  getToolbarOpen = () => {
    return this.toolbarOpen;
  };

  patchValue(patch: Patch, meta = {}) {
    let newPatch = patch;

    const { imagePopulationEntityType: currentImagePopulationEntityType } =
      this.getValue();

    const isDCPatch = RichTextPatch.dynamicContent(patch);
    const isBgDCPatch = RichTextPatch.bgDynamicContent(patch);

    if (isBgDCPatch) {
      const { imagePopulationEntityType: nextImagePopulationEntityType } =
        patch.backgroundImage ?? {};

      if (currentImagePopulationEntityType !== nextImagePopulationEntityType) {
        newPatch = {
          ...newPatch,
          imagePopulationEntityType: nextImagePopulationEntityType
        };
      }
    }

    if (isDCPatch) {
      if (patch.textPopulation) {
        const currentPopulation = this.getValue2().v.textPopulation;

        if (currentPopulation) {
          return super.patchValue(patch, meta);
        }

        const keys = [
          "FontFamily",
          "FontFamilyType",
          "FontSize",
          "FontSizeSuffix",
          "FontStyle",
          "FontWeight",
          "LetterSpacing",
          "LineHeight"
        ];

        const children = Array.from(
          this.quillRef.current?.quill?.root?.children ?? []
        );

        const v = children
          .filter((i) => isTypographyTags(i.tagName))
          .reverse()
          .reduce<Array<[TypographyTags, string[]]>>((acc, i) => {
            acc.push([i.tagName as TypographyTags, [...i.classList]]);
            return acc;
          }, [])
          .map(
            ([k, classes]) =>
              [k, classNamesToV(classes)] as [TypographyTags, ElementModel]
          )
          .map(([tag, v]) =>
            ResponsiveMode.types.map((device) => {
              const getKey = (k: string) =>
                defaultValueKey2({
                  key: createOptionId(tagId(tag as TypographyTags), k),
                  device,
                  state: "normal"
                });
              const dvv = (key: string) => {
                const k = defaultValueKey2({
                  key: createOptionId("typography", key),
                  device,
                  state: "normal"
                });
                return v[k];
              };
              const getTypographyKey = (k: string) => {
                return defaultValueKey2({
                  key: createOptionId("typography", k),
                  device,
                  state: "normal"
                });
              };

              return keys.reduce<Record<string, unknown>>((acc, key) => {
                acc[getKey(key)] = dvv(key);
                acc[getTypographyKey(key)] = dvv(key);
                return acc;
              }, {});
            })
          )
          .flat()
          .reduce((acc, v) => ({ ...acc, ...v }), {});

        newPatch = {
          ...newPatch,
          ...v,
          ...this.getStyleByFormats()
        };
      }
    }

    if (
      this.quillRef.current !== null &&
      ("linkPopulation" in patch || "linkExternal" in patch) &&
      !this.getValue().textPopulation
    ) {
      const v = this.getValue2().v;
      const link = handleChangeLink(v, patch);
      this.quillRef.current.formatMultiple(link);
    }

    super.patchValue(newPatch, meta);
  }

  getValue2() {
    const { v, vs, vd } = super.getValue2();
    if (v.textPopulation) {
      return { v, vs, vd };
    }

    return {
      v: {
        ...v,
        ...this.state.formats,
        tag: this.state.formats?.tagName
      },
      vs,
      vd
    };
  }

  renderPopulationHelper() {
    const { prepopulation, population, selectionCoords } = this.state;
    if (!selectionCoords) {
      return;
    }

    const { left, top, height } = selectionCoords;
    const { label, population: placeholder } = population ?? {};
    const currentPattern = label ?? prepopulation ?? "@";

    const style = {
      left,
      width: "130px",
      top: top + height
    };
    const dcConfig = this.context.dynamicContent.config;

    const choices =
      (dcConfig
        ? (getDynamicContentChoices(
            dcConfig,
            DCTypes.richText
          ) as Array<Choice>)
        : undefined) || [];

    // remove first symbol - # && escape string for use in regexp
    const re = new RegExp(
      currentPattern.substr(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    const filteredChoices = choices.filter(
      ({ title, value }) => re.test(title) || placeholder === value
    );

    const content = (
      <ClickOutside onClickOutside={this.handlePopulationClickOutside}>
        {({ ref }) => (
          <ListBox
            style={style}
            choices={filteredChoices}
            onChange={this.handlePopulationSet}
            containerRef={ref}
          />
        )}
      </ClickOutside>
    );

    return ReactDOM.createPortal(content, document.body);
  }

  renderPopups(v: Value) {
    const { popups } = v;

    // we disabled this optimization here, because we know nothing about
    // formats during compilation time, so this condition won't work
    // const { linkType, linkPopup } = this.state.formats;
    // if (popups.length > 0 && linkType !== "popup" && linkPopup !== "") {
    //   return null;
    // }

    const normalizePopups = popups.reduce<ElementModelType2[]>((acc, popup) => {
      let itemData = popup;
      const { type, value } = popup;

      if (type === "GlobalBlock" && typeof value._id !== "undefined") {
        // TODO: some kind of error handling
        itemData = blocksDataSelector(this.getReduxState())[
          value._id
        ] as ElementModelType2;
      }

      return itemData ? [...acc, itemData] : acc;
    }, []);

    if (normalizePopups.length === 0) {
      return null;
    }

    const meta = this.props.meta;
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData: Block) => {
        const { blockId } = itemData;
        let {
          value: { popupId }
        } = itemData;

        let newMeta = omit(meta, ["globalBlockId"]);

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlockId = itemData.value._id;
          const blockData = blocksDataSelector(this.getReduxState())[
            globalBlockId
          ];

          if (blockData) {
            popupId = blockData.value.popupId;
          }

          newMeta = {
            ...newMeta,
            globalBlockId
          };
        }

        return {
          blockId,
          meta: newMeta,
          ...(isEditor(this.props.renderContext) && {
            instanceKey: `${this.getId()}_${popupId}`
          })
        };
      }
    });

    /**
     * Since the EditorArrayComponent is still in JS
     * TS cannot read properly it's return type
     * @ts-expect-error */
    return <EditorArrayComponent {...popupsProps} />;
  }

  renderLink(v: Value) {
    const { text } = v;
    const linkData = getLinkData(v, this.getGlobalConfig());

    let content = (
      <div className="placeholder-is-empty">
        <Placeholder icon="wp-title" />
      </div>
    );

    if (this._dc?.lastCache?.text || this.renderDC) {
      if (isView(this.props.renderContext)) {
        content = <span>{text}</span>;
      } else {
        content = (
          <span
            className="brz-blocked"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        );
      }
    }

    if (linkData.href) {
      return (
        <Link
          className="brz-ed-content-dc-link !text-inherit"
          type={linkData.type}
          href={linkData.href}
          target={linkData.target}
          rel={linkData.rel}
          slide={linkData.slide}
        >
          {content}
        </Link>
      );
    }

    return content;
  }

  renderForEdit(v: Value, vs: Value, vd: Value) {
    const {
      selectedValue,
      prepopulationData: { show }
    } = this.state;
    const { meta = {} } = this.props;
    const inPopup = Boolean(meta.sectionPopup);
    const inPopup2 = Boolean(meta.sectionPopup2);
    const shortcutsTypes = [
      "copy",
      "paste",
      "pasteStyles",
      "delete",
      "clearFormatting"
    ];
    const isStoryMode = isStory(this.props.editorMode);

    const newV = {
      ...v,
      selectedValue,
      popups: this.tmpPopups || v.popups
    };

    const config = this.getGlobalConfig();

    const toolbarConfig = toolbarConfigFn(
      newV,
      this.handleChange
    ) as NewToolbarConfig<Value>;

    const showPopulationHelper = !getCurrentTooltip() && show;

    const restrictions = {
      width: {
        "%": {
          min: 5,
          max: 100
        }
      }
    };

    const dynamicContentGroups = this.getGlobalConfig().dynamicContent?.groups;
    const isDCHandler = isDCItemHandler(dynamicContentGroups?.richText);

    let content = (
      <Quill
        ref={this.quillRef}
        store={this.getReduxStore()}
        sheet={this.context.sheet}
        componentId={this.getId()}
        value={v.text}
        selectedValue={this.getSelectedValue}
        onSelectionChange={this.handleSelectionChange}
        onClick={this.handleActiveClick}
        onTextChange={this.handleTextChange}
        isToolbarOpen={this.getToolbarOpen}
        initDelay={
          inPopup || inPopup2 || isPopup(this.props.editorMode) ? 1000 : 0
        }
        renderContext={this.props.renderContext}
        editorMode={this.props.editorMode}
        getConfig={this.getGlobalConfig}
        dcGroups={config?.dynamicContent?.groups}
        textId={v._id}
        isStoryMode={isStoryMode}
        isDCHandler={isDCHandler}
        isListOpen={show}
        setPrepopulationData={this.setPrepopulationData}
      />
    );
    let toolbarOptions: ToolbarOption = {
      manualControl: true,
      repositionOnUpdates: true,
      onOpen: this.handleToolbarOpen,
      onClose: this.handleToolbarClose
    };

    if (v.textPopulation) {
      toolbarOptions = {};

      content = this.renderLink(v);
    }

    return (
      <React.Fragment>
        <HotKeys
          shortcutsTypes={shortcutsTypes}
          id={this.getId()}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
        >
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarConfig,
                  sidebarConfig as SidebarConfig<Value>
                )}
                ref={this.toolbarRef}
                {...toolbarOptions}
              >
                {({ ref: toolbarRef }) => (
                  <Wrapper
                    {...this.makeWrapperProps({
                      className: this.getClassName(v, vs, vd)
                    })}
                    ref={(el) => {
                      attachRefs(el, [toolbarRef, cssRef, this.nodeRef]);
                    }}
                  >
                    <ContextMenu
                      {...this.makeContextMenuProps(contextMenuConfig)}
                    >
                      {({
                        ref: contextMenuRef
                      }: {
                        ref: RefObject<HTMLDivElement>;
                      }) =>
                        isStoryMode ? (
                          <BoxResizer
                            points={resizerPoints}
                            meta={{
                              ...meta,
                              horizontalAlign: "left"
                            }}
                            value={v}
                            onChange={this.handleResizerChange}
                            restrictions={restrictions}
                            ref={contextMenuRef}
                          >
                            {content}
                          </BoxResizer>
                        ) : (
                          // div is needed as an attachment for context menu in dynamic content case
                          <div ref={contextMenuRef} className={"brz-rich-text-context-wrapper"}>
                            {content}
                          </div>
                        )
                      }
                    </ContextMenu>
                  </Wrapper>
                )}
              </Toolbar>
            )}
          </CustomCSS>
        </HotKeys>
        {showPopulationHelper && this.renderPopulationHelper()}
        {this.renderPopups(v)}
      </React.Fragment>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value) {
    const config = this.getGlobalConfig();

    let content = (
      <Quill
        store={this.getReduxStore()}
        sheet={this.context.sheet}
        value={v.text}
        renderContext={this.props.renderContext}
        editorMode={this.props.editorMode}
        getConfig={this.getGlobalConfig}
        dcGroups={config?.dynamicContent?.groups}
      />
    );

    if (v.textPopulation) {
      content = this.renderLink(v);
    }

    return (
      <Fragment>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className: this.getClassName(v, vs, vd)
            })}
          >
            {content}
          </Wrapper>
        </CustomCSS>
        {this.renderPopups(v)}
      </Fragment>
    );
  }

  private getStyleByFormats() {
    const quillComponent = this.quillRef.current;

    if (!quillComponent || quillComponent.quill === null) {
      return {};
    }

    const formats = quillComponent.quill?.getFormat(0);
    return {
      ...parseShadow(formats.shadow),
      ...parseColor(formats.color, formats.opacity),
      ...getTextBackground(formats.background, formats.textBackgroundGradient),
      textBgColorPalette: formats.textBgColorPalette ?? null,
      bgColorPalette: formats.colorPalette ?? null
    };
  }
}

export default withMigrations(RichText, migrations);
