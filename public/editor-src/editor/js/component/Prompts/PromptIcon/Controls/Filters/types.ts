import { Literal } from "visual/utils/types/Literal";

interface Item {
  id: Literal;
  title: string;
}

export interface Props {
  categoryId: Literal;
  search: string;
  categories: Item[];
  onSelectChange: (id: Literal) => void;
  onInputChange: (value: string) => void;
}
