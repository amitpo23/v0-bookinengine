import { cn } from '@/lib/utils';

// Progress bar constants
const CIRCLE_RADIUS = 45;
const PERCENTAGE_MULTIPLIER = 100;
const PROGRESS_THRESHOLD = 90;

type AnimatedCircularProgressBarProps = {
  max?: number;
  min?: number;
  value: number;
  gaugePrimaryColor: string;
  gaugeSecondaryColor: string;
  className?: string;
};

// Background circle component for progress values under threshold
function BackgroundCircle({
  currentPercent,
  gaugeSecondaryColor,
}: {
  currentPercent: number;
  gaugeSecondaryColor: string;
}) {
  if (currentPercent > PROGRESS_THRESHOLD || currentPercent < 0) {
    return null;
  }

  return (
    <circle
      className="opacity-100"
      cx="50"
      cy="50"
      r="45"
      strokeDashoffset="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="10"
      style={
        {
          stroke: gaugeSecondaryColor,
          '--stroke-percent': PROGRESS_THRESHOLD - currentPercent,
          '--offset-factor-secondary': 'calc(1 - var(--offset-factor))',
          strokeDasharray:
            'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
          transform:
            'rotate(calc(1turn - 90deg - (var(--gap-percent) * var(--percent-to-deg) * var(--offset-factor-secondary)))) scaleY(-1)',
          transition: 'all var(--transition-length) ease var(--delay)',
          transformOrigin:
            'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
        } as React.CSSProperties
      }
    />
  );
}

// Primary progress circle component
function ProgressCircle({
  currentPercent,
  gaugePrimaryColor,
}: {
  currentPercent: number;
  gaugePrimaryColor: string;
}) {
  return (
    <circle
      className="opacity-100"
      cx="50"
      cy="50"
      r="45"
      strokeDashoffset="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="10"
      style={
        {
          stroke: gaugePrimaryColor,
          '--stroke-percent': currentPercent,
          strokeDasharray:
            'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
          transition:
            'var(--transition-length) ease var(--delay),stroke var(--transition-length) ease var(--delay)',
          transitionProperty: 'stroke-dasharray,transform',
          transform:
            'rotate(calc(-90deg + var(--gap-percent) * var(--offset-factor) * var(--percent-to-deg)))',
          transformOrigin:
            'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
        } as React.CSSProperties
      }
    />
  );
}

export function AnimatedCircularProgressBar({
  max = 100,
  min = 0,
  value = 0,
  gaugePrimaryColor,
  gaugeSecondaryColor,
  className,
}: AnimatedCircularProgressBarProps) {
  const circumference = 2 * Math.PI * CIRCLE_RADIUS;
  const percentPx = circumference / PERCENTAGE_MULTIPLIER;
  const currentPercent = Math.round(
    ((value - min) / (max - min)) * PERCENTAGE_MULTIPLIER
  );

  return (
    <div
      className={cn('relative size-40 font-semibold text-2xl', className)}
      style={
        {
          '--circle-size': '100px',
          '--circumference': circumference,
          '--percent-to-px': `${percentPx}px`,
          '--gap-percent': '5',
          '--offset-factor': '0',
          '--transition-length': '1s',
          '--transition-step': '200ms',
          '--delay': '0s',
          '--percent-to-deg': '3.6deg',
          transform: 'translateZ(0)',
        } as React.CSSProperties
      }
    >
      <svg
        aria-label={`Progress: ${currentPercent}% complete`}
        className="size-full"
        fill="none"
        role="img"
        strokeWidth="2"
        viewBox="0 0 100 100"
      >
        <title>Progress indicator showing {currentPercent}% completion</title>
        <BackgroundCircle
          currentPercent={currentPercent}
          gaugeSecondaryColor={gaugeSecondaryColor}
        />
        <ProgressCircle
          currentPercent={currentPercent}
          gaugePrimaryColor={gaugePrimaryColor}
        />
      </svg>
      <span
        className="fade-in absolute inset-0 m-auto size-fit animate-in delay-[var(--delay)] duration-[var(--transition-length)] ease-linear"
        data-current-value={currentPercent}
      >
        {currentPercent}
      </span>
    </div>
  );
}
