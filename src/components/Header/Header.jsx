import './Header.scss';

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <img src="/logos/LOGO-WDR.svg" alt="WEBDEV" className="logo-img" />
        </div>
      </div>
    </header>
  );
}