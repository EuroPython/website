import { Fullbleed } from "components/layout/fullbleed";
import { LogoExtended } from "components/logo/logo-extended";
import links from "../../data/links.json";

export const Footer = () => (
  <Fullbleed className="bg-primary text-white">
    <footer className="max-w-4xl lg:max-w-6xl mx-auto py-16 lg:grid grid-cols-2 px-6">
      <div>
        <LogoExtended className="mb-12 max-w-full" />

        <nav className="mb-12">
          <h6 className="font-bold text-xl mb-6">Quicklinks</h6>

          {links.footer.map((item) => (
            <li key={item.name} className="list-none">
              <a
                href={item.path}
                className="block font-bold text-5xl mb-4 hover:text-primary-hover"
              >
                {item.name}
                {item.path.startsWith("http") ? <span> ↗</span> : null}
              </a>
            </li>
          ))}
        </nav>
      </div>

      <article className="flex flex-col lg:flex-row self-center gap-8 lg:gap-12 justify-end">
        <div>
          <img
            width={444}
            height={444}
            src="/img/europythonlogo.png"
            className="max-w-[100px]"
          />
        </div>
        <div>
          <address className="not-italic mb-4">
            EuroPython Society (EPS)
            <br />
            Ramnebacken 45
            <br />
            424 38 Agnesberg
            <br />
            Sweden
          </address>

          <p className="mb-4">
            <a
              className="underline whitespace-nowrap"
              href="https://blog.europython.eu"
            >
              blog.europython.eu <span> ↗</span>
            </a>
            <br />
            <a
              className="underline whitespace-nowrap"
              href="https://twitter.com/europython"
            >
              twitter.com/europython <span> ↗</span>
            </a>
            <br />
            <a
              className="underline whitespace-nowrap"
              href="https://linkedin.com/company/europython"
            >
              linkedin.com/company/europython <span> ↗</span>
            </a>
            <br />
            <a
              className="underline whitespace-nowrap"
              href="https://github.com/europython"
            >
              github.com/europython <span> ↗</span>
            </a>
          </p>

          <div id="powered-by-vercel">
            <a href="https://vercel.com/?utm_source=europython-2023&utm_campaign=oss">
              <img
                src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg"
                alt="powered by vercel"
              />
            </a>
          </div>
        </div>
      </article>
    </footer>
  </Fullbleed>
);
