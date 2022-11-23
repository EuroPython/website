import links from "../../data/links.json";

export const Footer = () => (
  <footer className="max-w-4xl lg:max-w-6xl mx-auto py-16 md:grid grid-cols-2">
    <nav>
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

    <article className="flex self-center gap-12">
      <div className="">
        <img width={444} height={444} src="/img/europythonlogo.png" />
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
