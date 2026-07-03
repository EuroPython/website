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

# Modernising Feature-engine: Evolving the API for a Changing Python Ecosystem

## Introduction

Feature-engine was originally designed to bridge the gap between pandas and
scikit-learn at a time when scikit-learn only accepted NumPy arrays. Its design
decisions were intended to guide users towards good practices by raising errors
when transformers were used in inappropriate contexts.

The Python machine learning ecosystem has evolved considerably since then.
Scikit-learn now supports pandas natively, Polars has become a popular dataframe
library, and users users have requested greater flexibility from Feature-engine
transformers. To ensure the project continues to meet the needs of its users,
its API needs to evolve while preserving backward compatibility as much as
possible.

During this sprint, we will work on implementing the next generation of
Feature-engine's API, making it more flexible, faster, and compatible with
modern data processing libraries, while maintaining backward compatibility
wherever possible.

## Sprint Activities

Participants will work together on the following improvements:

- **Modernise the dataframe API** by adding support for Polars while allowing
  users to choose the installation that best suits their needs: a pandas-only
  installation, a Polars-only installation, or support for both backends.

- **Extend flexible error handling across the library.** The variable selection
  utilities already allow users to choose between raising an error or continuing
  when conditions are not met. During the sprint, we will extend this behaviour
  to the transformers so that users can opt for stricter or more permissive
  workflows.

- **Introduce configurable behaviour for transformation-specific errors.** For
  example, transformers that apply logarithmic transformations currently fail
  when negative values are present. We will extend the API to provide suitable
  options that allow the transformation to continue when appropriate, instead of
  raising an exception.

- **Improve performance by modernising internal implementations.** Where
  possible, we will replace pandas operations with equivalent NumPy
  implementations to improve execution speed while preserving the existing
  public API and maintaining backward compatibility as much as possible.

- **Write tests and documentation** for the new functionality to ensure
  reliability and provide clear guidance for users adopting the updated API.

The sprint is suitable for contributors interested in machine learning
libraries, API design, testing, documentation, and open source development.
