export interface WithToken {
  __type: "withToken";
  uri: string;
  token: string;
}

export interface WithoutToken {
  __type: "withOutToken";
  uri: string;
}

export type Authorize = WithToken | WithoutToken;
