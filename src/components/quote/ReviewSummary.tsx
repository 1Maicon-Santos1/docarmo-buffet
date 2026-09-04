import { quoteCopy } from '../../data/siteContent';
import { describeQuote, type QuoteField } from '../../lib/whatsapp';
import type { QuoteData } from '../../types/quote';

/** Cada bloco do resumo aponta para a etapa que o originou. */
const BLOCKS: ReadonlyArray<{ step: number; title: string; fields: QuoteField['key'][] }> = [
  { step: 0, title: 'Tipo de evento', fields: ['eventType'] },
  { step: 1, title: 'Data', fields: ['date'] },
  { step: 2, title: 'Horário', fields: ['schedule'] },
  { step: 3, title: 'Local', fields: ['place', 'venue'] },
  { step: 4, title: 'Convidados', fields: ['guests'] },
  { step: 5, title: 'Interesses', fields: ['interests'] },
  { step: 6, title: 'Preferências e restrições', fields: ['restrictions'] },
  { step: 7, title: 'Observações', fields: ['notes'] },
  { step: 8, title: 'Contato', fields: ['name', 'phone'] },
];

interface ReviewSummaryProps {
  data: QuoteData;
  whatsappUrl: string;
  copyStatus: 'idle' | 'copied' | 'error';
  sent: boolean;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  onCopy: () => void;
}

export function ReviewSummary({
  data,
  whatsappUrl,
  copyStatus,
  sent,
  onEdit,
  onSubmit,
  onCopy,
}: ReviewSummaryProps) {
  const fields = describeQuote(data);
  const valueOf = (key: QuoteField['key']) => fields.find((field) => field.key === key);

  return (
    <div className="review">
      <ul className="review__list">
        {BLOCKS.map((block) => (
          <li className="review__block" key={block.step}>
            <div className="review__head">
              <h3 className="review__title">{block.title}</h3>
              <button type="button" className="review__edit" onClick={() => onEdit(block.step)}>
                {quoteCopy.steps.review.edit}
                <span className="visually-hidden"> {block.title.toLowerCase()}</span>
              </button>
            </div>
            <dl className="review__fields">
              {block.fields.map((key) => {
                const field = valueOf(key);
                if (!field) return null;
                return (
                  <div className="review__row" key={key}>
                    <dt>
                      <span aria-hidden="true">{field.emoji}</span> {field.label}
                    </dt>
                    <dd data-empty={field.value ? undefined : ''}>
                      {field.value ?? quoteCopy.steps.review.emptyValue}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </li>
        ))}
      </ul>

      <div className="review__actions">
        <a
          className="btn btn--primary btn--block review__submit"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onSubmit}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.21.89 2.39 1.01 2.55.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z"
            />
          </svg>
          {quoteCopy.steps.review.submit}
        </a>
        <button type="button" className="btn btn--ghost btn--block" onClick={onCopy}>
          {quoteCopy.steps.review.copy}
        </button>
      </div>

      <p className="review__status" role="status">
        {sent ? quoteCopy.steps.review.afterClick : ''}
        {copyStatus === 'copied' ? quoteCopy.steps.review.copied : ''}
        {copyStatus === 'error' ? quoteCopy.steps.review.copyFailed : ''}
      </p>
    </div>
  );
}
