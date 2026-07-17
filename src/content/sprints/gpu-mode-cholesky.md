---
title: "GPU MODE: Cholesky Challenge"
numberOfPeople: "20"
pythonLevel: "Any"
contactPerson:
  name: "Bryce Adelstein Lelbach"
  email: "brycelelbach@gmail.com"
  github: "brycelelbach"
  twitter: "blelbach"
links:
  - title: "Cholesky leaderboard"
    url: "https://www.gpumode.com/leaderboard/776"
  - title: "Cholesky problem and starter submission"
    url: "https://github.com/gpu-mode/reference-kernels/tree/main/problems/linalg/cholesky_py"
  - title: "Linear algebra competition announcement"
    url: "https://www.gpumode.com/news/linear-algebra-kernels-age-of-research"
  - title: "Popcorn CLI"
    url: "https://github.com/gpu-mode/popcorn-cli"
  - title: "GPU MODE Discord"
    url: "https://discord.gg/gpumode"
---

Come learn how to compete in a GPU MODE kernel contest by tackling the new
Cholesky problem together. The challenge is to factor batches of symmetric
positive-definite FP32 matrices on an NVIDIA B200. It runs through 30 July, so
we can put what we learn straight onto the live leaderboard.

Every submission is a single Python file. You can begin with the working PyTorch
baseline, then optimize in Python with tools such as Triton or embedded CUDA.
The benchmark ranges from thousands of small matrices to one 32768-by-32768
matrix, leaving room for many different ideas. Tests and benchmarks run on
hosted B200s, so you do not need a local GPU.

Bryce from NVIDIA will help participants install and register the Popcorn CLI,
understand the problem, make a first correct submission, read benchmark and
profiling results, and choose an optimization to try. The goal is for every
newcomer to leave knowing the complete contest workflow; experienced GPU
programmers are welcome to team up and chase the leaderboard.

Participants who want to use a coding agent can have Popcorn scaffold the
agent's contest workflow. Bryce will show how to give an agent a concrete
optimization goal, let it run the iterative edit-test-benchmark loop, inspect
its performance evidence, and keep numerically incorrect changes off the
leaderboard. Working directly by hand, pairing with another person, or bringing
your preferred coding agent are all equally welcome.

No previous GPU-kernel or agent experience is required. Bring a laptop and a
GitHub or Discord account for authentication; basic Python familiarity will
help.
