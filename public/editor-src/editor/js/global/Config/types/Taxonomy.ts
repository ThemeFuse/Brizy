type SelectChoices = {
  title: string;
  value?: string;
  optgroup?: SelectChoices[];
};

export type Taxonomy = {
  id: string;
  label: string;
  name: string;
  terms?: Taxonomy[];
};
