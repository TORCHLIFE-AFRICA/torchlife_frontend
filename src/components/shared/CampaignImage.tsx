"use client";

import { cn } from "@/src/lib/utils";

type CampaignImageProps = {
    src?: string | null;
    alt: string;
    wrapperClassName?: string;
    imageClassName?: string;
    loading?: "eager" | "lazy";
    showFallbackBranding?: boolean;
};

const fallbackCampaignImage = "/mustafa-omar-tEz8JU1j-00-unsplash.jpg";

export function CampaignImage({
    src,
    alt,
    wrapperClassName,
    imageClassName,
    loading = "lazy",
    showFallbackBranding = true,
}: CampaignImageProps) {
    const resolvedSrc = src?.trim() || fallbackCampaignImage;
    const isFallbackImage = !src?.trim();

    return (
        <div className={cn("relative overflow-hidden", wrapperClassName)}>
            <img
                src={resolvedSrc}
                alt={alt}
                loading={loading}
                className={cn("h-full w-full object-cover", imageClassName)}
            />

            {isFallbackImage && showFallbackBranding ? (
                <>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,28,26,0.14)_0%,rgba(15,118,110,0.24)_100%)]" />
                    <div
                        className="absolute inset-0 opacity-[0.16]"
                        style={{
                            backgroundImage: "url('/torchlife-logo.png')",
                            backgroundRepeat: "repeat",
                            backgroundSize: "68px auto",
                            backgroundPosition: "center",
                        }}
                    />
                </>
            ) : null}
        </div>
    );
}
