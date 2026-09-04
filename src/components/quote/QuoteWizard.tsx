import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  eventTypeOptions,
  interestOptions,
  periodOptions,
  quoteCopy,
  restrictionOptions,
} from '../../data/siteContent';
import { track } from '../../lib/analytics';
import { clearQuoteDraft, loadQuoteDraft, saveQuoteDraft } from '../../lib/quoteStorage';
import { buildWhatsAppMessage, buildWhatsAppUrl, totalGuests } from '../../lib/whatsapp';
import { MAX_NOTES, formatPhoneInput, sanitizeMultiline, todayISO } from '../../lib/validation';
import { useDialogBehavior } from '../../hooks/useDialogBehavior';
import { REVIEW_STEP, STEPS, validateStep, type StepId } from '../../lib/quoteRules';
import { emptyQuote, type EventTypeId, type InterestId, type QuoteData } from '../../types/quote';
import { GuestCounter } from './GuestCounter';
import { OptionCard } from './OptionCard';
import { ProgressBar } from './ProgressBar';
import { ReviewSummary } from './ReviewSummary';
import { StepControls } from './StepControls';

const STEP_TITLES: Record<StepId, string> = {
  eventType: quoteCopy.steps.eventType.title,
  date: quoteCopy.steps.date.title,
  period: quoteCopy.steps.period.title,
  place: quoteCopy.steps.place.title,
  guests: quoteCopy.steps.guests.title,
  interests: quoteCopy.steps.interests.title,
  restrictions: quoteCopy.steps.restrictions.title,
  notes: quoteCopy.steps.notes.title,
  contact: quoteCopy.steps.contact.title,
  review: quoteCopy.steps.review.title,
};

const STEP_HELP: Record<StepId, string> = {
  eventType: quoteCopy.steps.eventType.help,
  date: quoteCopy.steps.date.help,
  period: quoteCopy.steps.period.help,
  place: quoteCopy.steps.place.help,
  guests: quoteCopy.steps.guests.help,
  interests: quoteCopy.steps.interests.help,
  restrictions: quoteCopy.steps.restrictions.help,
  notes: quoteCopy.steps.notes.help,
  contact: quoteCopy.steps.contact.help,
  review: quoteCopy.steps.review.help,
};

interface QuoteWizardProps {
  onClose: () => void;
  initialEventType?: EventTypeId;
}

/**
 * O modal é montado só quando abre: o rascunho da sessão entra direto no
 * estado inicial, sem efeito de sincronização.
 */
