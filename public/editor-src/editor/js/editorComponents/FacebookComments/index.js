// 1. Nu functioneaza href si lang cu valori randont trebuei sa fie language si href corecta. In alte elemente FB merge
import classnames from "classnames";
import React from "react";
import Comments from "visual/component/Comments";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar, { hideToolbar } from "visual/component/Toolbar";
//import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { attachRefs } from "visual/utils/react";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as sidebarExtendConfig from "./sidebarExtend";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import * as toolbarExtendParentConfig from "./toolbarExtend";

class FacebookComments extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return "FacebookComments";
  }

  getAppDataEditor() {
    //const { social = [] } = Config.get("applications");
    //const facebook = social.find(({ service }) => service === "facebook");

    return {
      // appId: facebook && facebook.appid ? facebook.appid : "nick",

      // comments au nevoie obligatoriu de appId si lang si in editor noi nu avem replacer, cind o sa avem o sa schimbam

      appId: 113869198637480,
      href: "http://brizy.io",
      lang: "en_US"
    };
  }

  getAppDataPreview() {
    //const { social = [] } = Config.get("applications");
    //const facebook = social.find(({ service }) => service === "facebook");

    return {
      //appId: facebook && facebook.appid ? facebook.appid : "nick",

      // comments au nevoie obligatoriu de appId si lang si in editor noi nu avem replacer, cind o sa avem o sa schimbam

      appId: 113869198637480,
      href: makePlaceholder({
        content: "{{ brizy_dc_current_page_unique_url }}"
      }),
      lang: makePlaceholder({
        content: "{{ brizy_dc_page_language }}"
      })
    };
  }

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParentConfig,
      sidebarExtendConfig,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleValueChange(newValue, meta) {
    super.handleValueChange(newValue, meta);

    if (meta.patch.type) {
      hideToolbar();
    }
  }

  renderForEdit(v, vs, vd) {
    const {
      type,
      numPosts,
      darkScheme,
      targetUrl,
      href,
      disqusShortname,
      skin,
      review
    } = v;

    const appData = this.getAppDataEditor();
    const data = {
      facebook: {
        width: "100%",
        numPosts,
        colorScheme: darkScheme === "on" ? "dark" : "light",
        href: targetUrl === "custom" && href !== "" ? href : appData.href,
        lang: appData.lang
      },
      disqus: {
        shortname: disqusShortname,
        config: {
          url: targetUrl === "custom" && href !== "" ? href : appData.href,
          identifier:
            targetUrl === "custom" && href !== "" ? href : appData.href
        }
      },
      WPComments: { skin, review }
    };

    const className = classnames(
      "brz-comments",
      { "brz-fb-comments": type === "facebook" },
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
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <div
                className={className}
                ref={(el) => {
                  attachRefs(el, [toolbarRef, cssRef]);
                }}
              >
                <Comments
                  appId={appData.appId}
                  type={type}
                  data={data[type]}
                  config={this.getGlobalConfig()}
                  renderContext={this.props.renderContext}
                />
              </div>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const {
      type,
      numPosts,
      darkScheme,
      targetUrl,
      href,
      disqusShortname,
      skin
    } = v;

    const appData = this.getAppDataPreview();
    const data = {
      facebook: {
        "data-width": "100%",
        "data-numposts": numPosts,
        "data-colorscheme": darkScheme === "on" ? "dark" : "light",
        "data-href":
          targetUrl === "custom" && href !== "" ? href : appData.href,
        "data-lang": appData.lang
      },
      disqus: {
        "data-shortname": disqusShortname,
        "data-url": targetUrl === "custom" && href !== "" ? href : appData.href,
        "data-identifier":
          targetUrl === "custom" && href !== "" ? href : appData.href
      },
      WPComments: {
        limit: numPosts,
        skin,
        linkPage: targetUrl === "custom" && href !== "" ? href : appData.href
      }
    };

    const className = classnames(
      "brz-comments",
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
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={className}>
          <Comments
            appId={appData.appId}
            type={type}
            data={data[type]}
            config={this.getGlobalConfig()}
            renderContext={this.props.renderContext}
          />
        </div>
      </CustomCSS>
    );
  }
}

export default FacebookComments;
