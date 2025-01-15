interface Props {
  isWP: boolean;
  changeTemplateUrl: string;
  currentTemplate: string;
  templates: { id: string; title: string }[];
  featuredImage: {
    id: number;
    pointX: string;
    pointY: string;
    url: string;
  };
  page: string;
}

export interface TemplateProps {
  isWP: boolean;
  changeTemplateUrl: string;
  currentTemplate: string;
  templates: { id: string; title: string }[];
}

export interface FeaturedImageProps {
  featuredImage: {
    id: number;
    pointX: string;
    pointY: string;
    url: string;
  };
  page: string;
}

type EmptyObject = Record<string, never>;

interface GetFeaturedImageProps extends FeaturedImageProps {
  type: "featuredImage";
  props: FeaturedImageProps;
}

type GetTemplateProps = {
  type: "template";
  props: TemplateProps;
};

const getTemplateProps = (props: Props): GetTemplateProps["props"] => ({
  isWP: props.isWP,
  changeTemplateUrl: props.changeTemplateUrl,
  currentTemplate: props.currentTemplate,
  templates: props.templates
});

const getFeaturedImageProps = (
  props: Props
): GetFeaturedImageProps["props"] => ({
  featuredImage: props.featuredImage,
  page: props.page
});

type SpecificProps = GetTemplateProps | GetFeaturedImageProps;

type ReturnTypeFor<T extends SpecificProps["type"]> =
  T extends SpecificProps["type"]
    ? Extract<SpecificProps, { type: T }>["props"]
    : EmptyObject;

export const getSpecificProps = <T extends SpecificProps["type"]>(
  type: T,
  props: Props
): ReturnTypeFor<T> => {
  switch (type) {
    case "template":
      return getTemplateProps(props) as ReturnTypeFor<T>;
    case "featuredImage":
      return getFeaturedImageProps(props) as ReturnTypeFor<T>;
    default:
      return {} as ReturnTypeFor<T>;
  }
};
