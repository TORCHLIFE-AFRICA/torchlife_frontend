import Image from "next/image";

import { SITE_PHOTOS } from "../../site-photos";
import { VisualBackdrop } from "./primitives";

const nodes = [
  { label: "Mothers", photo: SITE_PHOTOS.motherPortrait, position: "center 30%" },
  { label: "Hospitals", photo: SITE_PHOTOS.nursePortrait, position: "center 30%" },
  { label: "Supporters", photo: SITE_PHOTOS.supportersPhone, position: "center 30%" },
  { label: "Organizations", photo: SITE_PHOTOS.organizationPortrait, position: "65% 30%" },
  { label: "Communities", photo: SITE_PHOTOS.communityGathering, position: "center 40%" },
  { label: "Partners", photo: SITE_PHOTOS.partnersHandshake, position: "center" },
] as const;

const RADIUS = 38;

/** Even distribution around the hub, starting at the top. */
const nodePositions = nodes.map((node, index) => {
  const angle = (-90 + index * (360 / nodes.length)) * (Math.PI / 180);

  return {
    ...node,
    x: 50 + RADIUS * Math.cos(angle),
    y: 50 + RADIUS * Math.sin(angle),
  };
});

/**
 * Card 5 — TorchLife as the hub connecting every group in the care network,
 * each node a real person rather than an icon.
 */
export function CommunityNetworkVisual() {
  return (
    <>
      <VisualBackdrop className="left-[80px] top-[30px] h-[480px] w-[480px] rounded-full" />

      <div className="absolute left-[90px] top-[40px] size-[460px]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          {nodePositions.map((node) => (
            <line
              key={node.label}
              x1="50"
              y1="50"
              x2={node.x}
              y2={node.y}
              stroke="#0f766e"
              strokeOpacity="0.35"
              strokeWidth="0.4"
              strokeDasharray="1.6 1.2"
            />
          ))}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="#0f766e"
            strokeOpacity="0.16"
            strokeWidth="0.3"
          />
        </svg>

        {/* Hub */}
        <div className="absolute left-1/2 top-1/2 grid size-[108px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#0f766e] shadow-[0_22px_50px_-18px_rgba(15,118,110,0.85)] ring-8 ring-white/70">
          <span className="text-sm font-semibold text-white">TorchLife</span>
        </div>

        {nodePositions.map((node, index) => (
          <div
            key={node.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div
              className="landing-chip-float flex w-28 flex-col items-center gap-1.5"
              style={{ animationDelay: `${index * 0.7}s` }}
            >
              <div className="relative size-16 overflow-hidden rounded-full bg-white ring-4 ring-white shadow-[0_14px_30px_-14px_rgba(8,28,25,0.65)]">
                <Image
                  src={node.photo}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                  style={{ objectPosition: node.position }}
                />
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[0.66rem] font-semibold text-[#27413d] shadow-sm">
                {node.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
