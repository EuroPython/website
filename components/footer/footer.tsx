import links from "../../data/links.json";

import { NavItems } from "../nav-items";

export const Footer = () => (
  <footer>
    <nav>
      <h6>Quicklinks</h6>
      <NavItems items={links.footer} />
    </nav>
    <article>
      <div className="footer__logo">
        <img width={444} height={444} src="/img/europythonlogo.png" />
      </div>
      <div>
        <p>
          EuroPython Society (EPS)
          <br />
          Ramnebacken 45
          <br />
          424 38 Agnesberg
          <br />
          Sweden
        </p>
        <p>
          <a href="https://blog.europython.eu">blog.europython.eu</a>
          <br />
          <a href="https://twitter.com/europython">twitter.com/europython</a>
          <br />
          <a href="https://linkedin.com/company/europython">
            linkedin.com/company/europython
          </a>
          <br />
          <a href="https://github.com/europython">github.com/europython</a>
        </p>

        <div id="powered-by-vercel">
          <a href="https://vercel.com/?utm_source=europython-2022&utm_campaign=oss">
            <img
              src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg"
              alt="powered by vercel"
            />
          </a>
        </div>
      </div>
    </article>
  </footer>
);
