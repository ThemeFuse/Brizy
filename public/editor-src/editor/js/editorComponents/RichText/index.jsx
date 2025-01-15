import classNames from "classnames";
import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { omit } from "timm";
import { isEditor, isView } from "visual/providers/RenderProvider";
import BoxResizer from "visual/component/BoxResizer";
import ClickOutside from "visual/component/ClickOutside";
import ContextMenu from "visual/component/ContextMenu";
import ListBox from "visual/component/Controls/ListBox";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import CustomCSS from "visual/component/CustomCSS";
import HotKeys from "visual/component/HotKeys";
import Link from "visual/component/Link";
import { ToastNotification } from "visual/component/Notifications";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { isCloud } from "visual/global/Config/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isPopup, isStory } from "visual/global/EditorModeContext";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { getLinkData } from "visual/utils/models/link";
import { defaultValueKey2 } from "visual/utils/onChange/device";
import {
  getDynamicContentByPlaceholder,
  getDynamicContentChoices
} from "visual/utils/options";
import * as ResponsiveMode from "visual/utils/responsiveMode";
import { Wrapper } from "../tools/Wrapper";
import { withMigrations } from "../tools/withMigrations";
import Quill, { triggerCodes } from "./Quill";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import { migrations } from "./migrations";
import * as RichTextPatch from "./patch";
import * as sidebarConfig from "./sidebar";
import { style, styleDC } from "./styles";
import toolbarConfigFn from "./toolbar";
import { TypographyTags, tagId } from "./toolbar/utils";
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

class RichText extends EditorComponent {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;
  prepopulation = null;
  state = {
    formats: {},
    prepopulation: null,
    population: null,
    selectionCoords: null,
    selectedValue: null
  };
  quillRef = React.createRef();
  toolbarRef = React.createRef();
  toolbarOpen = false;
  renderDC =
    !(
      typeof this.getGlobalConfig().dynamicContent?.getPlaceholderData ===
      "function"
    ) || isView(this.renderContext);
  // Can be enabled by Config

  static get componentId() {
    return "RichText";
  }

  handleResizerChange = (patch) => this.patchValue(patch);

  componentDidMount() {
    // TODO NEED review and exclude ReactDOM.findDOMNode
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);

    node.addEventListener(
      "click",
      (event) => (event.toolbarHandled = true),
      false
    );
    const itemId = this.context.dynamicContent.itemId;
    itemId && node.setAttribute("data-item_id", itemId);
    const populations = node.querySelectorAll("[data-image_population]");

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

  getSelectedValue = (selection) => {
    this.setState({ ...this.state, selectedValue: selection });
  };

