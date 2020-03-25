import React from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import ThemeIcon from "visual/component/ThemeIcon";
import { CollapsibleToolbar } from "visual/component/Toolbar";
import SortableZIndex from "visual/component/Sortable/SortableZIndex";
import { Roles } from "visual/component/Roles";
import { uuid } from "visual/utils/uuid";
import { stripIds } from "visual/utils/models";
import {
  wInBoxedPage,
  wInTabletPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { getStore } from "visual/redux/store";
import { createGlobalBlock, createSavedBlock } from "visual/redux/actions";
import { globalBlocksAssembled2Selector } from "visual/redux/selectors";
import { triggersSelector } from "visual/redux/selectors";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import * as toolbar from "./toolbar";
import * as sidebar from "./sidebar";
import * as toolbarExtend from "./toolbarExtend";
import {
  styleCloseButton,
  styleBg,
  styleContainer,
  styleContainerWrap
} from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import {
  styleElementSectionContainerType,
  styleSizeContainerSize
} from "visual/utils/style2";
import { getContainerW } from "visual/utils/meta";
import { SectionPopupInstances as Instances } from "./instances";

/**
 * @deprecated use import {SectionPopupInstances} from "visual/editorComponents/SectionPopup/instances";
 * @type {Map<any, any>}
 */
export let SectionPopupInstances = Instances;

class SectionPopup extends EditorComponent {
  static get componentId() {
    return "SectionPopup";
  }

  static defaultProps = {
    meta: {},
    onOpen: () => {},
    onClose: () => {}
  };

  static defaultValue = defaultValue;

  // this is a used as a hack to reopen the
  // popup after it is unmounted when switching
  // from Global to normal
  static tmpGlobal = null;

  constructor(...args) {
    super(...args);

    this.instanceKey = this.props.instanceKey || this.getId();

    if (IS_EDITOR) {
      this.state = {
        isOpened: this.props.isOpened || SectionPopup.tmpGlobal === this.getId()
      };
      SectionPopup.tmpGlobal = null;

      this.mounted = false;
      this.popupRef = React.createRef();
      this.popupsContainer = document.getElementById("brz-popups");
      this.el = document.createElement("div");
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.popupsContainer.appendChild(this.el);
    Instances.set(this.instanceKey, this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateUpdate = this.state.isOpened !== nextState.isOpened;
    return stateUpdate || this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.popupsContainer.removeChild(this.el);
    this.popupsContainer = null;
    this.el = null;

    document.documentElement.classList.remove("brz-ow-hidden");
    Instances.delete(this.instanceKey);
  }

  handleValueChange(newValue, meta) {
    super.handleValueChange(
      newValue,
      Object.assign(meta, {
        SectionPopup: {
          dbId: this.getDBValue()._id,
          domId: this.getId(),
          path: this.getPath()
        }
      })
    );
  }

  handleDropClick = () => {
    this.close();
  };

  getMeta(v) {
    const { meta } = this.props;
    const containerType = styleElementSectionContainerType({ v });
    const size = styleSizeContainerSize({ v, device: "desktop" });
    const tabletSize = styleSizeContainerSize({ v, device: "tablet" });
    const mobileSize = styleSizeContainerSize({ v, device: "mobile" });
    const desktopW = getContainerW({
      v,
      w: containerType === "fullWidth" ? wInFullPage : wInBoxedPage,
      width: size,
      device: "desktop"
    });
    const tabletW = getContainerW({
      v,
      w: wInTabletPage,
      width: tabletSize,
      device: "tablet"
    });
    const mobileW = getContainerW({
      v,
      w: wInMobilePage,
      width: mobileSize,
      device: "mobile"
    });

    return {
      ...meta,
      tabletW,
      mobileW,
      desktopW,
      sectionPopup: true
    };
  }

  renderToolbar() {
    const { globalBlockId } = this.props.meta;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbar, sidebar, {
          allowExtend: false,
          allowExtendFromThirdParty: true
        })}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
        badge={Boolean(globalBlockId)}
      />
    );
  }

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const classNameBg = classnames(
      "brz-popup__inner",
      "brz-d-xs-flex",
      "brz-flex-xs-wrap",
      "brz-align-items-xs-center",
      css(
        `${this.constructor.componentId}-Bg`,
        `${this.getId()}-Bg`,
        styleBg(v, vs, vd)
      )
    );
    const classNameContainer = classnames(
      "brz-container",
      v.containerClassName,
      css(
        `${this.constructor.componentId}-container`,
        `${this.getId()}-container`,
        styleContainer(v, vs, vd)
      )
    );
    const classNameContainerWrap = classnames(
      "brz-container__wrap",
      css(
        `${this.constructor.componentId}-containerWrap`,
        `${this.getId()}-containerWrap`,
        styleContainerWrap(v, vs, vd)
      )
    );
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend, null, {
          allowExtend: false
        }),
        meta,
        inPopup: true
      }
    });

    return (
      <Background className={classNameBg} value={v} meta={meta}>
        <SortableZIndex zindex={1}>
          <div className={classNameContainerWrap}>
            <div className={classNameContainer}>
              <EditorArrayComponent {...itemsProps} />
            </div>
          </div>
        </SortableZIndex>
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    if (!this.state.isOpened) {
      return null;
    }

    const { className, customClassName } = v;

    const id = this.getId();

    const classNameClose = classnames(
      "brz-popup",
      "brz-popup__editor",
      { "brz-popup--opened": this.state.isOpened },
      className,
      customClassName,
      css(
        `${this.constructor.componentId}-close`,
        `${this.getId()}-close`,
        styleCloseButton(v, vs, vd)
      )
    );

    return ReactDOM.createPortal(
      <CustomCSS selectorName={id} css={v.customCSS}>
        <div
          id={id}
          className={classNameClose}
          data-block-id={this.props.blockId}
        >
          <div className="brz-popup__close" onClick={this.handleDropClick}>
            <ThemeIcon name="close-popup" type="editor" />
          </div>
          <Roles
            allow={["admin"]}
            fallbackRender={() => this.renderItems(v, vs, vd)}
          >
            <ContainerBorder showBorder={false} activateOnContentClick={false}>
              {this.renderToolbar()}
              {this.renderItems(v, vs, vd)}
            </ContainerBorder>
          </Roles>
        </div>
      </CustomCSS>,
      this.el
    );
  }

  renderForView(v, vs, vd) {
    const { className, customClassName } = v;
    const triggers = triggersSelector(getStore().getState());

    let attr = {};
    if (IS_GLOBAL_POPUP) {
      const encodeIdsList = [
        "scrolling",
        "showing",
        "devices",
        "referrer",
        "loggedIn"
      ];
      const encodeData = data => encodeURIComponent(JSON.stringify(data));
      const decodeData = data => JSON.parse(decodeURIComponent(data));
      const convertString = name =>
        name.replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`);

      attr = triggers.reduce((acc, item) => {
        if (item.active) {
          const convertedKey = `data-${convertString(item.id)}`;
          if (encodeIdsList.includes(item.id)) {
            acc[convertedKey] = acc[convertedKey]
              ? encodeData([...decodeData(acc[convertedKey]), item.value])
              : encodeData([item.value]);
          } else {
            acc[convertedKey] = item.value;
          }
        }

        return acc;
      }, {});
    }

    const classNameClose = classnames(
      "brz-popup",
      "brz-popup__preview",
      { "brz-conditions-popup": IS_GLOBAL_POPUP },
      className,
      customClassName,
      css(
        `${this.constructor.componentId}-close`,
        `${this.getId()}-close`,
        styleCloseButton(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div
          className={classNameClose}
          data-brz-popup={this.instanceKey}
          {...attr}
        >
          <div className="brz-popup__close">
            <ThemeIcon name="close-popup" type="editor" />
          </div>
          {this.renderItems(v, vs, vd)}
        </div>
      </CustomCSS>
    );
  }

  open() {
    document.documentElement.classList.add("brz-ow-hidden");
    this.props.onOpen();
    this.setState({
      isOpened: true
    });
  }

  close() {
    document.documentElement.classList.remove("brz-ow-hidden");
    this.props.onClose();
    this.setState({
      isOpened: false
    });
  }

  // api
  becomeSaved() {
    const { blockId } = this.props;
    const dbValue = this.getDBValue();
    const dispatch = getStore().dispatch;

    dispatch(
      createSavedBlock({
        id: uuid(),
        data: {
          type: this.constructor.componentId,
          blockId,
          value: dbValue
        },
        meta: {
          sourceBlockId: this.getId()
        }
      })
    );
  }

  becomeGlobal() {
    SectionPopup.tmpGlobal = this.getId();

    const { blockId, onChange } = this.props;
    const dbValue = this.getDBValue();
    const globalBlockId = uuid();
    const dispatch = getStore().dispatch;

    dispatch(
      createGlobalBlock({
        id: globalBlockId,
        data: {
          type: this.constructor.componentId,
          blockId,
          value: dbValue
        },
        meta: {
          sourceBlockId: this.getId()
        }
      })
    );

    onChange(
      {
        type: "GlobalBlock",
        blockId,
        value: {
          _id: this.getId(),
          globalBlockId
        }
      },
      {
        intent: "replace_all",
        idOptions: {
          keepExistingIds: true
        }
      }
    );
  }

  becomeNormal() {
    SectionPopup.tmpGlobal = this.getId();

    const {
      meta: { globalBlockId },
      onChange
    } = this.props;
    const globalBlocks = globalBlocksAssembled2Selector(getStore().getState());

    const globalsData = stripIds(globalBlocks[globalBlockId]).data;
    globalsData.value._id = this.getId();

    onChange(globalsData, {
      intent: "replace_all",
      idOptions: {
        keepExistingIds: true
      }
    });
  }
}

export default SectionPopup;
