---
title: "Feature-engine"
numberOfPeople: "10" # How many people you expect to be able to accommodate.
pythonLevel: "Any" # Any, Beginner, Intermediate, or Advanced.
contactPerson: # The main person to reach out to regarding the sprint.
  name: "Soledad Galli"
  email: "solegalli@protonmail.com"
  github: "solegalli"
  twitter: "Soledad_Galli"
links: # Add as many links as relevant.
  - title: "Feature-engine's GitHub repo"
    url: "https://github.com/feature-engine/feature_engine"
---

**Modernising Feature-engine's API**

Feature-engine was originally designed to bridge the gap between pandas and
scikit-learn while encouraging good practices through a strict API. As the
Python ecosystem has evolved, with native pandas support in scikit-learn,
the emergence of Polars, and demand for more flexible workflows, Feature-engine
needs to evolve while maintaining backward compatibility.

In this sprint, you'll help evolve Feature-engine's API by:

- Adding support for Polars.
- Extending configurable error handling across transformers, allowing users to
  choose between raising exceptions or continuing when appropriate.
- Improving performance by replacing pandas operations with NumPy
  implementations where possible while preserving the public API.

The sprint is open to anyone interested in machine learning libraries, API
design, testing, documentation, and open source development.

More details [here](https://github.com/feature-engine/feature_engine/issues/935).
