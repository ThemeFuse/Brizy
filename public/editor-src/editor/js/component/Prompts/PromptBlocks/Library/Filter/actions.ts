import { Choices } from "./types";

//#region Init

interface Init {
  type: "Init";
  payload: {
    loading: boolean;
  };
}

export const init = (payload: Init["payload"]): Init => ({
  type: "Init",
  payload
});

//#endregion

//#region FetchSuccess

interface FetchSuccess {
  type: "FetchSuccess";
  payload: Choices;
}

export const fetchSuccess = (
  payload: FetchSuccess["payload"]
): FetchSuccess => ({
  type: "FetchSuccess",
  payload
});

//#endregion

//#region FetchError

interface FetchError {
  type: "FetchError";
  payload: string;
}

export const fetchError = (payload: FetchError["payload"]): FetchError => ({
  type: "FetchError",
  payload
});

//#endregion

export type Actions = Init | FetchSuccess | FetchError;
