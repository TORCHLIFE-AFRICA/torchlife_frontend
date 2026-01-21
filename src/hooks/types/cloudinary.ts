export type ImageContent = {
  id: string;
  title: string;
  description: string;
  publicId: string;
  image: {
    width: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "thumb";
    quality?: number | "auto";
    format?: "auto" | "webp" | "avif";
  };
};