  handleCustomDCOption = (formats) => {
    const res = (option) => {
      try {
        const dcOption = dcItemOptionParser(option);

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
    const rej = (msg) => {
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

  handleSelectionChange = (formats, selectionCoords) => {
    const newState = {
      formats
    };
    const dynamicContentGroups = this.getGlobalConfig().dynamicContent?.groups;

    if (
      !Array.isArray(dynamicContentGroups) &&
      typeof dynamicContentGroups?.richText?.handler === "function"
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

        this.setState(newState, () => this.toolbarRef.current.show());
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

    this.setState(newState, () => this.toolbarRef.current.show());
  };

  handleActiveClick = (event, formats) => {
    this.toolbarRef.current.handleNodeClick(event);

    const dynamicContentGroups = this.getGlobalConfig().dynamicContent?.groups;

    if (
      !Array.isArray(dynamicContentGroups) &&
      typeof dynamicContentGroups?.richText?.handler === "function" &&
      formats.population
    ) {
      const { res, rej, extra } = this.handleCustomDCOption(formats);

      dynamicContentGroups.richText.handler(res, rej, extra);
      this.setState({ formats }, () => this.toolbarRef.current.show());
    }
  };

  handleTextChange = (text) => {
    let popups;

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

  handlePopulationSet = (value) => {
    const dcOption = getDynamicContentByPlaceholder(
      this.context.dynamicContent.config,
      value
    );

    if (dcOption) {
      this.quillRef.current.formatPopulation({
        label: dcOption.label,
        display: dcOption.display ?? "inline",
        placeholder: value
      });
    }

    this.quillRef.current.format("prepopulation", null);
  };

  handlePopulationClickOutside = () => {
    this.setState({
      prepopulation: null,
      population: null
    });
  };

  handleBlockTag = (value) => {
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

  handleChange = (values) => {
    // after Quill applies formatting it steals the focus to itself,
    // we try to fight back by remembering the previous focused element
    // and restoring it's focus after Quill steals it
    const prevActive = document.activeElement;

    // this is a hack to somehow make RichText be able to save
    // popups inside it's value
    if (values.popups) {
      this.tmpPopups = values.popups;
    }

    // TODO NEED review and exclude ReactDOM.findDOMNode
    // eslint-disable-next-line react/no-find-dom-node
    if (!ReactDOM.findDOMNode(this).contains(prevActive)) {
      prevActive.focus && prevActive.focus();
    }

    if (this.quillRef && this.quillRef.current) {
      if (values.hasOwnProperty("typographyFontStyle")) {
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

  handleKeyDown = (e, { keyName }) => {
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

  getClassName(v, vs, vd) {
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
          renderContext: this.renderContext
        })
      );

    return classNames(
      "brz-rich-text",
      {
        notranslate: isEditor(this.renderContext),
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
          renderContext: this.renderContext
        })
      ),
      cssDCStyle
    );
  }

  getToolbarOpen = () => {
    return this.toolbarOpen;
  };

  patchValue(patch, meta) {
    let newPatch = patch;

    const { imagePopulationEntityType: currentImagePopulationEntityType } =
      this.getValue();

    const isDCPatch = RichTextPatch.dynamicContent(patch);
    const isBgDCPatch = RichTextPatch.bgDynamicContent(patch);

    if (isBgDCPatch) {
      const { imagePopulationEntityType: nextImagePopulationEntityType } =
        patch.backgroundImage;

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
          .filter((i) => !!TypographyTags[i.tagName])
          .reverse()
          .reduce((acc, i) => {
            acc.push([i.tagName, [...i.classList]]);
            return acc;
          }, [])
          .map(([k, classes]) => [k, classNamesToV(classes)])
          .map(([tag, v]) =>
            ResponsiveMode.types.map((device) => {
              const getKey = (k) =>
                defaultValueKey2({
                  key: createOptionId(tagId(tag), k),
                  device,
                  state: "normal"
                });
              const dvv = (key) => {
                const k = defaultValueKey2({
                  key: createOptionId("typography", key),
                  device
                });
                return v[k];
              };
              const getTypographyKey = (k) => {
                return defaultValueKey2({
                  key: createOptionId("typography", k),
                  device,
                  state: "normal"
                });
              };

              return keys.reduce((acc, key) => {
                acc[getKey(key)] = dvv(key);
                acc[getTypographyKey(key)] = dvv(key);
                return acc;
              }, {});
            })
          )
          .flat()
          .reduce((acc, v) => ({ ...acc, ...v }), {});

        const formats = this.quillRef.current.quill.getFormat(0);

        newPatch = {
          ...newPatch,
          ...v,
          ...parseShadow(formats.shadow),
          ...parseColor(formats.color, formats.opacity),
          ...getTextBackground(
            formats.background,
            formats.textBackgroundGradient
          ),
          textBgColorPalette: formats.textBgColorPalette ?? null,
          bgColorPalette: formats.colorPalette ?? null
        };
      }
    }

    if (
      ("linkPopulation" in patch || "linkExternal" in patch) &&
      !this.getValue().textPopulation
    ) {
      const link = handleChangeLink(this.getValue2().v, patch);
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
    const {
      prepopulation,
      population,
      selectionCoords: { left, top, height }
    } = this.state;
    const { label, population: placeholder } = population ?? {};
    const currentPattern = label ?? prepopulation;

    const style = {
      left,
      width: "130px",
      top: top + height
    };
    const choices =
      getDynamicContentChoices(
        this.context.dynamicContent.config,
        DCTypes.richText
      ) || [];

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
        <ListBox
          style={style}
          choices={filteredChoices}
          onChange={this.handlePopulationSet}
        />
      </ClickOutside>
    );

    return ReactDOM.createPortal(content, document.body);
  }

  renderPopups(v) {
    const { popups } = v;

    // we disabled this optimization here, because we know nothing about
    // formats during compilation time, so this condition won't work
    // const { linkType, linkPopup } = this.state.formats;
    // if (popups.length > 0 && linkType !== "popup" && linkPopup !== "") {
    //   return null;
    // }

    const normalizePopups = popups.reduce((acc, popup) => {
      let itemData = popup;

      if (itemData.type === "GlobalBlock") {
        // TODO: some kind of error handling
        itemData = blocksDataSelector(this.getReduxState())[itemData.value._id];
      }

      return itemData ? [...acc, itemData] : acc;
    }, []);

    if (normalizePopups.length === 0) {
      return null;
    }

    const meta = this.props.meta;
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData) => {
        let {
          blockId,
          value: { popupId }
        } = itemData;

        let newMeta = omit(meta, ["globalBlockId"]);

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlockId = itemData.value._id;
          const blockData = blocksDataSelector(this.getReduxState())[
            globalBlockId
          ];

          newMeta = {
            ...newMeta,
            globalBlockId
          };
          popupId = blockData.value.popupId;
        }

        return {
          blockId,
          meta: newMeta,
          ...(isEditor(this.renderContext) && {
            instanceKey: `${this.getId()}_${popupId}`
          })
        };
      }
    });

    return <EditorArrayComponent {...popupsProps} />;
  }

  renderLink(v) {
    const { text } = v;
    const linkData = getLinkData(v);

    let content = (
      <div className="placeholder-is-empty">
        <Placeholder icon="wp-title" />
      </div>
    );

    if (this._dc?.lastCache?.text || this.renderDC) {
      if (isView(this.renderContext)) {
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

  renderForEdit(v, vs, vd) {
    const { prepopulation, population, selectedValue } = this.state;
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

    const newV = {
      ...v,
      selectedValue,
      popups: this.tmpPopups || v.popups
    };

    const config = this.getGlobalConfig();

    const toolbarConfig = toolbarConfigFn(newV, this.handleChange);

    const showPopulationHelper =
      !getCurrentTooltip() && (prepopulation || population);

    const restrictions = {
      width: {
        "%": {
          min: 5,
          max: 100
        }
      }
    };

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
        renderContext={this.renderContext}
        editorMode={this.props.editorMode}
        dcGroups={config?.dynamicContent?.groups}
      />
    );
    let toolbarOptions = {
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
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarConfig,
                sidebarConfig
              )}
              ref={this.toolbarRef}
              {...toolbarOptions}
            >
              <Wrapper
                {...this.makeWrapperProps({
                  className: this.getClassName(v, vs, vd)
                })}
              >
                <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
                  {isStory(this.props.editorMode) ? (
                    <BoxResizer
                      points={resizerPoints}
                      meta={{
                        ...meta,
                        horizontalAlign: "left"
                      }}
                      value={v}
                      onChange={this.handleResizerChange}
                      restrictions={restrictions}
                    >
                      {content}
                    </BoxResizer>
                  ) : (
                    // div is needed as an attachment for context menu in dynamic content case
                    <div>{content}</div>
                  )}
                </ContextMenu>
              </Wrapper>
            </Toolbar>
          </CustomCSS>
        </HotKeys>
        {showPopulationHelper && this.renderPopulationHelper()}
        {this.renderPopups(v)}
      </React.Fragment>
    );
  }

  renderForView(v, vs, vd) {
    let content = (
      <Quill
        store={this.getReduxStore()}
        sheet={this.context.sheet}
        value={v.text}
        renderContext={this.renderContext}
        editorMode={this.props.editorMode}
        dcGroups={this.getGlobalConfig()?.dynamicContent?.groups}
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
}

export default withMigrations(RichText, migrations);
