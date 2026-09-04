import { quoteCopy } from '../../data/siteContent';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const ratio = Math.min(1, Math.max(0, current / total));

  return (
    <div className="progress">
      <div className="progress__meta">
        <span className="progress__step">{quoteCopy.stepLabel(current, total)}</span>
        <span className="progress__percent">{Math.round(ratio * 100)}%</span>
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={quoteCopy.stepLabel(current, total)}
      >
        <div className="progress__fill" style={{ transform: `scaleX(${ratio})` }} />
      </div>
    </div>
  );
}
