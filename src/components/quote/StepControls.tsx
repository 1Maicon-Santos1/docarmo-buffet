import { quoteCopy } from '../../data/siteContent';

interface StepControlsProps {
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  nextLabel?: string;
}

export function StepControls({ onBack, onNext, canGoBack, nextLabel }: StepControlsProps) {
  return (
    <div className="wizard__controls">
      <button type="button" className="btn btn--ghost" onClick={onBack} disabled={!canGoBack}>
        <span aria-hidden="true">←</span>
        {quoteCopy.back}
      </button>
      <button type="button" className="btn btn--primary wizard__next" onClick={onNext}>
        {nextLabel ?? quoteCopy.next}
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
