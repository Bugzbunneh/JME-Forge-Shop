const PALETTES = [
  ["#3f3a36", "#8a7f74"],
  ["#2e2a28", "#a97142"],
  ["#33312e", "#7c8a94"],
  ["#3a2f2a", "#b08d57"],
  ["#2a2d2e", "#9aa5ab"],
];

const hashSeed = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

interface PlaceholderImageProps {
  seed: string;
  className?: string;
}

const PlaceholderImage = ({ seed, className }: PlaceholderImageProps) => {
  const hash = hashSeed(seed);
  const [from, to] = PALETTES[hash % PALETTES.length];
  const gradientId = `forge-gradient-${hash}`;

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Placeholder product photo"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${gradientId})`} />
      <g opacity="0.55" stroke="#f5f1ea" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M120 260 L200 150 L280 260" />
        <circle cx="200" cy="150" r="14" fill="#f5f1ea" stroke="none" />
        <path d="M140 260 L260 260" />
      </g>
    </svg>
  );
};

export default PlaceholderImage;
