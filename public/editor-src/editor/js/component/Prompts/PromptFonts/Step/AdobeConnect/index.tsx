import React, { JSX, useCallback, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { Description } from "./components/Description";
import { Items } from "./components/Items";
import { apiKeys, getDefaultValue } from "./utils";
import { isAdobeConnectData } from "../types";
import { adobeConnectReader } from "../utils";
import { BaseIntegrationContext } from "visual/component/Prompts/common/GlobalApps/type";
import { PromptView } from "visual/component/Prompts/common/PromptView";
import Config from "visual/global/Config";
import { addFonts } from "visual/redux/actions2";
import { pendingRequest } from "visual/utils/api";
import { addAdobeFonts } from "visual/utils/api/common";
import { getAdobeFonts } from "visual/utils/api/index.wp";
import { t } from "visual/utils/i18n";
import { Context } from "../../../common/GlobalApps/Context";
import { OnBeforeLoadProps, Typekit } from "./types";

const AdobeConnect = (): JSX.Element => {
  const { app, onChangePrev, onChangeNext } = useContext(Context);
  const { title = "", img = "" } = isAdobeConnectData(app)
    ? adobeConnectReader(app)
    : {};

  const dispatch = useDispatch();

  const [apiKeyValue, setApiKeyValue] = useState(getDefaultValue());
  const [nextLoading, setNextLoading] = useState(false);
  const [prevLoading, setPrevLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleChange = useCallback(
    (value: string, type: string) => {
      setApiKeyValue((prevState) => ({
        ...prevState,
        [type]: value.trim()
      }));
    },
    [setApiKeyValue]
  );

  const handleNext = useCallback(async () => {
    try {
      const typekit = apiKeyValue.typekit;
      const config = Config.getAll();
      const keysValue = Object.values(apiKeyValue);

      setNextLoading(true);

      const { status } = await addAdobeFonts(config, {
        group: "adobe",
        key: typekit
      });

      if (status !== 200) {
        setNextLoading(false);
        setError(t("Something went wrong when creating an account"));
      } else {
        const result = await getAdobeFonts(config);

        const fonts = result.kit.families;
        const adobeKitId = result.kit.id;

        if (keysValue.some((key) => !key)) {
          setNextLoading(false);
          setError(t("Field is empty"));
        } else {
          dispatch(
            addFonts([
              {
                type: "adobe",
                id: adobeKitId,
                fonts: fonts
              }
            ])
          );
          onChangeNext("done");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setNextLoading(false);
      setError(t("An unexpected error occurred"));
    }
  }, [apiKeyValue, dispatch, setNextLoading, setError, onChangeNext]);

  const handlePrev = useCallback(async () => {
    setPrevLoading(true);
    await pendingRequest();
    onChangePrev("appList");
  }, [setPrevLoading, onChangePrev]);

  const data = apiKeys.map(({ title, name }) => ({
    title,
    name,
    value: apiKeyValue[name as keyof Typekit]
  }));

  return (
    <PromptView
      img={img}
      title={title}
      error={error}
      description={
        <Description>
          <div>
            {t(
              "Manage the fonts that will be imported here by adding or removing them to the kit, in your Adobe account."
            )}
          </div>
        </Description>
      }
      isSaving={nextLoading}
      isCanceling={prevLoading}
      onClickSave={handleNext}
      onClickCancel={handlePrev}
    >
      <Items data={data} onChange={handleChange} />
    </PromptView>
  );
};

AdobeConnect.onBeforeLoad = (
  context: BaseIntegrationContext,
  props: OnBeforeLoadProps
) => {
  if (context.app.data) {
    props.onChangeNext("disconnect");
  }
};
export default AdobeConnect;
