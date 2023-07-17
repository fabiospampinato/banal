> This was tested under macOS+node+npm, if it doesn't work for you please open an issue.

# Banal

On-demand bundle analyzer, powered by esbuild.

## Features

This little terminal app exists because [Bundlephobia](https://bundlephobia.com) and [bundlejs](https://bundlejs.com) are pretty cool and useful, but bundling locally and with offline support can easily work more reliably.

- **Simple**: the way this app works is super simple, it just generates the metadata file for the [bundler analyzer](https://esbuild.github.io/analyze) in a temporary directory, embeds it inside the bundle analyzer itself, and opens it.
- **Secure**: postinstall scripts are disabled for security reasons, and only dependencies I personally maintain and [`esbuild`](https://github.com/evanw/esbuild) are used.
- **Available**: unless NPM itself is unreachable, or esbuild can't bundle your modules, this bundle analyzer will always be available.
- **Customizable**: some important options, like the target platform or the target format, can be configured. Unlike in [Bundlephobia](https://bundlephobia.com) where for many modules bundling will just fail.
- **Reliable**: bundling locally on your computer works more reliably than what [bundlejs](https://bundlejs.com) is doing, for example this works better with modules marked as side-effects-free, just by default.
- **Offline support**: esbuild's amazing [bundle analyzer](https://esbuild.github.io/analyze) is embedded within the app, so the analysis can potentially even work if you are offline, if NPM has the modules you want to analyze cached already.
- **Sharing support**: a single HTML file is generated, specific to the analyzed modules, so it can be shared trivially.

## Install

```sh
npm install -g banal
```

## Usage

https://github.com/fabiospampinato/banal/assets/1812093/554327fa-c070-44af-89fb-52eff57a70ce

Some example usages:

```sh
# Analyze a single module
banal -m crypto-sha

# Analyze a single module at a specific version
banal -m crypto-sha@1.0.0

# Analyze a single namespaced module
banal @fabiospampinato/is

# Analyze multiple modules together
banal -m crypto-sha @fabiospampinato/is

# Analyze a Node module
banal -p node -m banal

# Analyze a single module with a custom entry file
banal -m @fabiospampinato/is -e 'export {isWeakRef} from "@fabiospampinato/is";'
```

## License

- App: MIT © Fabio Spampinato
- Bundler & Analyzer: MIT © [@evanw](https://github.com/evanw)
