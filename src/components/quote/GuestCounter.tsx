import { useId } from 'react';
import { quoteCopy } from '../../data/siteContent';
import { clampGuests, MAX_GUESTS_PER_GROUP } from '../../lib/validation';

interface GuestCounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  autoFocus?: boolean;
}

export function GuestCounter({ label, value, onChange, autoFocus }: GuestCounterProps) {
  const id = useId();

  return (
    <div className="counter">
      <label className="counter__label" htmlFor={id}>
        {label}
      </label>
      <div className="counter__controls">
        <button
          type="button"
          className="counter__button"
          onClick={() => onChange(clampGuests(value - 1))}
          disabled={value <= 0}
          aria-label={`${quoteCopy.steps.guests.decrease} ${label.toLowerCase()}`}
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          id={id}
          className="counter__input"
          type="number"
          inputMode="numeric"
          min={0}
          max={MAX_GUESTS_PER_GROUP}
          step={1}
          value={String(value)}
          onChange={(event) => onChange(clampGuests(Number(event.target.value.replace(/\D+/g, ''))))}
          data-autofocus={autoFocus ? '' : undefined}
        />
        <button
          type="button"
          className="counter__button"
          onClick={() => onChange(clampGuests(value + 1))}
          disabled={value >= MAX_GUESTS_PER_GROUP}
          aria-label={`${quoteCopy.steps.guests.increase} ${label.toLowerCase()}`}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}
