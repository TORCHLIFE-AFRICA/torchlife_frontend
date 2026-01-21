import {
  CloudinaryOptions,
  useCloudinaryImage,
} from "@/src/hooks/cloudinaryHook";
import Image from "next/image";

type Props = {
  publicId: string;
  alt: string;
  options?: CloudinaryOptions;
  priority?: boolean;
  className?: string;
};

export function CloudinaryImage({
  publicId,
  alt,
  options,
  priority = false,
  className,
}: Props) {
  const src = useCloudinaryImage(publicId, options);

  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={options?.width ?? 800}
      height={options?.height ?? 600}
      priority={priority}
      className={className}
    />
  );
}
