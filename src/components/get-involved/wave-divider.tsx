interface WaveDividerProps {
  colorClassName?: string;
}

// Decorative curved transition out of the hero band, so the page reads as
// one designed surface instead of stacked rectangular sections. Fill color
// comes from `currentColor`, set via a Tailwind text-color class on the
// wrapper — matches the section immediately below the hero.
export function WaveDivider({ colorClassName = "text-background" }: WaveDividerProps) {
  return (
    <div
      aria-hidden
      className={`absolute bottom-0 left-0 right-0 leading-none pointer-events-none ${colorClassName}`}
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="w-full h-10 md:h-14"
      >
        <path
          fill="currentColor"
          d="M0,32 C240,64 480,0 720,16 C960,32 1200,64 1440,32 L1440,60 L0,60 Z"
        />
      </svg>
    </div>
  );
}
