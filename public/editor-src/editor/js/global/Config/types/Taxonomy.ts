export type Taxonomy = {
  id: string;
  label: string;
  name: string;
  terms?: Taxonomy[];
};
