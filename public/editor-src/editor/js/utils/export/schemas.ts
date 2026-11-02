import { z } from "zod";

/** The responsive breakpoints a compiled slider carries in `data-responsive`. */
export const breakpointsSchema = z.array(
  z.object({
    breakpoint: z.number(),
    settings: z.object({
      slidesToShow: z.union([z.number(), z.string()]).optional(),
      slidesToScroll: z.number().optional(),
      centerPadding: z.string().optional(),
      speed: z.number().optional()
    })
  })
);

// A `data-*` value the slider reads; missing or unexpected is `undefined`.
const loose = <T>(schema: z.ZodType<T>) => schema.optional().catch(undefined);

/** What the Section, Story and Carousel sliders read from the `data-*` attributes of their root. */
export const sliderDataSchema = z.object({
  slidesToShow: loose(z.number()),
  slidesToScroll: loose(z.number()),
  dots: loose(z.boolean()),
  dotsClass: loose(z.string()),
  arrows: loose(z.boolean()),
  fade: loose(z.boolean()),
  vertical: loose(z.boolean()),
  autoPlay: loose(z.boolean()),
  autoPlaySpeed: loose(z.number()),
  swipe: loose(z.boolean()),
  animationSpeed: loose(z.number()),
  speed: loose(z.number()),
  centerMode: loose(z.boolean()),
  centerPadding: loose(z.string()),
  variableWidth: loose(z.boolean()),
  focusOnSelect: loose(z.boolean()),
  touchThreshold: loose(z.number()),
  sliderLoop: loose(z.boolean()),
  lazyLoad: loose(z.literal("ondemand")),
  responsive: z.unknown(),
  transitionSpeed: z.unknown()
});

export type SliderData = z.infer<typeof sliderDataSchema>;
