---
title: "Real time dynamic pricing AI system in Python"
numberOfPeople: "5" 
pythonLevel: "Intermediate" 
contactPerson:
  name: "Gabby Demirkiran"
  email: "gulcindemirkirann@gmail.com"
  github: "https://github.com/radioactivityy"
  linkedln: "https://www.linkedin.com/in/gulcindemirkiran/"
---
## What is it?

Think about how Uber works: when lots of people need rides but there aren't
many drivers around, prices go up. When it's quiet, prices go down. This
project builds that kind of "smart pricing" system from scratch.

## What does it actually do?

The system watches ride requests come in live (simulated from real
ride-sharing data) and decides a fair price for each one, instantly. It looks
at things like:

- How many people want rides right now vs. how many drivers are available
- What time of day it is
- How long the trip will take
- Whether the customer is a loyal, regular user (they get a discount)

## Stack

Will be written with Python 3.14 and some of its newest features, using an approach
called "online machine learning" => RIver library will be used for that (https://pypi.org/project/river/)
Dataset that will be used: https://www.kaggle.com/datasets/arashnic/dynamic-pricing-dataset
