export const dVariants = [2, 4, 6, 20] as const;

export type DVariant = (typeof dVariants)[number];
