"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

import { SITE_PHOTOS } from "../site-photos";

const youtubeChannelUrl = process.env.NEXT_PUBLIC_TORCHLIFE_YOUTUBE_URL?.trim();
const youtubeEmbedUrl = process.env.NEXT_PUBLIC_TORCHLIFE_YOUTUBE_EMBED_URL?.trim();

/** Accepts an embed, watch, or youtu.be URL and returns a privacy-mode embed. */
function resolveYoutubeEmbedUrl() {
  const source = youtubeEmbedUrl || youtubeChannelUrl || "";

  if (!source) return "";

  if (source.includes("/embed/")) {
    return source;
  }

  try {
    const url = new URL(source);
    const videoId = url.searchParams.get("v");

    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }

    if (url.hostname === "youtu.be") {
      const shortId = url.pathname.replace("/", "").trim();
      if (shortId) {
        return `https://www.youtube-nocookie.com/embed/${shortId}`;
      }
    }
  } catch {
    return "";
  }

  return "";
}

/** Autoplay is safe here because the frame is only mounted after a click. */
function withPlaybackParams(url: string) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("autoplay", "1");
    parsed.searchParams.set("rel", "0");
    return parsed.toString();
  } catch {
    return url;
  }
}

const embedUrl = resolveYoutubeEmbedUrl();

/**
 * A poster that stands in for the player until the visitor asks for it, so the
 * page never pays for YouTube's frame on load. The overlay names the film, not
 * a patient: the photograph is captioned by role, per the rule in
 * `site-photos.ts`.
 */
export function StoryVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/70 p-2 shadow-[0_40px_120px_-52px_rgba(10,30,28,0.45)] sm:rounded-[2rem] sm:p-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-[1.1rem] bg-[#0a1f1d] sm:rounded-[1.6rem]">
        {isPlaying && embedUrl ? (
          <iframe
            src={withPlaybackParams(embedUrl)}
            title="The TorchLife story"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={SITE_PHOTOS.motherAndBaby}
              alt="A mother holding her newborn after care"
              fill
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover"
            />
            {/* Keeps the wordmark and the caption legible over any frame. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(105deg,rgba(7,28,26,0.86)_0%,rgba(7,28,26,0.62)_42%,rgba(7,28,26,0.18)_72%,rgba(7,28,26,0.35)_100%)]"
            />

            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 shadow-sm sm:left-6 sm:top-6">
              <Image
                src="/torchlife-logo.png"
                alt=""
                width={20}
                height={20}
                className="size-5 object-contain"
              />
              <span className="text-xs font-semibold tracking-tight text-[#132726]">
                TorchLife
              </span>
            </div>

            <div className="absolute inset-x-4 bottom-4 max-w-md text-white sm:inset-x-8 sm:bottom-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e2c987] sm:text-xs">
                Our story
              </p>
              <p className="mt-1.5 text-2xl font-semibold leading-[1.05] tracking-tight sm:mt-3 sm:text-4xl lg:text-5xl">
                The TorchLife Story
              </p>
              <p className="mt-2 hidden text-sm leading-6 text-white/75 sm:mt-3 sm:block">
                How verified cases, hospitals, and supporters come together to make
                pregnancy care possible.
              </p>
            </div>

            {embedUrl ? (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                aria-label="Play the TorchLife story"
                className="group absolute inset-0 grid place-items-center focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white"
              >
                <span className="grid size-14 place-items-center rounded-full bg-white/95 shadow-[0_18px_45px_-18px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:size-[4.5rem]">
                  <Play className="size-6 translate-x-[2px] fill-[#0f766e] text-[#0f766e] sm:size-7" />
                </span>
              </button>
            ) : (
              <p className="absolute inset-x-4 top-1/2 mx-auto max-w-sm -translate-y-1/2 rounded-2xl bg-[#071c1a]/85 px-4 py-3 text-center text-xs leading-5 text-white/80 sm:inset-x-8">
                Set <code>NEXT_PUBLIC_TORCHLIFE_YOUTUBE_EMBED_URL</code> to a YouTube
                watch or embed link to make this story playable.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
