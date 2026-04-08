import slugify from "slugify";
import Food from "../models/foodModel.ts";

export const generateUniqueSlug = async (text: string): Promise<string> => {
  let slug = slugify(text, { lower: true, trim: true, strict: true });
  let count = 1;
  let finalSlug = slug;

  while (await Food.findOne({ where: { slug: finalSlug } })) {
    finalSlug = `${slug}-${count}`;
    count++;
  }

  return finalSlug;
};
