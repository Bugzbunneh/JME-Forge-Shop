interface IconProps {
  className?: string;
}

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const HeartIcon = ({ className, filled }: IconProps & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path
      d="M12 20.5s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.7a4.2 4.2 0 0 1 7.5 2.5c0 5.7-7.5 10.3-7.5 10.3Z"
      fill={filled ? "currentColor" : "none"}
    />
  </svg>
);

export const SearchIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const MenuIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const ArrowRightIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M12 20V5M6 11l6-6 6 6" />
  </svg>
);

export const ChevronLeftIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="m15 5-7 7 7 7" />
  </svg>
);

export const ChevronRightIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const ShareIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M12 15V4M8 8l4-4 4 4" />
    <path d="M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12" />
  </svg>
);

export const ExpandIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const EyeIcon = ({ className, crossed }: IconProps & { crossed?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
    {crossed && <path d="M4 4l16 16" />}
  </svg>
);

export const HammerIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M13.5 6.5 9 11M15 4l5 5-3 3-5-5 3-3ZM10.5 9.5 4 16a1.8 1.8 0 0 0 2.5 2.5L13 12" />
  </svg>
);

export const FlameIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M12 21c-3.9 0-6.5-2.6-6.5-6 0-2.6 1.6-4.4 3-6 .8-.9 1.5-2.2 1.5-4 2.5 1.2 4 3.5 4 6 1-.4 1.5-1.3 1.7-2.2 1.4 1.6 2.3 3.3 2.3 5.2 0 3.4-2.6 7-6 7Z" />
  </svg>
);

export const SparkIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
);

export const BladeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M20 4C12 5 7 9.5 5 17l2 2c7.5-2 12-7 13-15Z" />
    <path d="m5 19-2 2M9 15l4-4" />
  </svg>
);

export const LockIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </svg>
);

export const PinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
