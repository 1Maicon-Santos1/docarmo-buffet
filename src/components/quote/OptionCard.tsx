interface OptionCardProps {
  type: 'radio' | 'checkbox';
  name: string;
  value: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
  autoFocus?: boolean;
}

/**
 * Card de seleção construído em cima de um input real (radio/checkbox):
 * teclado, leitor de tela e estados nativos continuam funcionando.
 */
export function OptionCard({ type, name, value, label, hint, checked, onChange, autoFocus }: OptionCardProps) {
  return (
    <label className="option" data-checked={checked || undefined}>
      <input
        className="option__input"
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => onChange(value, event.target.checked)}
        data-autofocus={autoFocus ? '' : undefined}
      />
      <span className="option__body">
        <span className="option__label">{label}</span>
        {hint ? <span className="option__hint">{hint}</span> : null}
      </span>
      <span className="option__mark" aria-hidden="true" />
    </label>
  );
}
