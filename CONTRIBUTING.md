# Contributing

Thanks for your interest in improving Weather Animations. Contributions are welcome, but all changes are reviewed and merged by the maintainer.

## Development Setup

```bash
npm install
npm run dev
```

Before opening a pull request, run:

```bash
npm test
./node_modules/.bin/tsc --noEmit --skipLibCheck
npm run build
```

For rendering changes, also run the relevant visual tests:

```bash
npm run test:visual
```

## Issues

Please open an issue before starting larger changes, public API changes, or visual redesigns. Small bug fixes can go straight to a pull request if the problem and fix are clear.

## Pull Requests

- Keep pull requests focused on one change.
- Describe the user-facing behavior and the implementation approach.
- Include screenshots or visual notes for changes that affect rendering.
- Mention any breaking changes explicitly.
- Do not include generated `dist/` artifacts; they are produced by `npm run build` and `prepack`.

External pull requests require maintainer review. A pull request being open does not guarantee it will be merged. Only the maintainer approves and merges changes into `main`.

## Branches

Use short, descriptive branch names such as:

```text
fix/cloud-opacity
feat/weather-icons
docs/readme-usage
```

## Maintainer Notes

Before making the repository public, configure branch protection for `main` in GitHub:

- Require a pull request before merging.
- Require at least one approval.
- Restrict direct pushes if appropriate.
- Add required status checks once CI exists.
