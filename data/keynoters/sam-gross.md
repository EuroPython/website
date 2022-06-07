---
title: Multithreaded Python without the GIL
speaker: Sam Gross
bio: Sam Gross is a software engineer at Meta AI. He is a co-author of PyTorch, an open-source Python machine learning framework. He holds M.Eng. and B.S. degrees in computer science from the Massachusetts Institute of Technology.
subtitle: "Mostly thread-safe"
---

CPython’s “Global Interpreter Lock”, or “GIL”, prevents multiple threads from executing Python code in parallel. The GIL was added to Python in 1992 together with the original support for threads in order to protect access to the interpreter’s shared state.

Python supports a number of ways to enable parallelism within the constraints of the GIL, but they come with significant limitations. Imagine if you could avoid the startup time of joblib workers, the multiprocess instability of PyTorch’s DataLoaders, and the overhead of pickling data for inter-process communication.

The “nogil” project aims to remove the GIL from CPython to make multithreaded Python programs more efficient, while maintaining backward compatibility and single-threaded performance. It exists as a fork, but the eventual goal is to contribute these changes upstream.

This talk will cover the changes to Python to let it run efficiently without the GIL and what these changes mean for Python programmers and extension authors.
