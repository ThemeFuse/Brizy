interface Family {
  id: string;
  name: string;
  slug: string;
  css_names: string[];
  variations: string[];
}

export interface KitData {
  kit: {
    id: string;
    families: Family[];
  };
}

interface Font {
  id: string;
  family: string;
  category: string;
  kind: string;
  subsets: string[];
  variants: string[];
}

export interface Fonts {
  kit: {
    id: string;
    families: Font[];
  };
}
