// When types for Config will be implemented remove this file

export type Config = {
  wp: {
    page: number;
    isTemplate: boolean;
    ruleMatches: {
      type: 1 | 2;
      group: number;
      entityType: string;
      values: number[];
    }[];
  };
};
