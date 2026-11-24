import "./MsAgencyCredit.css";

export function MsAgencyCredit() {
  return (
    <aside className="ms-site-credit" id="ms-credit" aria-label="Desenvolvimento deste site">
      <div className="ms-credit-inner">
        <a className="ms-credit-brand" href="https://msdiagnostico.online/" target="_blank" rel="noopener noreferrer" aria-label="Desenvolvido por MS Soluções Digitais (abre em nova aba)">
          <span className="ms-credit-label">Desenvolvido por</span>
          <img className="ms-credit-logo" src="/ms-agency-logo.png" width={1279} height={341} alt="MS Soluções Digitais" loading="lazy" />
        </a>
        <a className="ms-credit-action" href="https://msdiagnostico.online/" target="_blank" rel="noopener noreferrer" aria-label="Conhecer empresa: MS Soluções Digitais (abre em nova aba)">Conhecer empresa <span aria-hidden="true">↗</span></a>
      </div>
    </aside>
  );
}
