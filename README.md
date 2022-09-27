# KrakenFlex Technical Test

## Introduction

This repository contains the solution to the KrakenFlex Back End Test by Ed Askew <edward.askew@foonet.me.uk>

## Installing dependencies

The current node LTS release (16.17.1) was used in development, it is likely that other versions will work but this has not been tested and you do so at your own risk. Given a compatible version of node and npm is installed, the required dependencies can be installed by running `npm install` (use `npm install --dev` if you have NODE_ENV set to `production` for some reason).

## Usage

As the code is typescript it can either be run with on-the-fly transpilation using `ts-node` (installed as part of the devDependencies) or can be pre-transpiled and run directly with node.

To pre-transpile, use:

```bash
    npm run build
```

(or alternatively `npx tsc` or even just `tsc` if you have tsc globally installed and are allergic to superfluous key presses), and then run using:

```bash
    node dist/index.js -k <API_KEY>
```

from the repository's top level directory.

To run using `ts-node` use:

```bash
    npx ts-node src/index.ts -k <API_KEY>
```

from the repository's top level directory (again npx may not be needed if you have an appropriate version of ts-node installed globally)

The only required command line argument is the api-key, provided with the `-k` option flag (or `--apiKey` or `--api-key` long options) as demonstrated above. It is not included in this repository in order to comply with best practice which would discourage the inclusion of such auth tokens in a public repository but may be obtained from me on request via the email above.

Additional optional command line arguments are documented using the `--help` switch but are strictly unnecessary to satisfy the original brief and so are omitted here.

## Running Tests

Tests can be run using the standard `npm test` command. At time of writing all tests pass on my machine, please let me know if you find otherwise.