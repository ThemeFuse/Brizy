import React, { ReactElement } from "react";
import { t } from "visual/utils/i18n";

export interface Props {
  search: string;
  message: string;
  src: string;
  size?: "small" | "large";
}

export const Empty = (props: Props): ReactElement => {
  const { message, src, search, size } = props;
  const style = {
    width: size === "large" ? "524px" : "322px"
  };

  return (
    <div className="brz-ed-popup-two-body__content brz-flex-xs-column">
      <div className="brz-ed-popup-two-blocks__grid brz-ed-popup-two-blocks__grid-clear">
        {search !== "" ? (
          <p className="brz-ed-popup-two-blocks__grid-clear-text">
            {t("Nothing here, please refine your search.")}
          </p>
        ) : (
          <>
            <p className="brz-ed-popup-two-blocks__grid-clear-text">
              {message}
            </p>
            <img
              style={style}
              src={src}
              className="brz-ed-popup-two-blocks__grid-clear-image-saved"
              alt="Global"
            />
          </>
        )}
      </div>
    </div>
  );
};
