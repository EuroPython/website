---
title: "Pandas Extending & Plotting"
numberOfPeople: "5-10" # How many people you expect to be able to accommodate.
pythonLevel: "Intermediate & Advanced" # Any, Beginner, Intermediate, or Advanced.
contactPerson: # The main person to reach out to regarding the sprint.
  name: "Julian Harbeck"
  email: harbeck@tu-berlin.de
  github: https://github.com/Julian-Harbeck
  twitter:
links: # Add as many links as relevant.
  - title: "Project pandas GitHub repo"
    url: "https://github.com/pandas-dev/pandas/"
  - title: "Project astropy GitHub repo"
    url: "https://github.com/astropy/astropy"
  - title: "Project astropy-pandas GitHub repo (extending pandas with astropy object support)"
    url: "https://github.com/janpipek/pandas-units-extension"
  - title: "Project skyfield-pandas GitHub repo (extending pandas with skyfield object support)"
    url: "https://github.com/Julian-Harbeck/pandas-skyfield-extension"
---

Pandas has a powerful extension API that allows other libraries to create their own dtype and ExtensionArray (EA) and define their behaviour, e.g. arithmetic operation with scalars and arrays.
In the past year I have both worked on the pandas EA API (e.g. adding a plotting API) and implementing/updating EA for other packages (astropy, skyfield, see links above).
In `astropy-pandas` we have implemented an EA supporting `Quantity` objects, arrays with a physical unit attached to them.
This includes arithmetic operations, but also unit conversions (`ft` -> `m`) or reductions like `.mean()`, more examples can be found in [doc/units.ipynb](https://github.com/janpipek/pandas-units-extension/blob/main/doc/units.ipynb).
`skyfield-pandas` implements an EA wrapper for the Skyfield library for orbit propagation of satellites and fast vectorized operations on them (exampels see [doc/skyfield_position.ipynb](https://github.com/Julian-Harbeck/pandas-skyfield-extension/blob/main/doc/skyfield_position.ipynb)).

For this sprint I am open to work on one or more of the following topics depending where the most interested is in:
- Conitinue working on one of the two existing extensions, giving an introduction how they work and implement smaller new features including tests.
- Start the development of an entirely new EA. Which array-like object did you always wanted to be compatible with pandas including vectorized operations? Let's develop a first working prototype of an EA supporting the basic functionallity.
- Working on pandas directly, how to write a good first issue, how to implement and test a new feature locally and how to create a good PR. I am not an export on the whole pandas package yet as I have only joined the team recently, but I have worked especially on the ExtensionArray and plotting API.
