# Publishing

The package is `oreoui-doodle-icons` on npm. Unscoped on purpose — a scoped
name would need an npm organisation to exist first, and publishing should not
be blocked on that.

## Every release

```bash
npm install          # only needed on a fresh clone
npm publish
```

That is the whole thing. `prepublishOnly` regenerates the SVG files, the
README contact sheets and `dist/` before the tarball is built, so what ships
is always rebuilt from `src/icons.ts` rather than from whatever happens to be
sitting on disk.

Expect roughly: **311 files, ~73 kB packed**. To see exactly what would go out
without sending anything:

```bash
npm publish --dry-run
```

## Logging in from a blocked network

`registry.npmjs.org` and `www.npmjs.com` are separate hosts, and some networks
reach one but not the other. Publishing only needs the registry:

```bash
npm login --auth-type=legacy
```

This asks for username, password and OTP in the terminal instead of opening
npmjs.com, so it works even when the website is unreachable.

If the machine installs through a mirror — `npm config get registry` showing
something other than npmjs.org — that is fine and does not need changing.
`publishConfig.registry` in `package.json` sends publishes to the real npm
regardless.

## Versioning

The icons are the product, so the version tracks the set:

- **patch** — an existing icon redrawn, a fix, docs
- **minor** — a new batch of icons, a new prop
- **major** — a rename or removal that breaks an import

```bash
npm version minor && npm publish && git push --follow-tags
```

## What is not in the tarball

`files` in `package.json` ships `dist/`, `icons/` and `icons-animated/` only.
`src/`, `scripts/`, `.github/` and the build config stay in the repo — people
installing the package get the finished thing, not the workshop.

## The one number that matters

`src/boil.ts` holds the tuning the whole set is drawn for — amplitude,
duration, stroke width. The React component, the 152 standalone SVG files and
the README contact sheets all read from it, so changing it there moves
everything at once. Change it anywhere else and the set drifts out of sync
with oreoui.com/doodle-icons.
