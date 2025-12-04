import { Str } from "@brizy/readers";
import classNames from "classnames";
import { isNumber } from "es-toolkit/compat";
import React, { Fragment, MouseEvent, RefObject, createRef } from "react";
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
import { Tooltip } from "visual/component/Tooltip";
import { TooltipImperativeProps } from "visual/component/Tooltip/types";
import {
  getToolbarPlacement,
  getTooltipPlacement,
  shouldUpdateTooltipByPatch
} from "visual/component/Tooltip/utils";
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
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isPopup, isStory } from "visual/providers/EditorModeProvider";
import { isEditor, isView } from "visual/providers/RenderProvider";
import {
  blocksDataSelector,
  deviceModeSelector,
  globalBlocksSelector
} from "visual/redux/selectors";
import { Block } from "visual/types/Block";
import { isFirefox } from "visual/utils/devices";
import { t } from "visual/utils/i18n";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
import { getLinkData } from "visual/utils/models/link";
import { defaultValueKey2 } from "visual/utils/onChange/device";
import {
  getDynamicContentByPlaceholder,
  getDynamicContentChoices
} from "visual/utils/options";
import { Choice } from "visual/utils/options/getDynamicContentChoices";
import { attachRef, attachRefs } from "visual/utils/react";
import * as ResponsiveMode from "visual/utils/responsiveMode";
import { parseFromString } from "visual/utils/string";
import { Wrapper } from "../tools/Wrapper";
import { withMigrations } from "../tools/withMigrations";
import Quill, { Coords, Formats, QuillComponent, triggerCodes } from "./Quill";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import { migrations } from "./migrations";
import * as RichTextPatch from "./patch";
import * as sidebarConfig from "./sidebar";
import { style, styleDC, styleTooltip } from "./styles";
import toolbarConfigFn from "./toolbar";
import tooltipToolbarConfigFn from "./toolbar/tooltipToolbar";
import { TypographyTags, isTypographyTags, tagId } from "./toolbar/utils";
import tooltipSidebarConfigFn from "./tooltipSidebar";
import type { Patch, PrepopulationData, Value } from "./types";
import {
  dcItemOptionParser,
  getFilteredPopups,
  getTag,
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
      customCoordinates?: Coords;
    }
  | Record<string, never>;

