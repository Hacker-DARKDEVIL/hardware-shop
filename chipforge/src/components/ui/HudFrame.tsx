type Corner = "tl" | "tr" | "bl" | "br";

interface HudFrameProps {
  corner: Corner;
  size?: number;
  className?: string;
}

const PATHS: Record<Corner, string> = {
  tl: "M1 14V1h13",
  tr: "M27 14V1H14",
  bl: "M1 14v13h13",
  br: "M27 14v13H14",
};

export function HudFrame({ corner, size = 28, className = "" }: HudFrameProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <path d={PATHS[corner]} />
    </svg>
  );
}
