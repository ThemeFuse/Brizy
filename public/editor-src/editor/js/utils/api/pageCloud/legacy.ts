/* eslint-disable @typescript-eslint/camelcase */
import Config from "visual/global/Config";
import { apiUrl, paginationData } from "visual/utils/api/const";
import { persistentRequest } from "visual/utils/api/index-legacy";
import {
  pageDataToString,
  parsePage,
  parseInternalPopup,
  stringifyPage
} from "visual/utils/api/adapter";
import { PageCloud, InternalPopupCloud, Rule } from "visual/types";
import { isNullish } from "visual/utils/value";

type CreatePageData = Pick<
  PageCloud,
  "status" | "dataVersion" | "is_index" | "project"
> & { data: string };
type PageMeta = Partial<{ is_autosave: 0 | 1 }>;

const getProjectId = (): number => Config.get("project").id;

export function getPages(): Promise<PageCloud[]> {
  const project = getProjectId();
  const requestData = {
    project,
    ...paginationData
  };

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: apiUrl + "/pages",
    data: requestData
  }).then(r => r.map(parsePage));
}

export function createPage(
  data: CreatePageData,
  meta: PageMeta = {}
): Promise<PageCloud> {
  const { is_autosave = 0 } = meta;
  const requestData = {
    ...data,
    is_autosave
  };

  return persistentRequest({
    type: "POST",
    dataType: "json",
    url: apiUrl + "/pages",
    data: requestData
  }).then(parsePage);
}

export function getPage(id: string): Promise<PageCloud> {
  return getPages()
    .then(ps => ps.find(p => p.id == id) ?? ps.find(p => p.is_index))
    .then(p => {
      if (isNullish(p)) {
        const indexPageData: CreatePageData = {
          project: getProjectId(),
          dataVersion: 1,
          is_index: 1,
          status: "draft",
          data: pageDataToString({
            items: []
          })
        };

        return createPage(indexPageData, { is_autosave: 0 });
      }

      return p;
    });
}

export function updatePage(
  page: PageCloud,
  meta: PageMeta = {}
): Promise<void> {
  const { id, data, dataVersion, status } = stringifyPage(page);
  const { is_autosave = 1 } = meta;
  const requestData = {
    data,
    dataVersion,
    status,
    is_autosave
  };

  return persistentRequest({
    type: "PUT",
    dataType: "json",
    url: apiUrl + "/pages/" + id,
    data: requestData
  });
}

export function deletePage(id: number): Promise<void> {
  return persistentRequest({
    type: "DELETE",
    dataType: "json",
    url: apiUrl + "/pages/" + id
  });
}

export function getInternalPopups(): Promise<InternalPopupCloud[]> {
  const project = Config.get("project").id;
  const requestData = {
    project,
    ...paginationData
  };

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: apiUrl + "/popups",
    data: requestData
  }).then(r => {
    return r.map(parseInternalPopup);
  });
}

export function getInternalPopup(id: string): Promise<InternalPopupCloud> {
  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: apiUrl + "/popups/" + id
  }).then(r => {
    return parseInternalPopup(r);
  });
}

export function updateInternalPopup(
  popup: InternalPopupCloud,
  meta: PageMeta = {}
): Promise<void> {
  const { id, data, dataVersion, status } = stringifyPage(popup);
  const { is_autosave = 1 } = meta;
  const requestData = {
    data,
    dataVersion,
    status,
    is_autosave
  };

  return persistentRequest({
    type: "PUT",
    dataType: "json",
    url: apiUrl + "/popups/" + id,
    data: requestData
  });
}

export function getRulesList(): Promise<Rule[]> {
  const project = Config.get("project").id;
  const popupId = Config.get("page").id;
  const requestData = {
    project
  };

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: apiUrl + "/popups/" + popupId,
    data: requestData
  }).then(({ rules }) => JSON.parse(rules));
}

export function updatePopupRules(popup: InternalPopupCloud): Promise<Rule[]> {
  // ! add smth. like PagePopup type later
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { rules, dataVersion, status } = stringifyPage(popup);
  const requestData = {
    rules: JSON.stringify(rules),
    dataVersion,
    status,
    is_autosave: 0
  };

  const popupId = Config.get("page").id;

  return persistentRequest({
    type: "PUT",
    dataType: "json",
    url: apiUrl + "/popups/" + popupId,
    data: requestData
  }).then(({ rules }) => rules);
}
