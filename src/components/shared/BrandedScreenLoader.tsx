import Image from "next/image";

import { cn } from "@/src/lib/utils";

type BrandedScreenLoaderProps = {
    message?: string;
    fullScreen?: boolean;
    className?: string;
};

export default function BrandedScreenLoader({
    message = "Loading...",
    fullScreen = true,
    className,
}: BrandedScreenLoaderProps) {
    return (
        <div
            className={cn(
                "flex w-full flex-col items-center justify-center gap-4",
                fullScreen ? "min-h-screen px-6 py-12" : "min-h-[40vh] px-6 py-12",
                className,
            )}
        >
            <div className="relative flex size-28 items-center justify-center rounded-full bg-[#081c1a] shadow-[0_24px_80px_-40px_rgba(8,28,26,0.9)]">
                <div className="absolute inset-0 rounded-full border border-[#d7ba6a]/45 animate-ping" />
                <Image
                    src="/android-chrome-192x192.png"
                    alt="TorchLife"
                    width={96}
                    height={96}
                    className="h-24 w-24 animate-pulse object-contain"
                    priority
                />
            </div>
            <p className="text-center text-sm font-medium text-[#556a66]">{message}</p>
        </div>
    );
}
