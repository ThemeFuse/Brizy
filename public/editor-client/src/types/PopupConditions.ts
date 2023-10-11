import { Response } from "./Response";

export interface Rule {
  type: string;
  appliedFor: number;
  entityType: string;
  mode: "reference" | "specific";
  entityValues: Array<string>;
}

export interface Extra {
  rules: Array<Rule>;
  dataVersion: number;
}

export interface PopupConditions {
  conditions?: {
    save: (
      res: Response<Array<Rule>>,
      rej: Response<string>,
      extra: Extra
    ) => void;
  };
}
