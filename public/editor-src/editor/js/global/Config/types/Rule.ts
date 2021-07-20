export interface Rule {
  type?: 1 | 2;
  entityType: string;
  group: number;
  values: string[];
}
