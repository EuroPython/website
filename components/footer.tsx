export const Footer = () => (
  <footer>
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <a href="https://www.europython-society.org">
            <img src="/epslogo.png" />
          </a>
          <p
            style={{
              marginTop: "1em",
              fontSize: "0.9em",
            }}
            className="text-light"
          >
            EuroPython Society (EPS)
            <br />
            Ramnebacken 45
            <br />
            424 38 Agnesberg
            <br />
            Sweden
          </p>
          <p>
            <a href="https://www.europython-society.org" target="_blank">
              EPS website
            </a>
          </p>
        </div>
      </div>

      <div
        className="row text-center"
        style={{
          marginTop: "3em",
          fontFamily: "monospace",
        }}
      >
        <div className="col-md-12">
          <p>
            <a href="https://blog.europython.eu" target="_blank">
              blog.europython.eu
            </a>
          </p>
          <p>
            <a
              href="https://twitter.com/europython"
              target="_blank"
              className="btn-outline-primary"
            >
              twitter.com/europython
            </a>
          </p>
          <p>
            <a
              href="https://www.linkedin.com/company/europython"
              target="_blank"
              className="btn-outline-primary"
            >
              linkedin.com/company/europython
            </a>
          </p>
        </div>
      </div>

      <div>
        <p>
          Copyright &copy; 2022, EuroPython Society,{" "}
          <a href="mailto:info@europython-society.org">
            info@europython-society.org
          </a>
        </p>

        <hr />

        <a href="https://vercel.com/?utm_source=europython-2022&utm_campaign=oss">
          <img
            src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg"
            alt="powered by vercel"
          />
        </a>
      </div>
    </div>
  </footer>
);
