import classNames from "classnames";
import { mPipe, match, pass } from "fp-utilities";
import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { useDispatch, useSelector } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import { getContext } from "visual/component/LeftSidebar/components/Cms/utils";
import Portal from "visual/component/Portal";
import Config, { Cloud } from "visual/global/Config";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { isWp } from "visual/global/Config/types/configs/WP";
import { updateUI } from "visual/redux/actions2";
import { uiSelector } from "visual/redux/selectors";
import { IS_PRO } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import * as Obj from "visual/utils/reader/object";
import Link from "../Options/types/Link";
import * as Base from "./types/Base";
import * as List from "./types/List";
import * as Messages from "./types/Messages";

export interface Props {
  config: Cloud;
}

const Component = ({ config }: Props): ReactElement => {
  const iframeSrc = config.cms.adminUrl;
  const ref = useRef<HTMLIFrameElement>(null);
  const leftSidebar = useSelector(uiSelector).leftSidebar;
  const opened =
    leftSidebar.drawerContentType === LeftSidebarOptionsIds.cms &&
    leftSidebar.isOpen;
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const dispatch = useDispatch();
  const update = useCallback(
    (isOpen) => {
      dispatch(
        updateUI("leftSidebar", {
          drawerContentType: isOpen ? LeftSidebarOptionsIds.cms : null,
          isOpen
        })
      );
    },
    [dispatch]
  );
  const onLinkClick = useCallback(
    (): void => update(!opened),
    [opened, update]
  );
  const onIframeMessage = useCallback(
    (e) => {
      mPipe(
        pass((e: MessageEvent) => iframeSrc.startsWith(e.origin)),
        Obj.readKey("data"),
        Obj.read,
        Base.fromObject,
        Messages.readInputMessage,
        (m) => {
          switch (m.type) {
            case "close":
              return update(false);
            case "redirect": {
              console.log("redirect", m.payload);
              if (TARGET === "Cloud") {
                window.parent.location.href = m.payload;
              } else if (TARGET === "Cloud-localhost") {
                const r = /editor\/(\w+)\/(\d+)$/;
                const [, mode, id] = r.exec(m.payload) ?? [];

                if (mode && id) {
                  const suffix = IS_PRO ? "?pro=true" : "";
                  window.parent.location.href = `/editor/${mode}/${id}${suffix}`;
                } else {
                  console.warn("could not parse url: ", m.payload);
                }
              }
              return;
            }
          }
        }
      )(e);
    },
    [iframeSrc, update]
  );

  useEffect(() => {
    if (opened && iframeLoaded) {
      const list = List.list(getContext(config));

      ref.current?.contentWindow?.postMessage(list, iframeSrc);
    }
  }, [opened, iframeLoaded, config, iframeSrc]);

  useEffect(() => {
    if (opened) {
      window.parent.addEventListener("message", onIframeMessage);
    }

    return (): void =>
      window.parent.removeEventListener("message", onIframeMessage);
  }, [opened, onIframeMessage]);

  return (
    <>
      <Link
        className={classNames({
          "brz-ed-sidebar__control__item": true,
          "brz-ed-sidebar__control__item--active": opened
        })}
        icon="nc-menu"
        title={t("CMS")}
        onClick={onLinkClick}
      />
      <Portal node={window.parent.document.body}>
        <div
          className="brz-cms__wrapper"
          style={{ display: opened ? "block" : "none" }}
        >
          <iframe
            ref={ref}
            src={iframeSrc}
            className={classNames("brz-iframe", "brz-cms", {
              "brz-loading": !iframeLoaded
            })}
            onLoad={(): void => setIframeLoaded(true)}
            title="cms"
          />
          {!iframeLoaded && (
            <div className="brz-cms--loading">
              <EditorIcon
                icon="nc-circle-02"
                className="brz-ed-animated--spin"
              />
            </div>
          )}
        </div>
      </Portal>
    </>
  );
};

const _Component = (): ReactNode => {
  const config = Config.getAll();
  const node = useCallback(getConfigComponent, []);

  return node(config);
};

export const Cms = {
  id: LeftSidebarOptionsIds.cms,
  type: "custom",
  Component: _Component
};

const getConfigComponent = match(
  [isWp, () => null],
  [isCloud, (config) => <Component config={config} />]
);