class RichText extends EditorComponent<Value, Record<string, unknown>, State> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  prepopulation: string | null = null;
  tooltipRef = createRef<TooltipImperativeProps>();
  tooltipReferenceElement: Element | null = null;
  isTooltipPatched = false;
  formats: Formats = {};

  state: State = {
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
  shouldOpenToolbar = true;
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

  static get componentId(): ElementTypes.RichText {
    return ElementTypes.RichText;
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

    this.removeUnderlineFromDeletedPopups();
  }

  componentDidUpdate() {
    this.removeUnderlineFromDeletedPopups();
  }

  removeUnderlineFromDeletedPopups = () => {
    const containerNode = this.nodeRef.current;

    if (containerNode) {
      const allPopupLinksNodes =
        containerNode.querySelectorAll<HTMLAnchorElement>("a.link--popup");

      const popups = this.getPopups();

      allPopupLinksNodes.forEach((linkNode) => {
        const { href } = linkNode.dataset;

        if (href) {
          const linkData = parseFromString<Record<string, unknown>>(href);

          if (linkData) {
            const popupId = Str.read(linkData.popup);

            if (popupId) {
              const existsInPopups = popups.find(
                (popup) => popup.value.popupId === popupId.replace("#", "")
              );

              if (!existsInPopups) {
                linkNode.classList.remove("link--popup");
              }
            }
          }
        }
      });
    }
  };

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
      } catch (_) {
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

  handleSelectionChange = (data: {
    formats: Formats;
    selectionCoords: Coords;
    cursorIndex?: number;
    node?: Element | null;
  }) => {
    const { formats, selectionCoords, cursorIndex, node } = data;

    this.formats = formats;

    const newState = {};
    const dynamicContentGroups = this.getGlobalConfig().dynamicContent?.groups;

    if (node) {
      this.handleUpdateTooltipReferenceFromQuill(node);
    }

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

    this.setState(newState, () => {
      const { enableTooltip } = formats;

      if (enableTooltip === "on") {
        // The tooltip toolbar is closed because the main toolbar take the control
        return;
      }

      if (this.shouldOpenToolbar) {
        this.toolbarRef.current?.show();
      }
    });
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

      this.formats = formats;
      this.forceUpdate(() => {
        this.toolbarRef.current?.show();
      });
    }
  };

  handleTextChange = (text: string) => {
    let popups: Value["popups"] | undefined;
    const patch: Patch = {};

    if (text !== this.getValue().text) {
      patch.text = text;
    }

    // making use of the popups hack
    if (this.tmpPopups) {
      popups = this.tmpPopups;
      this.tmpPopups = null;
    }

    const { blocksData } = this.getReduxState();
    const modelPopups = popups ?? this.getValue().popups;
    const filteredPopups = getFilteredPopups(text, modelPopups, blocksData);

    if (filteredPopups.length !== modelPopups.length) {
      patch.popups = filteredPopups;
    }

    if (Object.keys(patch).length > 0) {
      this.patchValue(patch);
    }

    this.handleTextChangeEnd();
  };

  getPopups = (): ElementModelType2[] => {
    const popups = this.tmpPopups || this.getValue().popups;
    const reduxGb = globalBlocksSelector(this.getReduxStore().getState());

    return popups
      .map((popup) => {
        if (popup.type === "GlobalBlock") {
          const popupId = popup.value._id;

          if (popupId) {
            if (reduxGb[popupId] && reduxGb[popupId].data) {
              return reduxGb[popupId].data;
            }
          }

          return undefined;
        }

        return popup;
      })
      .filter(Boolean) as ElementModelType2[];
  };

  handlePopulationSet = (value: string) => {
    const quill = this.quillRef.current;
    if (quill === null) {
      return;
    }

    const {
      prepopulationData: { index: cursorIndex }
    } = this.state;

    quill.formatPrepopulation();

    const finalCursorIndex = quill.getSelectionRange().index;

    const dcConfig = this.context.dynamicContent.config;

    const dcOption = dcConfig
      ? getDynamicContentByPlaceholder(dcConfig, value)
      : undefined;

    if (dcOption) {
      quill.formatPopulation({
        label: dcOption.label,
        display: dcOption.display ?? "inline",
        placeholder: value
      });
    }

    const stateData: Partial<PrepopulationData> = {
      show: false
    };

    if (isNumber(cursorIndex) && isNumber(finalCursorIndex)) {
      quill.deleteText(cursorIndex, finalCursorIndex - cursorIndex);
      stateData.index = null;
    }

    quill.format("prepopulation", null);
    const text = quill.getCurrentValue();

    if (text !== this.getValue().text) {
      this.patchValue({ text });
    }

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
          v.textPopulation && isCloud(this.getGlobalConfig()),
        "brz-rich-text__population-tooltip":
          v.textPopulation && v.enableTooltip === "on"
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

    this.handleTooltipPatch(patch);

    // We need to retrieve the final value from the Quill editor after all formatting (like links) has been applied.
    const currentValue = this.quillRef.current?.getCurrentValue();

    const shouldUpdateText =
      !("text" in patch) &&
      currentValue &&
      currentValue !== this.getValue().text;

    if (shouldUpdateText) {
      newPatch = {
        ...newPatch,
        text: currentValue
      };
    }

    super.patchValue(newPatch, meta);
  }

  getValue2() {
    const { v, vs, vd } = super.getValue2();
    if (v.textPopulation) {
      return { v, vs, vd };
    }

    const formats = this.formats;

    return {
      v: {
        ...v,
        ...formats,
        tag: formats.tagName
      },
      vs,
      vd
    };
  }

  handleTooltipPatch = (patch: Patch) => {
    const needUpdateTooltip = shouldUpdateTooltipByPatch(patch);

    if (needUpdateTooltip) {
      this.tooltipRef.current?.updatePopper();
    }

    this.isTooltipPatched = "tooltip" in patch;
  };

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

  renderTooltip(v: Value, vs: Value, vd: Value) {
    const {
      tooltipOffset,
      tooltipText,
      tooltipTriggerClick,
      tooltipPlacement
    } = v;

    const classTooltip = this.css(
      `${this.getComponentId()}-tooltip`,
      `${this.getId()}-tooltip`,
      styleTooltip({
        v,
        vs,
        vd,
        store: this.getReduxStore(),
        contexts: this.getContexts()
      })
    );

    const tooltipToolbarConfig = tooltipToolbarConfigFn(this.handleChange);
    const tooltipSidebarConfig = tooltipSidebarConfigFn(this.handleChange);

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          tooltipToolbarConfig,
          tooltipSidebarConfig,
          {
            allowExtend: false
          }
        )}
      >
        {({ ref: tooltipToolbarRef }) => (
          <Tooltip
            overlay={tooltipText}
            offset={tooltipOffset}
            ref={this.tooltipRef}
            openOnClick={tooltipTriggerClick === "on"}
            placement={tooltipPlacement}
            id={this.getId()}
            contentRef={tooltipToolbarRef}
            referenceElement={this.tooltipReferenceElement}
            className={classTooltip}
          />
        )}
      </Toolbar>
    );
  }

  renderPopups(v: Value) {
    const { popups: _popups, dcLinkPopupPopups, textPopulation } = v;
    const popups = textPopulation ? dcLinkPopupPopups : _popups;
    const key = textPopulation ? "dcLinkPopupPopups" : "popups";

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
      bindWithKey: key,
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
     * @ts-expect-error unknown is not assignable */
    return <EditorArrayComponent {...popupsProps} />;
  }

  renderLink(v: Value) {
    const { text, enableTooltip, tag } = v;
    const isDC = v.textPopulation;
    const newV = {
      ...v,
      linkPopup: isDC ? v.dcLinkPopup : v.linkPopup,
      linkType: isDC && v.linkType === "dcPopup" ? "popup" : v.linkType
    };

    const linkData = getLinkData(newV, this.getGlobalConfig());

    const Tag = getTag(tag);

    let content = (
      <div className="placeholder-is-empty">
        <Placeholder icon="wp-title" />
      </div>
    );

    const attr =
      enableTooltip === "on"
        ? makeDataAttr({
            name: "tooltip-wrapper-id",
            value: this.getId()
          })
        : undefined;

    if (this._dc?.lastCache?.text || this.renderDC) {
      if (isView(this.props.renderContext)) {
        content = (
          <div className="brz-rich-text-context-wrapper">
            <Tag {...attr}>{text}</Tag>
          </div>
        );
      } else {
        const hasDCPlaceholderGetter =
          typeof this.getGlobalConfig().dynamicContent?.getPlaceholderData ===
          "function";

        // For third-party integrations that don't implement `getPlaceholderData`, we should display their original placeholder instead.
        const _text = hasDCPlaceholderGetter ? text : v.textPopulation;

        content = (
          <Tag
            className="brz-blocked"
            dangerouslySetInnerHTML={{ __html: _text }}
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

  handleToggleTooltip = () => {
    this.tooltipRef.current?.toggleTooltip();
  };

  handleUpdateTooltipReferenceFromQuill(el: Element | null) {
    const nodeWithTooltip = el?.closest(`[${makeAttr("tooltip")}]`);

    if (nodeWithTooltip) {
      this.tooltipReferenceElement = nodeWithTooltip;
    }
  }

  handleUpdateTooltipReferenceFromDC(el: Element | null) {
    if (el) {
      this.tooltipReferenceElement = el;
    }
  }

  handleTextChangeStart = () => {
    this.handleToolbarClose();
    this.shouldOpenToolbar = false;

    if (this.toolbarRef.current) {
      this.toolbarRef.current.hide();
    }
  };

  handleTextChangeEnd = () => {
    if (this.isTooltipPatched) {
      return;
    }

    this.handleToolbarOpen();
    this.shouldOpenToolbar = true;

    if (this.toolbarRef.current) {
      this.toolbarRef.current.show();
    }
  };

  renderForEdit(v: Value, vs: Value, vd: Value) {
    const {
      selectedValue,
      prepopulationData: { show },
      selectionCoords
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

    const { enableTooltip, tooltipPlacement } = v;
    const isTooltipEnabled = enableTooltip === "on";

    const _tooltipPlacement = isTooltipEnabled
      ? getTooltipPlacement(tooltipPlacement)
      : undefined;

    const mainToolbarPlacement = getToolbarPlacement(_tooltipPlacement);

    let content = (
      <Quill
        ref={this.quillRef}
        // @ts-expect-error: Type 'Store' is not assignable to type 'Store & Store<any, UnknownAction, unknown>'
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
        onTextChangeStart={this.handleTextChangeStart}
      />
    );
    let toolbarOptions: ToolbarOption = {
      manualControl: true,
      repositionOnUpdates: true,
      onOpen: this.handleToolbarOpen,
      onClose: this.handleToolbarClose
    };

    if (selectionCoords) {
      toolbarOptions["customCoordinates"] = selectionCoords;
    }

    if (v.textPopulation) {
      toolbarOptions = {};

      content = this.renderLink(v);
    }

    const attrs = isTooltipEnabled
      ? makeDataAttr({
          name: "tooltip-wrapper-id",
          value: this.getId()
        })
      : undefined;

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
                placement={mainToolbarPlacement}
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
                    onClick={this.handleToggleTooltip}
                    attributes={attrs}
                  >
                    <ContextMenu
                      {...this.makeContextMenuProps(contextMenuConfig)}
                      onContextMenu={() => {
                        const quil = this.quillRef.current?.quill;

                        if (isFirefox() && quil) {
                          const [leafBlot] = quil.getLeaf(0);

                          this.quillRef.current?.quill?.setSelection(
                            leafBlot.parent.length() / 2,
                            0
                          );
                        }
                      }}
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
                          <div
                            ref={(el) => {
                              attachRef(el, contextMenuRef);
                              if (v.textPopulation) {
                                this.handleUpdateTooltipReferenceFromDC(el);
                              }
                            }}
                            className={"brz-rich-text-context-wrapper"}
                          >
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
        {isTooltipEnabled && this.renderTooltip(v, vs, vd)}
      </React.Fragment>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value) {
    const config = this.getGlobalConfig();
    const { textPopulation, enableTooltip } = v;
    const store = this.getReduxStore();

    let content = (
      <Quill
        // @ts-expect-error: Type 'Store' is not assignable to type 'Store & Store<any, UnknownAction, unknown>'. (ts 2322)
        store={store}
        sheet={this.context.sheet}
        value={v.text}
        renderContext={this.props.renderContext}
        editorMode={this.props.editorMode}
        getConfig={this.getGlobalConfig}
        dcGroups={config?.dynamicContent?.groups}
        v={v}
      />
    );

    if (textPopulation) {
      content = this.renderLink(v);
    }

    const shouldRenderTooltip = enableTooltip === "on" && textPopulation;

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
        {shouldRenderTooltip && this.renderTooltip(v, vs, vd)}
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
