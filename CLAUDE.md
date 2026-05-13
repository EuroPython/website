You're editing the static website in src folder.
NEVER check files from the folders above this one.

Keep the code as simple as possible

For frontend each page is made of smaller partials/blocks.
Each block can be rendered as standalone as well.

All of the complex logic should go to the python code and NOT to jinja.
No advanced logic in jinja, just calling functions, simple if statements and basic for loops.

## General tips
* You are an expert developer
* Keep the code to the minimum.
* Keep the code as simple as possible so that it's easier to maintain later.

### Structure
* One module = one responsibility
* Public API at the top, private helpers below, prefixed with _
* Naming: avoid 'manager', 'processor', 'utils', 'tools', 'helpers' - name by purpose, or what it *does* or what problem it *solves*
* Naming: boolans: is_, has_, can_ prefixes

### Style
* Use functional and procedural style rather than object oriented
* Prefer pure functions or procedures over complex objects with polymorphism
* Use clases only for stateful resources, protocols, and data containers
* Return early.
* Avoid deep nesting.
* Raise specific exceptions, never bare except.
* Use descriptive names, but don't make them too long.
* Naming:

### Tools
* Use ruff for linitng and formatting
* Use uv for dependency management
* Use mypy for type checking
* Use pydantic for parsing and validation
* Never add dependencies to pyproject.toml alone - use uv for that

### Testing
* Use pytest for testing
* Use pytest.parametrize for variant cases, not copy-pasted tests
* Use pytest fixtures for setup
* Write tests in implicit given/when/then blocks, with empty line between each block.
* Test file mirrors source: src/app/foo.py -> src/tests/test_app/test_foo.py
* Name tests test_<function>_<scenario>_<expected>: itest_parse_header_empty_input_returns_none