export function QuoteWizard({ onClose, initialEventType }: QuoteWizardProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mountedRef = useRef(false);

  const [draft] = useState(loadQuoteDraft);
  const [data, setData] = useState<QuoteData>(() => {
    const base = draft?.data ?? emptyQuote;
    return initialEventType ? { ...base, eventType: initialEventType } : base;
  });
  const [stepIndex, setStepIndex] = useState(() =>
    initialEventType ? 0 : Math.min(draft?.step ?? 0, REVIEW_STEP),
  );
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [sent, setSent] = useState(false);
  const [returnToReview, setReturnToReview] = useState(false);

  const step = STEPS[stepIndex];
  const stepCopy = quoteCopy.steps;

  useDialogBehavior(panelRef, true, onClose);

  useEffect(() => {
    saveQuoteDraft({ data, step: stepIndex });
  }, [data, stepIndex]);

  // Move o foco para o título ao trocar de etapa (não na abertura).
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    panelRef.current?.querySelector('.wizard__body')?.scrollTo({ top: 0 });
  }, [stepIndex]);

  useEffect(() => {
    if (step === 'review') track('quote_review_viewed');
  }, [step]);

  const update = useCallback((patch: Partial<QuoteData>) => {
    setData((current) => ({ ...current, ...patch }));
    setError(null);
  }, []);

  const goToStep = useCallback((index: number) => {
    setStepIndex(Math.min(Math.max(index, 0), REVIEW_STEP));
    setError(null);
  }, []);

  const handleNext = useCallback(() => {
    const message = validateStep(step, data);
    if (message) {
      setError(message);
      return;
    }
    track('quote_step_completed', { step_number: stepIndex + 1, step_id: step });
    if (returnToReview) {
      setReturnToReview(false);
      goToStep(REVIEW_STEP);
      return;
    }
    goToStep(stepIndex + 1);
  }, [data, goToStep, returnToReview, step, stepIndex]);

  const handleBack = useCallback(() => {
    if (returnToReview) {
      setReturnToReview(false);
      goToStep(REVIEW_STEP);
      return;
    }
    goToStep(stepIndex - 1);
  }, [goToStep, returnToReview, stepIndex]);

  const handleRestart = useCallback(() => {
    clearQuoteDraft();
    setData(emptyQuote);
    setStepIndex(0);
    setError(null);
    setSent(false);
    setCopyStatus('idle');
    setReturnToReview(false);
    setNotice('Respostas apagadas. Você pode começar de novo.');
  }, []);

  const handleEditFromReview = useCallback(
    (target: number) => {
      setReturnToReview(true);
      goToStep(target);
    },
    [goToStep],
  );

  const whatsappUrl = useMemo(() => buildWhatsAppUrl(data), [data]);

  const handleSubmit = useCallback(() => {
    track('whatsapp_quote_click', { guests: totalGuests(data), event_type: data.eventType ?? 'nao-informado' });
    setSent(true);
    setCopyStatus('idle');
  }, [data]);

  const handleCopy = useCallback(async () => {
    const message = buildWhatsAppMessage(data);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
        setCopyStatus('copied');
        return;
      }
      throw new Error('clipboard indisponível');
    } catch {
      setCopyStatus('error');
    }
  }, [data]);

  const toggleInterest = useCallback((value: string, checked: boolean) => {
    const interest = value as InterestId;
    setData((current) => ({
      ...current,
      interests: checked
        ? [...current.interests, interest]
        : current.interests.filter((item) => item !== interest),
    }));
    setError(null);
  }, []);

  const errorId = error ? 'wizard-error' : undefined;

  return (
    <div className="wizard" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        className="wizard__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
        aria-describedby="wizard-help"
        ref={panelRef}
        tabIndex={-1}
      >
        <header className="wizard__header">
          <div className="wizard__headerTop">
            <p className="wizard__kicker">{quoteCopy.title}</p>
            <button type="button" className="wizard__close" onClick={onClose}>
              <span className="visually-hidden">{quoteCopy.close}</span>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <ProgressBar current={stepIndex + 1} total={STEPS.length} />
        </header>

        <div className="wizard__body">
          <h2 className="wizard__title" id="wizard-title" ref={headingRef} tabIndex={-1}>
            {STEP_TITLES[step]}
          </h2>
          <p className="wizard__help" id="wizard-help">
            {STEP_HELP[step]}
          </p>

          {step === 'eventType' ? (
            <div className="options options--grid">
              {eventTypeOptions.map((option, index) => (
                <OptionCard
                  key={option.id}
                  type="radio"
                  name="event-type"
                  value={option.id}
                  label={option.label}
                  hint={option.hint}
                  checked={data.eventType === option.id}
                  onChange={(value) => update({ eventType: value as EventTypeId })}
                  autoFocus={index === 0}
                />
              ))}
              {data.eventType === 'outro' ? (
                <div className="field field--full">
                  <label className="field__label" htmlFor="event-other">
                    {stepCopy.eventType.otherLabel}
                  </label>
                  <input
                    id="event-other"
                    className="field__input"
                    type="text"
                    maxLength={80}
                    value={data.eventTypeOther}
                    placeholder={stepCopy.eventType.otherPlaceholder}
                    onChange={(event) => update({ eventTypeOther: event.target.value })}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 'date' ? (
            <div className="stack">
              <div className="field">
                <label className="field__label" htmlFor="event-date">
                  {stepCopy.date.fieldLabel}
                </label>
                <input
                  id="event-date"
                  className="field__input"
                  type="date"
                  min={todayISO()}
                  value={data.date}
                  disabled={data.dateUndecided}
                  onChange={(event) => update({ date: event.target.value })}
                  data-autofocus=""
                />
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={data.dateUndecided}
                  onChange={(event) =>
                    update({ dateUndecided: event.target.checked, date: event.target.checked ? '' : data.date })
                  }
                />
                <span>{stepCopy.date.undecided}</span>
              </label>
            </div>
          ) : null}

          {step === 'period' ? (
            <div className="stack">
              <div className="options">
                {periodOptions.map((option, index) => (
                  <OptionCard
                    key={option.id}
                    type="radio"
                    name="period"
                    value={option.id}
                    label={option.label}
                    hint={option.hint}
                    checked={data.period === option.id}
                    onChange={(value) => update({ period: value as QuoteData['period'] })}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <div className="field">
                <label className="field__label" htmlFor="event-time">
                  {stepCopy.period.timeLabel} <span className="field__optional">({quoteCopy.optional})</span>
                </label>
                <input
                  id="event-time"
                  className="field__input field__input--short"
                  type="time"
                  value={data.time}
                  onChange={(event) => update({ time: event.target.value })}
                />
              </div>
            </div>
          ) : null}

          {step === 'place' ? (
            <div className="stack">
              <div className="field">
                <label className="field__label" htmlFor="event-city">
                  {stepCopy.place.cityLabel}
                </label>
                <input
                  id="event-city"
                  className="field__input"
                  type="text"
                  maxLength={80}
                  autoComplete="address-level2"
                  value={data.city}
                  placeholder={stepCopy.place.cityPlaceholder}
                  onChange={(event) => update({ city: event.target.value })}
                  data-autofocus=""
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="event-neighborhood">
                  {stepCopy.place.neighborhoodLabel} <span className="field__optional">({quoteCopy.optional})</span>
                </label>
                <input
                  id="event-neighborhood"
                  className="field__input"
                  type="text"
                  maxLength={80}
                  autoComplete="address-level3"
                  value={data.neighborhood}
                  placeholder={stepCopy.place.neighborhoodPlaceholder}
                  onChange={(event) => update({ neighborhood: event.target.value })}
                />
              </div>
              <fieldset className="fieldset">
                <legend className="field__label">{stepCopy.place.venueQuestion}</legend>
                <div className="options options--inline">
                  <OptionCard
                    type="radio"
                    name="venue"
                    value="sim"
                    label="Sim, já sei o local"
                    checked={data.venueDefined === 'sim'}
                    onChange={() => update({ venueDefined: 'sim' })}
                  />
                  <OptionCard
                    type="radio"
                    name="venue"
                    value="nao"
                    label="Ainda não"
                    checked={data.venueDefined === 'nao'}
                    onChange={() => update({ venueDefined: 'nao', venueName: '' })}
                  />
                </div>
              </fieldset>
              {data.venueDefined === 'sim' ? (
                <div className="field">
                  <label className="field__label" htmlFor="venue-name">
                    {stepCopy.place.venueLabel} <span className="field__optional">({quoteCopy.optional})</span>
                  </label>
                  <input
                    id="venue-name"
                    className="field__input"
                    type="text"
                    maxLength={120}
                    value={data.venueName}
                    placeholder={stepCopy.place.venuePlaceholder}
                    onChange={(event) => update({ venueName: event.target.value })}
                  />
                  <p className="field__hint">{stepCopy.place.venueHint}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 'guests' ? (
            <div className="stack">
              <div className="counters">
                <GuestCounter
                  label={stepCopy.guests.adults}
                  value={data.adults}
                  onChange={(value) => update({ adults: value })}
                  autoFocus
                />
                <GuestCounter
                  label={stepCopy.guests.children}
                  value={data.children}
                  onChange={(value) => update({ children: value })}
                />
              </div>
              <p className="total" aria-live="polite">
                <span className="total__label">{stepCopy.guests.total}</span>
                <strong className="total__value" data-testid="guest-total">
                  {totalGuests(data)}
                </strong>
              </p>
            </div>
          ) : null}

          {step === 'interests' ? (
            <div className="options">
              {interestOptions.map((option, index) => (
                <OptionCard
                  key={option.id}
                  type="checkbox"
                  name="interests"
                  value={option.id}
                  label={option.label}
                  hint={option.hint}
                  checked={data.interests.includes(option.id)}
                  onChange={toggleInterest}
                  autoFocus={index === 0}
                />
              ))}
              {data.interests.includes('outro') ? (
                <div className="field field--full">
                  <label className="field__label" htmlFor="interests-other">
                    {stepCopy.interests.otherLabel}
                  </label>
                  <input
                    id="interests-other"
                    className="field__input"
                    type="text"
                    maxLength={120}
                    value={data.interestsOther}
                    placeholder={stepCopy.interests.otherPlaceholder}
                    onChange={(event) => update({ interestsOther: event.target.value })}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 'restrictions' ? (
            <div className="stack">
              <div className="options options--inline">
                {restrictionOptions.map((option, index) => (
                  <OptionCard
                    key={option.id}
                    type="radio"
                    name="restrictions"
                    value={option.id}
                    label={option.label}
                    checked={data.restrictions === option.id}
                    onChange={(value) => update({ restrictions: value as QuoteData['restrictions'] })}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {data.restrictions === 'sim' ? (
                <div className="field">
                  <label className="field__label" htmlFor="restrictions-details">
                    {stepCopy.restrictions.detailsLabel}
                  </label>
                  <textarea
                    id="restrictions-details"
                    className="field__input field__textarea"
                    rows={3}
                    maxLength={240}
                    value={data.restrictionsDetails}
                    placeholder={stepCopy.restrictions.detailsPlaceholder}
                    onChange={(event) => update({ restrictionsDetails: event.target.value })}
                  />
                </div>
              ) : null}
              <p className="disclaimer">{stepCopy.restrictions.disclaimer}</p>
            </div>
          ) : null}

          {step === 'notes' ? (
            <div className="field">
              <label className="field__label" htmlFor="notes">
                {stepCopy.notes.label} <span className="field__optional">({quoteCopy.optional})</span>
              </label>
              <textarea
                id="notes"
                className="field__input field__textarea"
                rows={5}
                maxLength={MAX_NOTES}
                value={data.notes}
                placeholder={stepCopy.notes.placeholder}
                onChange={(event) => update({ notes: event.target.value.slice(0, MAX_NOTES) })}
                data-autofocus=""
              />
              <p className="field__hint" aria-live="polite">
                {sanitizeMultiline(data.notes).length}/{MAX_NOTES}
              </p>
            </div>
          ) : null}

          {step === 'contact' ? (
            <div className="stack">
              <div className="field">
                <label className="field__label" htmlFor="contact-name">
                  {stepCopy.contact.nameLabel}
                </label>
                <input
                  id="contact-name"
                  className="field__input"
                  type="text"
                  maxLength={80}
                  autoComplete="name"
                  value={data.name}
                  placeholder={stepCopy.contact.namePlaceholder}
                  onChange={(event) => update({ name: event.target.value })}
                  data-autofocus=""
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="contact-phone">
                  {stepCopy.contact.phoneLabel}
                </label>
                <input
                  id="contact-phone"
                  className="field__input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={data.phone}
                  placeholder={stepCopy.contact.phonePlaceholder}
                  onChange={(event) => update({ phone: formatPhoneInput(event.target.value) })}
                />
              </div>
              <label className="switch switch--consent">
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(event) => update({ consent: event.target.checked })}
                />
                <span>{stepCopy.contact.consent}</span>
              </label>
            </div>
          ) : null}

          {step === 'review' ? (
            <ReviewSummary
              data={data}
              whatsappUrl={whatsappUrl}
              copyStatus={copyStatus}
              sent={sent}
              onEdit={handleEditFromReview}
              onSubmit={handleSubmit}
              onCopy={handleCopy}
            />
          ) : null}

          <p className="wizard__error" id={errorId} role="alert">
            {error ?? ''}
          </p>
          <p className="visually-hidden" role="status">
            {notice}
          </p>
        </div>

        <footer className="wizard__footer">
          {step === 'review' ? (
            <div className="wizard__controls">
              <button type="button" className="btn btn--ghost" onClick={handleBack}>
                <span aria-hidden="true">←</span>
                {quoteCopy.back}
              </button>
              <button type="button" className="wizard__restart" onClick={handleRestart}>
                {quoteCopy.restart}
              </button>
            </div>
          ) : (
            <StepControls onBack={handleBack} onNext={handleNext} canGoBack={stepIndex > 0 || returnToReview} />
          )}
        </footer>
      </div>
    </div>
  );
}
