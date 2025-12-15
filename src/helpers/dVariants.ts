export const dVariants = [2, 4, 6, 8, 10, 12, 20] as const;

export type DVariant = (typeof dVariants)[number];
