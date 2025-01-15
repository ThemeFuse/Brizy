import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import SelectOptgroup from "visual/component/Controls/Select/SelectOptgroup";
import { t } from "visual/utils/i18n";

const SEARCH_ENGINES = {
  search_engines: "Any Search Engine",
  bing: "Bing",
  yandex: "Yandex",
  yahoo: "Yahoo",
  baidu: "Baidu",
  "so.com": "So.com",
  "360.cn": "360.cn",
  aol: "AOL",
  duckduckgo: "DuckDuckGo",
  "ask.com": "Ask.com",
  "mail.ru": "Mail.ru",
  sogou: "Sogou"
};

const SOCIAL_NETWORKS = {
  social_networks: "Any Social Networks",
  facebook: "Facebook",
  pinterest: "Pinterest",
  twitter: "Twitter",
  linkedin: "LinkedIn"
};

const getOther = () => ({
  external: t("External Links"),
  internal: t("Internal Links")
});

export default function Referrer(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.value}
        onChange={(value) => onChange({ ...triggerValue, value })}
      >
        <SelectItem key="show" value="show" title={t("Show")}>
          {t("Show")}
        </SelectItem>
        <SelectItem key="hide" value="hide" title={t("Hide")}>
          {t("Hide")}
        </SelectItem>
        <SelectItem key="regex" value="regex" title={t("Regex")}>
          {t("Regex")}
        </SelectItem>
        <SelectItem key="source" value="source" title={t("Source")}>
          {t("Source")}
        </SelectItem>
      </Select>
      {triggerValue.value === "source" ? (
        [
          <Select
            key="type"
            className="brz-control__select--light"
            itemHeight={30}
            defaultValue={triggerValue.type}
            onChange={(type) => onChange({ ...triggerValue, type })}
          >
            <SelectItem key="is" value="is" title={t("is")}>
              {t("is")}
            </SelectItem>
            <SelectItem key="is not" value="is not" title={t("is not")}>
              {t("is not")}
            </SelectItem>
          </Select>,
          <Select
            className="brz-control__select--light"
            key="source"
            itemHeight={30}
            defaultValue={triggerValue.source}
            onChange={(value) => onChange({ ...triggerValue, source: value })}
          >
            <SelectOptgroup
              key="Organic"
              title={t("Organic")}
              items={renderSelectChoices(SEARCH_ENGINES)}
            >
              <span className="brz-span">Organic</span>
            </SelectOptgroup>
            <SelectOptgroup
              key="Social Networks"
              title={t("Social Networks")}
              items={renderSelectChoices(SOCIAL_NETWORKS)}
            >
              <span className="brz-span">Networks</span>
            </SelectOptgroup>
            <SelectOptgroup
              key="Other"
              title={t("Other")}
              items={renderSelectChoices(getOther())}
            >
              <span className="brz-span">Other</span>
            </SelectOptgroup>
          </Select>
        ]
      ) : (
        <div className="brz-control__select">
          <input
            className="brz-input"
            type="text"
            placeholder={t("URL")}
            value={triggerValue.url}
            onChange={({ target: { value } }) =>
              onChange({ ...triggerValue, url: value })
            }
          />
        </div>
      )}
    </React.Fragment>
  );

  function renderSelectChoices(items) {
    return Object.entries(items).map(([key, value]) => (
      <SelectItem key={key} value={key}>
        {value}
      </SelectItem>
    ));
  }
}
