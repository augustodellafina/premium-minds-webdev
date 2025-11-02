import './Header.scss';

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <picture>
            <source 
              type="image/svg+xml" 
              srcSet="/logos/LOGO-WDR.svg" 
            />
            <source 
              type="image/png" 
              srcSet="/logos/LOGO-WDR.png 1x, /logos/LOGO-WDR@2x.png 2x" 
            />
            <img 
              src="/logos/LOGO-WDR.png" 
              alt="WEBDEV - Premium Minds Challenge" 
              className="logo-img"
              width="120"
              height="40"
            />
          </picture>
        </div>
      </div>
    </header>
  );
}