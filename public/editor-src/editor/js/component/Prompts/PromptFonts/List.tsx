import React, {
  useCallback,
  useMemo,
  useState,
  ReactElement,
  MouseEvent
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Scrollbars from "react-custom-scrollbars";
import classNames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { pendingRequest } from "visual/utils/api";
import { fontTransform } from "visual/utils/fonts";
import {
  defaultFontSelector,
  unDeletedFontsSelector
} from "visual/redux/selectors";
import { deleteFont, updateDefaultFont } from "visual/redux/actions2";
import { deleteFont as apiDeleteFont } from "./api";
import { sortFonts } from "./utils";
import { FontTypes } from "./types";
import { Font, UploadedFont } from "visual/types";
import { t } from "visual/utils/i18n";

export const List = (): ReactElement => {
  const [loading, setLoading] = useState("");
  const fonts = useSelector(unDeletedFontsSelector);
  const defaultFont = useSelector(defaultFontSelector);
  const dispatch = useDispatch();

  const handleUpdate = useCallback((fontId: string): void => {
    dispatch(updateDefaultFont(fontId));
  }, []);

  const handleDelete = useCallback(async (type: FontTypes, font: Font): Promise<
    void
  > => {
    setLoading(font.brizyId);

    if (type === "upload") {
      await apiDeleteFont((font as UploadedFont).id);
    } else {
      await pendingRequest();
    }

    setLoading("");

    dispatch(
      deleteFont({
        type,
        fonts: [font]
      })
    );
  }, []);

  const sorted = useMemo(() => {
    return sortFonts(fonts);
  }, [fonts]);

  return (
    <Scrollbars>
      <div className="brz-ed-popup-fonts__lists brz-d-xs-flex brz-flex-xs-wrap">
        {sorted.map(({ fontGroupType, ...font }) => {
          const { id, brizyId, title, family } = fontTransform[fontGroupType](
            font
          );
          const isDefaultFont = defaultFont === id;
          const isLoading = loading === brizyId;
          const className = classNames(
            "brz-ed-popup-fonts__item",
            isDefaultFont && "brz-ed-popup-fonts__item--selected"
          );

          return (
            <div key={brizyId} className={className}>
              <div
                className="brz-ed-popup-fonts__item-logo"
                style={{
                  fontFamily: family
                }}
                onClick={(): void => {
                  handleUpdate(id);
                }}
              >
                Aa
                {!isDefaultFont && !isLoading && (
                  <div
                    className="brz-ed-badge__delete brz-ed-popup-fonts__delete"
                    onClick={(e: MouseEvent<HTMLDivElement>): void => {
                      e.stopPropagation();
                      handleDelete(fontGroupType, font);
                    }}
                  >
                    <EditorIcon icon="nc-trash" />
                  </div>
                )}
              </div>
              <div className="brz-ed-popup-fonts__item-title">{title}</div>

              {isLoading && (
                <span className="brz-span brz-ed-popup-integrations__app-icon">
                  <EditorIcon
                    icon="nc-circle-02"
                    className="brz-ed-animated--spin"
                  />
                </span>
              )}
              {isDefaultFont && !isLoading && (
                <span
                  title={t("Default font (can’t be deleted)")}
                  className="brz-span brz-ed-popup-integrations__app-icon"
                >
                  <EditorIcon icon="nc-check-small" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Scrollbars>
  );
};
