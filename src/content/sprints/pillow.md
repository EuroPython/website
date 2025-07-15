---
title: "Pillow"
numberOfPeople: "TBD"
pythonLevel: "Intermediate"
contactPerson:
  name: "Eric Soroos"
  email: eric-python@soroos.net
  github: wiredfool
  twitter:
links:
  - title: "Repo"
    url: "https://github.com/python-pillow/Pillow"
  - title: "Issue Overview"
    url: "https://github.com/python-pillow/Pillow/issues/1888#issuecomment-2613018551"
---

I'm planning on working on the long-standing Pillow issue #1888 -- high
bit depth multi channel images, specifically by trying to add planar
image storage to the core Pillow imaging object.  [This
comment](https://github.com/python-pillow/Pillow/issues/1888#issuecomment-2613018551)
outlines the general approach that I think would work.

There will be some C level wrangling in addition to the Python layer
changes to implement the planar image storage.
