# Exercise 11.1 - CI/CD for a Python Application

## Linting

For a Python application, common linting tools include **pylint** and **flake8**. Pylint performs deep static analysis, checking for errors, enforcing coding standards (PEP 8), and detecting code smells. Flake8 is lighter and combines pycodestyle, pyflakes, and mccabe complexity checker. For type checking, **mypy** can be added to catch type-related bugs before runtime. These tools integrate easily into CI pipelines via simple command-line invocations.

## Testing

**pytest** is the de facto standard for testing Python applications. It supports unit tests, integration tests, fixtures, parameterized tests, and plugins for coverage reporting (pytest-cov). For web applications built with frameworks like Django or Flask, pytest-django and pytest-flask provide additional testing utilities. Tests can be run in parallel using pytest-xdist to speed up CI pipelines.

## Building

Python applications are typically packaged using **setuptools** with a `setup.py` or `pyproject.toml` configuration. The build step produces wheel (`.whl`) and source distribution (`.tar.gz`) files. For containerized deployments, the "build" step is effectively `docker build`. For serverless or PaaS deployments, the build may involve collecting static files, compiling translations, or bundling dependencies with tools like **pip-tools** or **poetry**.

## CI Alternatives to Jenkins and GitHub Actions

Several alternatives exist beyond Jenkins and GitHub Actions:

- **GitLab CI/CD**: Tightly integrated with GitLab repositories, uses `.gitlab-ci.yml` for pipeline configuration, and offers built-in container registry and deployment features.
- **CircleCI**: Cloud-native CI/CD with excellent Docker support, parallelism, and caching. Configuration lives in `.circleci/config.yml`.
- **Travis CI**: One of the original cloud CI services, simple YAML configuration, though it has declined in popularity for open-source projects.
- **Azure DevOps Pipelines**: Microsoft's CI/CD offering with strong integration into Azure cloud services and support for multi-platform builds.
- **Buildkite**: A hybrid approach where the orchestration is cloud-hosted but agents run on your own infrastructure, giving you control over the build environment.

## Self-hosted vs. Cloud-based CI

For a team of 6 developers working on an actively developed application, **cloud-based CI** is the better choice. The reasoning:

1. **Maintenance overhead**: Self-hosted CI requires dedicated effort to maintain servers, update runner software, manage security patches, and handle scaling. A team of 6 likely cannot afford to dedicate someone to CI infrastructure.
2. **Scalability**: Cloud CI services automatically scale runners based on demand. During peak development (multiple PRs), builds run in parallel without queuing.
3. **Cost efficiency**: At this team size, cloud CI services (GitHub Actions, CircleCI, GitLab CI) offer generous free tiers or affordable plans that cost less than maintaining dedicated build servers.
4. **Setup speed**: Cloud CI is ready to use immediately with a configuration file, whereas self-hosted requires provisioning, configuring, and securing build machines.

Self-hosted CI makes more sense for larger organizations with strict compliance requirements, custom hardware needs (GPU testing, specific OS versions), or extremely high build volumes where cloud costs become prohibitive.
