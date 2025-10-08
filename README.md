# A QuickBlog fork

Please see the original readme of [ANorwell/quickblog](https://github.com/ANorwell/quickblog) for more information and credits for the original platform.  
It is a simple, minimal plug and play solution for running a blog on Github pages.

## Changes from upstream (as of 2024-06-10)

- Runs on Vue 3 / Vite
- Syntax highlighting via [PrismJS](https://prismjs.com/)
- Minor UI tweaks (external links have icons, code blocks are scrollable, show post/tag filter)
- Customisable app prefix - does not have to be hosted at `/` from the domain
- ESLint + Prettier have been replaced by [Biome](https://biomejs.dev/), lint step added to CI
- Upgraded all dependencies

## Development

```sh
# install node
asdf install

# build the manifest (posts.json)
npm run precompile

# build the Vue app (to `./dist`)
npm run build
# serve the built app
npm run preview

# OR build _and_ serve (with Hot Module Reloading):
npm run dev
```
