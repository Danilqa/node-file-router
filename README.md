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
// https://api-shop.com/summer/sneakers/nike
// -> file: /api/shop/[...categories].ts

export default function(req, res, { categories }) {
  // categories -> ['summer', 'sneakers', 'nike'];
}
```

# Documentation

Visit [website](https://danilqa.github.io/node-file-router/docs/getting-started) to get started and view 
the full documentation.

# Examples

Visit [examples folder](https://github.com/Danilqa/node-file-router/tree/main/examples) to see samples with 
different module systems, adapters, and use cases.

# Community

Ask questions, voice ideas, and share your projects on [Github Discussion](https://github.com/Danilqa/node-file-router/discussions).
