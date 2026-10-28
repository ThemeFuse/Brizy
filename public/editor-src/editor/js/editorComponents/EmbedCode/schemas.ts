import { z } from "zod";
import { consentCategories } from "./types";

export const consentCategorySchema = z.enum(consentCategories);
