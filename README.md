# Node File Router

<img align="right" width="92" height="92" title="Node File Router Logo"
src="./static/images/logo.png" />

[![ci Status](https://github.com/danilqa/node-file-router/actions/workflows/deploy.yml/badge.svg)](https://github.com/Danilqa/node-file-router/actions)
[![npm downloads](https://snyk.io/test/github/danilqa/node-file-router/badge.svg)](https://snyk.io/test/github/danilqa/node-file-router)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/danilqa/node-file-router/blob/main/LICENSE)

A file-based routing for Node.js.

* **Technology Agnostic**: 
  * Pure Node HTTP
  * Bun
  * Express
  * Sockets
  * ... whatever compatible with the interface
* **0** dependencies
* **CommonJS** and **ES modules** support
* **TypeScript** support
* **100%** test coverage

```js
// https://api-shop.com/documents/12/drafts/78
// -> file: /api/documents/[documentId]/drafts/[draftId].js

export default {
  get(req, res, routeParams) {
    const { documentId, draftId } = routeParams;
    res.end(`Requested document ${documentId} and his draft ${draftId}`);
  },
  post(req, res, routeParams) {
    const { documentId, draftId } = routeParams;
    res.end(`Created draft ${draftId} for document ${documentId}`);
  },
  patch(req, res, routeParams) {
  },
}
```

```js
// GET: https://api-shop.com/summer/sneakers/nike
// -> file: /api/shop/[...categories].[get].ts

export default function(req, res, { categories }) {
  // categories -> ['summer', 'sneakers', 'nike'];
}
```

# Documentation

Visit [website](https://danilqa.github.io/node-file-router/) to get started and view 
the full documentation.

Usage:
* [Getting started](https://danilqa.github.io/node-file-router/docs/getting-started)
* [Usage guide](https://danilqa.github.io/node-file-router/docs/usage-guide)
  * [Configuration](https://danilqa.github.io/node-file-router/docs/usage-guide#configuration)
* [Usage with Bun](https://danilqa.github.io/node-file-router/docs/use-with-bun)

Methods routing:
* [Any method](https://danilqa.github.io/node-file-router/docs/usage-guide#any-method)
* [Object with methods](https://danilqa.github.io/node-file-router/docs/usage-guide#object-with-methods)
* [Methods in filenames](https://danilqa.github.io/node-file-router/docs/usage-guide#methods-in-filenames)

Route matching:
* [Plain match](https://danilqa.github.io/node-file-router/docs/route-matching#direct-matching) - /plain/route/
* [Exact slug](https://danilqa.github.io/node-file-router/docs/route-matching#exact-matching) - /[id]/
* [Catching all](https://danilqa.github.io/node-file-router/docs/route-matching#catching-all) - /[id1]/[id2]/[idn]/
* [Optional catching all](https://danilqa.github.io/node-file-router/docs/route-matching#optional-catching-all) - ?/[id1]/[id2]/[idn]/

Support other protocols and frameworks:
* [Custom adapter](https://danilqa.github.io/node-file-router/docs/custom-adapter)

# Examples

Visit [examples folder](https://github.com/Danilqa/node-file-router/tree/main/examples) to see samples with 
different module systems, adapters, and use cases.

# Developing

To begin development and contribution, read [this guide](/contributing/developing.md).

# Community

Ask questions, voice ideas, and share your projects on [Github Discussion](https://github.com/Danilqa/node-file-router/discussions).
