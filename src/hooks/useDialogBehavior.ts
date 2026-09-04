import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Comportamento compartilhado por modal e lightbox: trava a rolagem do fundo,
 * prende o foco dentro do painel, fecha no Esc e devolve o foco ao elemento
 * que abriu.
 */
export function useDialogBehavior(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
): void {
  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement as HTMLElement | null;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const focusFirst = () => {
      const panel = ref.current;
      if (!panel) return;
      const target = panel.querySelector<HTMLElement>('[data-autofocus]') ?? panel.querySelector<HTMLElement>(FOCUSABLE);
      (target ?? panel).focus({ preventScroll: true });
    };

    const frame = window.requestAnimationFrame(focusFirst);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const panel = ref.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown, true);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      opener?.focus?.({ preventScroll: true });
    };
  }, [ref, open, onClose]);
}
